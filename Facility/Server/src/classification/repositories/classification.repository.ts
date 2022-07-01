import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// import { CustomNeo4jError, Neo4jService } from 'sgnm-neo4j';

import { PaginationNeo4jParams } from 'src/common/commonDto/pagination.neo4j.dto';
import { CreateClassificationDto } from '../dto/create-classification.dto';
import { UpdateClassificationDto } from '../dto/update-classification.dto';
import { int } from 'neo4j-driver';
import { Classification } from '../entities/classification.entity';
import { BaseGraphDatabaseInterfaceRepository, nodeHasChildException } from 'ifmcommon';
import { ClassificationNotFountException } from 'src/common/notFoundExceptions/not.found.exception';
import { assignDtoPropToEntity, createDynamicCyperCreateQuery, createDynamicCyperObject } from 'src/common/func/neo4js.func';

import { CustomNeo4jError, Neo4jService } from 'src/sgnm-neo4j/src';

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
    const node = await this.neo4jService.findByRealmWithTreeStructure(label, realm);
    
    if (!node) {
      throw new ClassificationNotFountException(realm);
    }
    return node;
  }
//yenilenecek
  // async findAllByClassName(data: PaginationNeo4jParamsWithClassName) {
  //   try {
  //     let { page = 0, orderByColumn = "name" } = data;
  //   const { limit = 10, className, orderBy = "DESC" } = data;

  //   if (orderByColumn == "undefined") {
  //     orderByColumn = "name";
  //   }
  //   const res = await this.neo4jService.findNodeCountByClassName(className);
  //   if(!res){
  //     throw new Error("hata")
  //   }
  //   const count = res.result;

  //   const pagecount = Math.ceil(count / limit);

  //   if (page > pagecount) {
  //     page = pagecount;
  //   }
  //   let skip = page * limit;
  //   if (skip >= count) {
  //     skip = count - limit;
  //     if (skip < 0) {
  //       skip = 0;
  //     }
  //   }
  //   const getNodeWithoutParent =
  //     "MATCH (x {isDeleted: false}) where x.hasParent = false and x.class_name=$class_name return x ORDER BY x." +
  //     orderByColumn +
  //     " " +
  //     orderBy +
  //     " SKIP $skip LIMIT $limit";
  //   const result = await this.neo4jService.read(getNodeWithoutParent, {
  //     className,
  //     skip: int(skip),
  //     limit: int(limit),
  //   });
  //   if(!result){
  //     throw new HttpException("hata var",404);

  //   }
  //   const arr = [];
  //   for (let i = 0; i < result["records"].length; i++) {
  //     arr.push(result["records"][i]["_fields"][0]);
  //   }
  //   const pagination = { count, page, limit };
  //   const nodes = [];
  //   nodes.push(arr);
  //   nodes.push(pagination);
  //   return nodes;

  //   } catch (error) {
    
  //     if (error.response.code) {
  //       throw new HttpException(
  //         { message: error.response.message, code: error.response.code },
  //         error.status
  //       );
  //     }
  //     throw Error(error.message);
  //   }
    
  // }



    
    
  

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
    const dynamicObject = createDynamicCyperObject(updateClassificationto);
    //dynamicObject['id'] = int(_id);

    const updatedNode = await this.neo4jService.updateById(_id, dynamicObject);
    if (!updatedNode) {
      throw new ClassificationNotFountException(_id);
    }
    return updatedNode;
  }
  async delete(_id: string) {
    try {
     
      let hasParent = await this.neo4jService.getParentById(_id);
      let deletedNode;
      //if (hasParent['records'].length > 0) { bu if hem gereksiz hem hatalı zaten bize records[0] dönüyor
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


