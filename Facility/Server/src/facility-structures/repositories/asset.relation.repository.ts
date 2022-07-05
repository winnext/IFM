import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  FacilityStructureNotFountException,
  RelationNotFountException,
} from '../../common/notFoundExceptions/not.found.exception';
import { FacilityStructure } from '../entities/facility-structure.entity';
import { CustomNeo4jError, Neo4jService } from 'src/sgnm-neo4j/src';
import { nodeHasChildException } from 'ifmcommon';
import { VirtualNodeInterface } from 'src/common/interface/relation.node.interface';
import { CreateAssetRelationDto } from '../dto/asset.relation.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { KafkaService } from 'src/kafka/kafka.service';

@Injectable()
export class AssetRelationRepository implements VirtualNodeInterface<FacilityStructure> {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly kafkaService: KafkaService,
    private readonly httpService: HttpService,
  ) {}

  async findOneById(id: string) {
    const node = await this.neo4jService.write(`match(p) where id(p)=$id return p`, {
      id: parseInt(id),
    });
    if (!node.records[0]) {
      //throw new HttpException('uygun node id si giriniz', 400);
      throw new RelationNotFountException(id);
    }

    //find by id with specific relation name which node has that specific relations
    const relations = await this.neo4jService.write(
      `match(p) where id(p)=$id match (c) match (p)-[:HAS]->(c) return c`,
      {
        id: parseInt(id),
      },
    );
    if (relations.records.length === 0) {
      //throw new HttpException('hiç ilişkisi yok', 400);
      throw new RelationNotFountException(id);
    }

    const assetArr = [];
    relations.records[0]['_fields'].forEach(async (assetNode) => {
      const y = await this.httpService.get(assetNode.properties.url).pipe(map((response) => response.data));
      assetArr.push(await firstValueFrom(y));
    });
    /*
    for (let index = 0; index < relations.records[0]['_fields'].length; index++) {
      relations.records[0]['_fields'][index];
      const y = await this.httpService
        .get(relations.records[0]['_fields'][index].properties.url)
        .pipe(map((response) => response.data));
      assetArr.push(await firstValueFrom(y));
    }
*/
    return assetArr;
  }
  async create(id: string, createAssetRelationDto: CreateAssetRelationDto) {
    const relationExist = await this.neo4jService.read(
      `match(p) where id(p)=$id match (c) where c.id=$assetId match (p)-[:HAS]->(c) return c`,
      {
        id: parseInt(id),
        assetId: createAssetRelationDto.id,
      },
    );
    if (relationExist.records[0] && relationExist.records[0].length > 0) {
      //throw new HttpException('this relation exist', 400);
      throw new RelationNotFountException(id);
    }

    createAssetRelationDto['isDeleted'] = false;
    const assetUrl = `http://localhost:3014/asset/${createAssetRelationDto.id}`;
    createAssetRelationDto['url'] = assetUrl;
    const value = await this.neo4jService.createNode(createAssetRelationDto, ['Virtual', 'Asset']);

    //  value['properties']['id'] = value['identity'].low;
    // const result = { id: value['identity'].low, labels: value['labels'], properties: value['properties'] };

    await this.neo4jService.addRelationWithRelationName(id, String(value['identity'].low), 'HAS');

    await this.neo4jService.addRelationWithRelationName(id, String(value['identity'].low), 'HAS_VİRTUAL_RELATION');

    const structureUrl = `http://localhost:3010/${id}`;
    const kafkaObject = { id: id, parentId: createAssetRelationDto.id, url: structureUrl };
    await this.kafkaService.producerSendMessage('assetRelation', JSON.stringify(kafkaObject));

    return 'succes';
  }

  async delete(_id: string) {
    try {
      let deletedNode;

      const hasChildren = await this.neo4jService.findChildrenById(_id);
      if (hasChildren['records'].length == 0) {
        deletedNode = await this.neo4jService.delete(_id);
        if (!deletedNode) {
          throw new FacilityStructureNotFountException(_id);
        }
      }
      return deletedNode;
    } catch (error) {
      const { code, message } = error.response;
      if (code === CustomNeo4jError.HAS_CHILDREN) {
        nodeHasChildException(_id);
      } else {
        throw new HttpException(message, code);
      }
    }
  }

  async findOneNodeByKey(key: string) {
    try {
      const node = await this.neo4jService.findOneNodeByKey(key);
      if (!node) {
        throw new FacilityStructureNotFountException(key);
      }
      const result = { id: node['identity'].low, labels: node['labels'], properties: node['properties'] };
      return result;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
