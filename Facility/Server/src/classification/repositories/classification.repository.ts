import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// import { CustomNeo4jError, Neo4jService } from 'sgnm-neo4j';

import { PaginationNeo4jParams } from 'src/common/commonDto/pagination.neo4j.dto';
import { CreateClassificationDto } from '../dto/create-classification.dto';
import { UpdateClassificationDto } from '../dto/update-classification.dto';
import { Classification } from '../entities/classification.entity';
import { BaseGraphDatabaseInterfaceRepository, nodeHasChildException } from 'ifmcommon';
import { ClassificationNotFountException } from 'src/common/notFoundExceptions/not.found.exception';


import { assignDtoPropToEntity, createDynamicCyperObject, CustomNeo4jError, Neo4jService } from 'src/sgnm-neo4j/src';

import { create_node__must_entered_error, create_node__node_not_created_error, find_by_realm_with_tree_structure__not_entered_error, find_by_realm__not_entered_error, find_by_realm__not_found_error, find_with_children_by_realm_as_tree_error, find_with_children_by_realm_as_tree__find_by_realm_error, find_with_children_by_realm_as_tree__not_entered_error, tree_structure_not_found_by_realm_name_error } from 'src/sgnm-neo4j/src/constant/custom.error.object';
import { GeciciInterface } from 'src/common/interface/gecici.interface';

@Injectable()
export class ClassificationRepository implements GeciciInterface<Classification> {
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

  async findOneByRealm(label: string, realm: string) {
    let node = await this.neo4jService.findByRealmWithTreeStructure(label, realm);
    
    if (!node) {
      throw new ClassificationNotFountException(realm);
    }
    node = await this.neo4jService.changeObjectChildOfPropToChildren(node);

    return node;
  }

    
  

  async create(createClassificationDto: CreateClassificationDto) {
    let classification = new Classification();
    let classificationObject = assignDtoPropToEntity(classification, createClassificationDto);
    let value;
    if (classificationObject['labels']) {
      value = await this.neo4jService.createNode(classificationObject['entity'], classificationObject['labels']);
    }
    else {
      value = await this.neo4jService.createNode(classificationObject['entity']);
    }
    value['properties']['id'] = value['identity'].low;
    const result = {id:value['identity'].low, labels: value['labels'], properties: value['properties']}
    if (classificationObject['parentId']) {
      await this.neo4jService.addRelations(
        result['id'], createClassificationDto["parentId"]
      );
    }

    return result;
  }

  async update(_id: string, updateClassificationto: UpdateClassificationDto) {
    let updateClassificationDtoWithoutLabelsAndParentId={};
    
    Object.keys(updateClassificationto).forEach((element) => {
      if (element != 'labels' && element != 'parentId' ) {
        updateClassificationDtoWithoutLabelsAndParentId[element] = updateClassificationto[element];
      }
    });
    
    const dynamicObject = createDynamicCyperObject(updateClassificationto);

    const updatedNode = await this.neo4jService.updateById(_id, dynamicObject);
    if (!updatedNode) {
      throw new ClassificationNotFountException(_id);
    }
    const result = {id:updatedNode['identity'].low, labels: updatedNode['labels'], properties: updatedNode['properties']} 
    if (updateClassificationto['labels'] && updateClassificationto['labels'].length > 0) {   
      await this.neo4jService.removeLabel(_id,result["labels"]);
      await this.neo4jService.updateLabel(_id,updateClassificationto['labels']);
    }
    return result;
  }
  async delete(_id: string) {
    try {
     
      //let hasParent = await this.neo4jService.getParentById(_id);
      let deletedNode;
         let hasChildren =  await this.neo4jService.findChildrenById(_id);       
         if (hasChildren['records'].length == 0) {
           deletedNode = await this.neo4jService.delete(_id);
           if (!deletedNode) {
             throw new ClassificationNotFountException(_id);
          }
         }
     // }
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
  async changeNodeBranch(_id: string, target_parent_id: string) {
    try {
      await this.neo4jService.deleteRelations(_id);
      await this.neo4jService.addRelations(_id, target_parent_id);
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
      const result = {id:node['identity'].low, labels: node['labels'], properties: node['properties']}
      return result;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



}


