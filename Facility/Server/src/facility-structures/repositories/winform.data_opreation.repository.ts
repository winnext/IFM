import { HttpException, Injectable } from '@nestjs/common';
import {
  FacilityStructureNotFountException,
  RelationNotFountException,
} from '../../common/notFoundExceptions/not.found.exception';

import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { assignDtoPropToEntity, Neo4jService } from 'sgnm-neo4j/dist';
import { CreateWinformRelationDto } from '../dto/winform.relation.dto';

import { RelationName } from 'src/common/const/relation.name.enum';
import { Neo4jLabelEnum } from 'src/common/const/neo4j.label.enum';
import { WinformdataNodeInterface } from 'src/common/interface/winformdata.node.interface';
import { WinformDataOperationService } from '../services/winform.data_operation.service';
import { BaseFormdataObject } from 'src/common/baseobject/base.formdata.object';

@Injectable()
export class WinformDataOperationRepository implements WinformdataNodeInterface<any> {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly httpService: HttpService,
  ) {}

  async findOneNodeByKey(key: string) {
    const node = await this.neo4jService.findOneNodeByKey(key);
    if (!node) {
      //throw new HttpException('uygun node id si giriniz', 400);
      throw new RelationNotFountException(key);
    }

    //find by key with specific relation name which node has that specific relations
    const relations = await this.neo4jService.findNodesByKeyWithRelationName(key, RelationName.HAS_FORM);

    if (!relations || relations.length === 0) {
      //throw new HttpException('hiç ilişkisi yok', 400);
      throw new RelationNotFountException(key);
    }

    const form = await this.httpService
      .get(relations[0]['_fields'][0].properties.url)
      .pipe(
        catchError(() => {
          throw new HttpException('connection refused due to connection lost or wrong data provided', 502);
        }),
      )
      .pipe(map((response) => response.data));
    return await firstValueFrom(form);

  }

  async create(key: string, winformData: Object) {
    //is there facility-structure node 
    const node = await this.neo4jService.findOneNodeByKey(key);
    if (!node) {
      throw new FacilityStructureNotFountException(key);
    }
    // has facility-structure-node a form?
    const formNode = await this.neo4jService.findNodesByKeyWithRelationName(key, RelationName.HAS_FORM);
    if (!formNode || !formNode.length) {
      throw new FacilityStructureNotFountException(key);  //DEĞİŞECEK
    }
    //create form data node
    let baseFormdataObject = new BaseFormdataObject();
    baseFormdataObject = assignDtoPropToEntity(baseFormdataObject, winformData);
    const createNode = await this.neo4jService.createNode(baseFormdataObject, [Neo4jLabelEnum.WINFORM_DATA]);
    //create HAS_FORM_DATA relation between winform virtual node and form data node.
    await this.neo4jService.addRelationWithRelationNameByKey(formNode[0]['_fields'][0]['properties'].key, createNode.properties.key, RelationName.HAS_FORM_DATA);
    const response = { id: createNode['identity'].low, labels: createNode['labels'], properties: createNode['properties'] };
   return response;
  }



  async update(key: string, createWinformRelationDto: CreateWinformRelationDto) {
    return null;
  }



  async delete(key: string) {
    try {
      return null;
    } catch (error) {
      console.log(error);
      if (error.response?.code) {
      } else {
        throw new HttpException(error.response, error.status);
      }
    }
  }
}
