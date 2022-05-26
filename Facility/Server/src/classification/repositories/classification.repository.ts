import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CustomNeo4jError, Neo4jService } from 'sgnm-neo4j';
import { PaginationNeo4jParams } from 'src/common/commonDto/pagination.neo4j.dto';
import { CreateClassificationDto } from '../dto/create-classification.dto';
import { UpdateClassificationDto } from '../dto/update-classification.dto';
import { int } from 'neo4j-driver';
import { Classification } from '../entities/classification.entity';
import { BaseGraphDatabaseInterfaceRepository, nodeHasChildException } from 'ifmcommon';
import { ClassificationNotFountException } from 'src/common/notFoundExceptions/not.found.exception';
import { assignDtoPropToEntity, createDynamicCyperObject } from 'src/common/func/neo4js.func';

@Injectable()
export class ClassificationRepository implements BaseGraphDatabaseInterfaceRepository<Classification> {
  constructor(private readonly neo4jService: Neo4jService) {}

  async findOneById(id: string) {
    const tree = await this.neo4jService.findByIdWithTreeStructure(id);

    if (!tree) {
      throw new ClassificationNotFountException(id);
    }

    return tree;
  }

  async findAll(data: PaginationNeo4jParams) {
    const nodes = await this.neo4jService.findAllByClassName(data);
    return nodes;
  }

  async create(createClassificationDto: CreateClassificationDto) {
    let classification = new Classification();

    classification.label = createClassificationDto.code + ' . ' + createClassificationDto.name;
    classification = assignDtoPropToEntity(classification, createClassificationDto);

    const createdNode = await this.neo4jService.create(classification);

    return createdNode;
  }
  async update(_id: string, updateClassificationto: UpdateClassificationDto) {
    const { name, code } = updateClassificationto;

    const dynamicObject = createDynamicCyperObject(updateClassificationto);
    dynamicObject['label'] = code + ' . ' + name;
    dynamicObject['id'] = int(_id);

    const updatedNode = await this.neo4jService.updateById(_id, dynamicObject);
    if (!updatedNode) {
      throw new ClassificationNotFountException(_id);
    }
    return updatedNode;
  }
  async delete(_id: string) {
    try {
      const deletedNode = await this.neo4jService.delete(_id);
      if (!deletedNode) {
        throw new ClassificationNotFountException(_id);
      }
      return deletedNode;
    } catch (error) {
      const { code } = error.response;
      if (code === CustomNeo4jError.HAS_CHILDREN) {
        nodeHasChildException(_id);
      } else {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
  async changeNodeBranch(_id: string, target_parent_id: string) {
    try {
      await this.deleteRelations(_id);
      await this.addRelations(_id, target_parent_id);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async deleteRelations(_id: string) {
    await this.neo4jService.deleteRelations(_id);
  }
  async addRelations(_id: string, target_parent_id: string) {
    try {
      await this.neo4jService.addRelations(_id, target_parent_id);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneNodeByKey(key: string) {
    try {
      const node = await this.neo4jService.findOneNodeByKey(key);
      if (!node) {
        throw new ClassificationNotFountException(key);
      }
      return node;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
