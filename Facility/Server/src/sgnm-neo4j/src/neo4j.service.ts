import {
  Injectable,
  Inject,
  OnApplicationShutdown,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import neo4j, { Driver, Result, int, Transaction } from "neo4j-driver";
import { Neo4jConfig } from "./interfaces/neo4j-config.interface";
import { NEO4J_OPTIONS, NEO4J_DRIVER } from "./neo4j.constants";
import TransactionImpl from "neo4j-driver-core/lib/transaction";
import { newError } from "neo4j-driver-core";
import { findNodeCountByClassNameDto } from "./dtos/dtos";
import {
  createDynamicCyperCreateQuery,
  createDynamiCyperParam,
  updateNodeQuery,
} from "./func/common.func";
import { successResponse } from "./constant/success.response.object";
import { failedResponse } from "./constant/failed.response.object";
import { PaginationNeo4jParamsWithClassName } from "./constant/pagination.param";
import { has_children_error } from "./constant/custom.error.object";

@Injectable()
export class Neo4jService implements OnApplicationShutdown {
  private readonly driver: Driver;
  private readonly config: Neo4jConfig;

  constructor(
    @Inject(NEO4J_OPTIONS) config: Neo4jConfig,
    @Inject(NEO4J_DRIVER) driver: Driver
  ) {
    this.driver = driver;
    this.config = config;
  }

  getDriver(): Driver {
    return this.driver;
  }

  getConfig(): Neo4jConfig {
    return this.config;
  }

  int(value: number) {
    return int(value);
  }

  beginTransaction(database?: string): Transaction {
    const session = this.getWriteSession(database);

    return session.beginTransaction();
  }

  getReadSession(database?: string) {
    return this.driver.session({
      database: database || this.config.database,
      defaultAccessMode: neo4j.session.READ,
    });
  }

  getWriteSession(database?: string) {
    return this.driver.session({
      database: database || this.config.database,
      defaultAccessMode: neo4j.session.WRITE,
    });
  }

  read(
    cypher: string,
    params?: Record<string, any>,
    databaseOrTransaction?: string | Transaction
  ): Result {
    if (databaseOrTransaction instanceof TransactionImpl) {
      return (<Transaction>databaseOrTransaction).run(cypher, params);
    }

    const session = this.getReadSession(<string>databaseOrTransaction);
    return session.run(cypher, params);
  }

  write(
    cypher: string,
    params?: Record<string, any>,
    databaseOrTransaction?: string | Transaction
  ): Result {
    if (databaseOrTransaction instanceof TransactionImpl) {
      return (<Transaction>databaseOrTransaction).run(cypher, params);
    }

    const session = this.getWriteSession(<string>databaseOrTransaction);
    return session.run(cypher, params);
  }

  async findWithChildrenByIdAsTree(id: string) {
    try {
      const node = await this.findById(id);
      if (!node) {
        return null;
      }
      const idNum = parseInt(id);

      const cypher =
        "MATCH p=(n)-[:CHILDREN*]->(m) \
            WHERE  id(n) = $idNum and n.isDeleted=false and m.isDeleted=false \
            WITH COLLECT(p) AS ps \
            CALL apoc.convert.toTree(ps) yield value \
            RETURN value";

      const result = await this.read(cypher, { idNum });
      if (!result["records"][0]) {
        return null;
      }
      return result["records"][0]["_fields"][0];
    } catch (error) {
      throw newError(error, "500");
    }
  }
  async findByIdWithTreeStructure(id: string) {
    let tree = await this.findWithChildrenByIdAsTree(id);

    if (!tree) {
      return null;
    } else if (Object.keys(tree).length === 0) {
      tree = await this.findById(id);
      const rootNodeObject = { root: tree };
      return rootNodeObject;
    } else {
      const rootNodeObject = { root: tree };
      return rootNodeObject;
    }
  }
  //////////////////////////////// Atamer //////////////////////////////////////
  async findWithChildrenByIdAndLabelsAsTree(id: string, label1: string, label2: string) {
    try {
      const node = await this.findById(id);
      if (!node) {
        return null;
      }
      const idNum = parseInt(id);

      const cypher =
        "MATCH p=(n {isDeleted:false})-[:CHILDREN*]->(m {isDeleted:false}) \
            WHERE  id(n) = $idNum and n.labelclass=$label1 and m.labelclass=$label2  \
            WITH COLLECT(p) AS ps \
            CALL apoc.convert.toTree(ps) yield value \
            RETURN value";

      const result = await this.read(cypher, { idNum, label1, label2 });
      if (!result["records"][0]) {
        return null;
      }
      return result["records"][0]["_fields"][0];
    } catch (error) {
      throw newError(error, "500");
    }
  }
  async findByIdAndLabelsWithTreeStructure(id: string, label1: string, label2: string) {
    let tree = await this.findWithChildrenByIdAndLabelsAsTree(id, label1, label2);


    if (!tree) {
      return null;
    } else if (Object.keys(tree).length === 0) {
      tree = await this.findById(id);
      const rootNodeObject = { root: tree };
      return rootNodeObject;
    } else {
      const rootNodeObject = { root: tree };
      return rootNodeObject;
    }
  }
  async findByIdAndLabelsWithChildNodes(id: string, label1: string, label2: string, orderbyprop?: string,  orderbytype?: string) {
    try {
      const node = await this.findById(id);
      if (!node) {
        return null;
      }
      const idNum = parseInt(id);
      let cypher = "";
      if (orderbyprop) {
        cypher = `MATCH (c: ${label1} {isDeleted: false})-[:CHILDREN]->(n: ${label2} {isDeleted: false}) where id(c)=$idNum return n order by n.${orderbyprop} ${orderbytype}`;
      }
      else {
        cypher = `MATCH (c: ${label1} {isDeleted: false})-[:CHILDREN]->(n: ${label2} {isDeleted: false}) where id(c)=$idNum return n`;
      } 

      const result = await this.read(cypher, { idNum });
   
      if (!result["records"][0]) {
        return null;
      }
      return result["records"];
    } catch (error) {
      throw newError(error, "500");
    }
  }

  async findByIdAndLabelsWithActiveChildNodes(id: string, label1: string, label2: string, orderbyprop?: string,  orderbytype?: string) {
    try {
      const node = await this.findById(id);
      if (!node) {
        return null;
      }
      const idNum = parseInt(id);
      let cypher = "";
      if (orderbyprop) {
        cypher = `MATCH (c: ${label1} {isDeleted: false, isActive: true})-[:CHILDREN]->(n: ${label2} {isDeleted: false, isActive: true}) where id(c)=$idNum return n order by n.${orderbyprop} ${orderbytype}`;
      }
      else {
        cypher = `MATCH (c: ${label1} {isDeleted: false, isActive: true})-[:CHILDREN]->(n: ${label2} {isDeleted: false, isActive: true}) where id(c)=$idNum return n`;
      } 
      const result = await this.read(cypher, { idNum });
   
      if (!result["records"][0]) {
        return null;
      }
      return result["records"];
    } catch (error) {
      throw newError(error, "500");
    }
  }

  async findNodeByIdAndLabel(id: string, label: string) {
    try {
      const idNum = parseInt(id);
      const cypher = `MATCH (c: ${label} {isDeleted: false}) where id(c)=$idNum return c`;
      const result = await this.read(cypher, { idNum });
   
      if (!result["records"][0]) {
        return null;
      }
      return result["records"];
    } catch (error) {
      throw newError(error, "500");
    }
}
  //////////////////////////////////////////////////////////////////////////////
  async findById(id: string, databaseOrTransaction?: string | Transaction) {
    try {
      const idNum = parseInt(id);

      const cypher =
        "MATCH (n {isDeleted: false}) where id(n) = $idNum return n";

      const result = await this.read(cypher, { idNum });
      if (!result["records"][0]) {
        return null;
      }

      return result["records"][0]["_fields"][0];
    } catch (error) {
      throw newError(error, "500");
    }
  }

  async findNodeCountByClassName(    //DİKKAT1   önceki isminde ilave olarak withoutChildren vardı.
    class_name: string,
    databaseOrTransaction?: string | Transaction
  ) {
    try {
      const cypher = `MATCH (c {isDeleted: false}) where c.hasParent = false and c.class_name=$class_name RETURN count(c)`;

      const res = await this.read(cypher, { class_name });

      return successResponse(res["records"][0]["_fields"][0].low);
    } catch (error) {
      throw newError(error, "500");
    }
  }

  async findRootNodeByClassName(
    params: findNodeCountByClassNameDto,
    databaseOrTransaction?: string | Transaction
  ) {
    try {
      const cypher = `MATCH (node {isDeleted: false}) where node.hasParent = false and node.class_name=$class_name return node`;

      const res = await this.read(cypher, params);

      return successResponse(res);
    } catch (error) {
      throw newError(error, "500");
    }
  }

  async createNode(     //DİKKAT 
    params: object,
    label: string,
    databaseOrTransaction?: string | Transaction
    ) {
    try {
      const cyperQuery = createDynamicCyperCreateQuery(params,label);

      if (databaseOrTransaction instanceof TransactionImpl) {
        return (<Transaction>databaseOrTransaction).run(cyperQuery, params);
      }

      const res = await this.write(cyperQuery, params);

      return res["records"][0]["_fields"][0];
    } catch (error) {
      throw newError(error, "500");
    }
  }

  async updateById(id: string, params: object) {
    try {
      const node = await this.findById(id);
      if (!node) {
        return null;
      }
      const cyperQuery = updateNodeQuery(id, params);

      const res = await this.write(cyperQuery, params);

      return res["records"][0]["_fields"][0];
    } catch (error) {
      throw newError(error, "500");
    }
  }

  async deleteRelations(id: string) {
    try {
      //parentı getirme querisi
      await this.findById(id);
      const parentNode = await this.getParentById(id);
      const parent_id = parentNode["_fields"][0]["properties"].self_id.low;
      //delete relation query
      if (parentNode) {
        await this.deleteChildrenRelation(id);
        await this.deleteParentRelation(id);
        //-------------------------------------------------

        //nodun bir propertisini güncelleme
        await this.updateHasParentProp(id, false);

        //nodun bir relationınında kaç node olduğunu bulma
        const parentChildCount = await this.getChildrenCount(parent_id);

        if (parentChildCount === 0) {
          //nodun bir propertisini güncelleme
          this.updateSelectableProp(parent_id, true);
        }
      }
    } catch (error) {
      throw newError(error, "500");
    }
  }
  async addRelations(_id: string, _target_parent_id: string) {
    try {
      await this.addChildrenRelationById(_id, _target_parent_id);

      await this.addParentRelationById(_id, _target_parent_id);

      //update 1 property of node
      await this.updateHasParentProp(_id, true);

      //update 1 property of node
      await this.updateSelectableProp(_target_parent_id, false);
    } catch (error) {
      throw newError(error, "500");
    }
  }
  async findOneNodeByKey(key: string) {
    try {
      //find node by key
      const result = await this.read(
        "match (n {isDeleted: false, key:$key})  return n",
        { key: key }
      );

      if (!result) {
        return null;
      }
      var node = result["records"][0]["_fields"][0];

      return node;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateHasParentProp(id: string, hasParent: boolean) {
    try {
      const res = await this.write(
        "MATCH (node {isDeleted: false}) where id(node)= $id set node.hasParent=$hasParent return node",
        {
          id: parseInt(id),
          hasParent,
        }
      );

      return successResponse(res["records"][0]["_fields"][0]);
    } catch (error) {
      throw newError(failedResponse(error), "400");
    }
  }

  async updateIsDeletedProp(id: string, isDeleted: boolean) {
    try {
      const res = await this.write(
        "MATCH (node {isDeleted: false}) where id(node)= $id set node.isDeleted=$isDeleted return node",
        {
          id: parseInt(id),
          isDeleted,
        }
      );

      return successResponse(res["records"][0]["_fields"][0]);
    } catch (error) {
      throw newError(failedResponse(error), "400");
    }
  }

  async updateSelectableProp(id: string, selectable: boolean) {
    try {
      const res = await this.write(
        "MATCH (node {isDeleted: false}) where id(node)= $id set node.selectable=$selectable return node",
        {
          id: parseInt(id),
          selectable,
        }
      );

      return successResponse(res["records"][0]["_fields"][0]);
    } catch (error) {
      throw newError(failedResponse(error), "400");
    }
  }

  async addRelationWithRelationName(
    first_node_id: string,
    second_node_id: string,
    relationName: string
  ) {
    try {
      const res = await this.write(
        `MATCH (c {isDeleted: false}) where id(c)= $first_node_id MATCH (p {isDeleted: false}) where id(p)= $second_node_id create (p)-[:${relationName}]-> (c)`,
        {
          first_node_id: parseInt(first_node_id),
          target_parent_id: parseInt(second_node_id),
        }
      );

      return successResponse(res);
    } catch (error) {
      throw newError(failedResponse(error), "400");
    }
  }

  async addChildrenRelationById(child_id: string, target_parent_id: string) {
    try {
      const res = await this.write(
        "MATCH (c {isDeleted: false}) where id(c)= $id MATCH (p {isDeleted: false}) where id(p)= $target_parent_id  create (p)-[:CHILDREN]-> (c)",
        { id: parseInt(child_id), target_parent_id: parseInt(target_parent_id) }
      );

      return successResponse(res);
    } catch (error) {
      throw newError(failedResponse(error), "400");
    }
  }

  async addParentRelationById(child_id: string, parent_id: string) {
    try {
      const res = await this.write(
        "MATCH (c {isDeleted: false}) where id(c)= $id MATCH (p {isDeleted: false}) where id(p)= $target_parent_id  create (c)-[:CHILD_OF]-> (p)",
        { id: parseInt(child_id), target_parent_id: parseInt(parent_id) }
      );

      return successResponse(res);
    } catch (error) {
      throw newError(failedResponse(error), "400");
    }
  }

  async createChildrenByLabelClass(entity: object, label: string) {   //DİKKAT
    try {
      delete entity["realm"]
      const dynamicCyperParameter = createDynamiCyperParam(entity,label);
      let query =
      ` match (y:${label}:${entity["labelclass"]} {isDeleted: false}) where id(y)= $parent_id  create (y)-[:CHILDREN]->`;
      if (entity["__label"]) {
        query =
        ` match (y:${label}:${entity["__labelParent"]} {isDeleted: false}) where id(y)= $parent_id  create (y)-[:CHILDREN]->`;
      }
      query = query +  dynamicCyperParameter;  

      const res = await this.write(query, entity);

      return successResponse(res);
    } catch (error) {
      throw newError(failedResponse(error), "400");
    }
  }

  async addParentByLabelClass(entity, label: string) {  //DİKKAT
    
    let query = `match (x:${label}:${entity.labelclass} {isDeleted: false, key: $key}) \
    match (y: ${entity.labelclass} {isDeleted: false}) where id(y)= $parent_id \
    create (x)-[:CHILD_OF]->(y)`;

    if (entity['__label']) {
      query = `match (x:${label}:${entity.__label} {isDeleted: false, key: $key}) \
      match (y: ${entity.__labelParent} {isDeleted: false}) where id(y)= $parent_id \
      create (x)-[:CHILD_OF]->(y)`;

    }
    try {
      const res = await this.write(query, entity);

      return successResponse(res);
    } catch (error) {
      throw newError(failedResponse(error), "400");
    }
  }

  async deleteRelationWithRelationName(id: string, relationName: string) {
    try {
      const res = await this.write(
        `MATCH (c {isDeleted: false})<-[r:${relationName}]-(p {isDeleted: false}) where id(c)= $id delete r`,
        { id: parseInt(id) }
      );

      return successResponse(res);
    } catch (error) {
      throw newError(failedResponse(error), "400");
    }
  }

  async deleteChildrenRelation(id: string) {
    try {
      const res = await this.write(
        "MATCH (node {isDeleted: false})<-[r:CHILDREN]-(p {isDeleted: false}) where id(node)= $id delete r",
        { id: parseInt(id) }
      );

      return successResponse(res);
    } catch (error) {
      throw newError(failedResponse(error), "400");
    }
  }

  async deleteParentRelation(id: string) {
    try {
      const res = await this.write(
        "MATCH (c {isDeleted: false})-[r:CHILD_OF]->(p {isDeleted: false}) where id(c)= $id delete r",
        { id: parseInt(id) }
      );

      return successResponse(res.records[0]);
    } catch (error) {
      throw newError(failedResponse(error), "400");
    }
  }

  async delete(id: string) {
    try {
      //children count query
      const node = await this.findById(id);

      if (!node) {
        return null;
      }

      const childrenCount = await this.getChildrenCount(id);
      
      if (childrenCount > 0) {
        throw new HttpException(has_children_error, 400);
      } else {
        const parent = await this.getParentById(id);
        const deletedNode = await this.updateIsDeletedProp(id, true);
        if (parent) {
          const parent_id = parent["_fields"][0]["properties"].self_id;
          const childrenCount = await this.getChildrenCount(parent_id);
          if (childrenCount === 0) {
            this.updateSelectableProp(parent_id, true);
          }
        }
        
        return deletedNode;
      }
    } catch (error) {
      if (error.response.code) {
        throw new HttpException(
          { message: error.response.message, code: error.response.code },
          error.status
        );
      } else {
        throw new HttpException(error, HttpStatus.NOT_ACCEPTABLE);
      }
    }
  }

  async findAllByClassName(data: PaginationNeo4jParamsWithClassName) {
    let { page = 0, orderByColumn = "name" } = data;
    const { limit = 10, class_name, orderBy = "DESC" } = data;

    if (orderByColumn == "undefined") {
      orderByColumn = "name";
    }
    const res = await this.findNodeCountByClassName(class_name);
    const count = res.result;

    const pagecount = Math.ceil(count / limit);

    if (page > pagecount) {
      page = pagecount;
    }
    let skip = page * limit;
    if (skip >= count) {
      skip = count - limit;
      if (skip < 0) {
        skip = 0;
      }
    }
    const getNodeWithoutParent =
      "MATCH (x {isDeleted: false}) where x.hasParent = false and x.class_name=$class_name return x ORDER BY x." +
      orderByColumn +
      " " +
      orderBy +
      " SKIP $skip LIMIT $limit";
    const result = await this.read(getNodeWithoutParent, {
      class_name,
      skip: int(skip),
      limit: int(limit),
    });
    const arr = [];
    for (let i = 0; i < result["records"].length; i++) {
      arr.push(result["records"][i]["_fields"][0]);
    }
    const pagination = { count, page, limit };
    const nodes = [];
    nodes.push(arr);
    nodes.push(pagination);
    return nodes;
  }

  async create(entity, label: string) {          //DİKKAT
    if (entity["parent_id"]) {
      const createdNode = await this.createChildrenByLabelClass(entity, label);

      await this.write(
        `match (x:${label}:${entity["labelclass"]} {isDeleted: false, key: $key}) set x.self_id = id(x)`,
        {
          key: entity.key,
        }
      );
      //Add relation between parent and created node by CHILD_OF relation
      await this.addParentByLabelClass(entity, label);

      //set parent node selectable prop false
      await this.updateSelectableProp(entity["parent_id"], false);

      return createdNode.result["records"][0]["_fields"][0];
    } else {
      entity["hasParent"] = false;

      const createdNode = await this.createNode(entity, label);

      await this.write(
        `match (x:${entity["labelclass"]}  {isDeleted: false,  key: $key}) set x.self_id = id(x)`,
        {
          key: entity["key"],
        }
      );
      return createdNode;
    }
  }
  ///////////////////////////////////////// atamer //////////////////////////////////////////////////////////
  async updateHasTypeProp(id: string, hasLabeledNode: boolean) {
    try {
      const res = await this.write(
        "MATCH (node {isDeleted: false}) where id(node)= $id set node.hasType=$hasLabeledNode return node",
        {
          id: parseInt(id),
          hasLabeledNode,
        }
      );

      return successResponse(res["records"][0]["_fields"][0]);
    } catch (error) {
      throw newError(failedResponse(error), "400");
    }
  }
  async createNodeWithLabel(entity, label) {
      
   
      const createdNode = await this.createChildrenByLabelClass(entity, label);
 
      await this.addParentByLabelClass(entity, label);

      return createdNode.result["records"][0]["_fields"][0];

  }
  async createNodeForParentWithLabel(entity) {
       entity.hasParent = false;


}
  
  async deleteChildrenNodesByIdAndLabels(id: string, label1: string, label2: string) {
    try {
      const childrenList = await this.write(
        `MATCH (c: ${label1} {isDeleted: false})-[:CHILDREN]->(n: ${label2}  {isDeleted: false}) where id(c)=$id detach delete n`,
       {
           id: id
         }
      );
      return childrenList["records"][0];
    } catch (error) {
      throw newError(failedResponse(error), "400");
    }
  }
  async getChildrenCountByIdAndLabels(id: string, label1: string, label2: string) {
    try {
      const res = await this.read(
        `MATCH (c {isDeleted: false}) where id(c)= $id MATCH (d {isDeleted: false}) where d:${label1} and not d:${label2} MATCH (c)-[:CHILDREN]->(d) return count(d)`,
        { id: parseInt(id) }
      );

      return res["records"][0]["_fields"][0].low;
    } catch (error) {
      throw newError(failedResponse(error), "400");
    }
  }
  async getChildrensChildrenCountByIdAndLabels(id: string, label1: string, label2: string, label3: string) {
    try {
      const res = await this.read(
        `MATCH (c {isDeleted: false}) -[r1:CHILDREN]->(p {isDeleted: false})-[r2:CHILDREN]-(s {isDeleted: false}) 
                where id(c)= $id and p:${label1} and not p:${label2} and s:${label3} return count(s)`,
        { id: parseInt(id) }
      );

      return res["records"][0]["_fields"][0].low;
    } catch (error) {
      throw newError(failedResponse(error), "400");
    }
  }

  async setDeletedTrueToNodeAndChildByIdAndLabels(id: string, label1: string, label2: string) {
    try {
      const res = await this.write(
        `MATCH (c {isDeleted: false}) where id(c)= $id MATCH (d {isDeleted: false}) where d:${label1} and not d:${label2} MATCH (c)-[:CHILDREN]->(d) 
            set c.isDeleted=true, d.isDeleted=true`,
        { id: parseInt(id) }
      );

      return res["records"];
    } catch (error) {
      throw newError(failedResponse(error), "400");
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////// 
  async getParentById(id: string) {
    try {
      const res = await this.read(
        "MATCH (c {isDeleted: false}) where id(c)= $id match(k {isDeleted: false}) match (c)-[:CHILD_OF]->(k) return k",
        { id: parseInt(id) }
      );

      return res["records"][0];
    } catch (error) {
      throw newError(failedResponse(error), "400");
    }
  }

  async getChildrenCount(id: string) {
    try {
      const res = await this.read(
        "MATCH (c {isDeleted: false}) where id(c)= $id MATCH (d {isDeleted: false}) MATCH (c)-[:CHILDREN]->(d) return count(d)",
        { id: parseInt(id) }
      );

      return res["records"][0]["_fields"][0].low;
    } catch (error) {
      throw newError(failedResponse(error), "400");
    }
  }

  onApplicationShutdown() {
    return this.driver.close();
  }

  async findWithChildrenByRealmAsTree(realm: string) {
    try {
      const node = await this.findByRealm(realm);
      if (!node) {
        return null;
      }

      const cypher =
        "MATCH p=(n)-[:CHILDREN*]->(m) \
            WHERE n.realm = $realm and n.isDeleted=false and m.isDeleted=false \
            WITH COLLECT(p) AS ps \
            CALL apoc.convert.toTree(ps) yield value \
            RETURN value";

      const result = await this.read(cypher, { realm });
      if (!result["records"][0]) {
        return null;
      }
      return result["records"][0]["_fields"][0];
    } catch (error) {
      throw newError(error, "500");
    }
  }

async findByRealmWithTreeStructure(realm: string) {
    let tree = await this.findWithChildrenByRealmAsTree(realm);

    if (!tree) {
      return null;
    } else if (Object.keys(tree).length === 0) {
      tree = await this.findByRealm(realm);
      const rootNodeObject = { root: tree };
      return rootNodeObject;
    } else {
      const rootNodeObject = { root: tree };
      return rootNodeObject;
    }
  }

async findByRealm(
    realm: string,
    databaseOrTransaction?: string | Transaction
  ) {
    try {
      const cypher =
        "MATCH (n {isDeleted: false}) where n.realm = $realm return n";

      const result = await this.read(cypher, { realm });
      if (!result["records"][0]) {
        return null;
      }

      return result["records"][0]["_fields"][0];
    } catch (error) {
      throw newError(error, "500");
    }
  }

}
