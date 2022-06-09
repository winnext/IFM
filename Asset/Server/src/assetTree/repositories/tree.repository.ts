import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CustomNeo4jError, Neo4jService } from 'sgnm-neo4j';
import { PaginationNeo4jParams } from 'src/common/commonDto/pagination.neo4j.dto';
import { int } from 'neo4j-driver';
import { BaseGraphDatabaseInterfaceRepository, nodeHasChildException } from 'ifmcommon';
import { ClassificationNotFountException } from 'src/common/notFoundExceptions/not.found.exception';
import { assignDtoPropToEntity, createDynamicCyperObject } from 'src/common/func/neo4js.func';
import { Neo4jLabelEnum } from 'src/common/const/neo4j.label.enum';
import { Tree } from '../entities/tree.entity';
import { CreateTreeDto } from '../dto/create.tree.dto';
import { UpdateTreeDto } from '../dto/update.tree.dto';
import { CreateTestDto } from '../dto/create.test.dto';

@Injectable()
export class TreeRepository implements BaseGraphDatabaseInterfaceRepository<Tree> {
  constructor(private readonly neo4jService: Neo4jService) {}
  async create(createClassificationDto: CreateTestDto) {
    const test = await this.addRelationWithRelationName(
      createClassificationDto.structure_id,
      createClassificationDto.asset_id,
      'CONTAINS',
    );
    const test2 = await this.addRelationWithRelationName(
      createClassificationDto.asset_id,
      createClassificationDto.structure_id,
      'IN',
    );
    console.log(test, test2);
    return 'success';
  }
  async addRelationWithRelationName(first_node_id: string, second_node_id: string, relationName: string) {
    try {
      const res = await this.neo4jService.write(
        `MATCH (c {isDeleted: false}) where id(c)= $first_node_id MATCH (p {isDeleted: false}) where id(p)= $second_node_id merge (c)-[:${relationName}]-> (p)`,
        {
          first_node_id: parseInt(first_node_id),
          second_node_id: parseInt(second_node_id),
        },
      );
      return res;
    } catch (error) {
      //throw newError(failedResponse(error), '400');
      console.log(error);
    }
  }
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
  // async create(createClassificationDto: CreateTreeDto) {
  //   let classification = new Tree();
  //   classification = assignDtoPropToEntity(classification, createClassificationDto);
  //   const createdNode = await this.neo4jService.create(classification, Neo4jLabelEnum.TREE);
  //   return createdNode;
  // }
  async update(_id: string, updateClassificationto: UpdateTreeDto) {
    const dynamicObject = createDynamicCyperObject(updateClassificationto);
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
      console.log(node);
      if (!node) {
        throw new ClassificationNotFountException(key);
      }
      return node;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
