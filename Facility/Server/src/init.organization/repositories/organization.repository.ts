/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from '../dtos/create.organization.dto';
import { UpdateOrganizationDto } from '../dtos/update.organization.dto';
import { BaseInterfaceRepository } from 'src/common/interface/base.facility.interface';
import { Facility } from '../entities/facility.entity';
import { Neo4jLabelEnum } from 'src/common/const/neo4j.label.enum';
import { FacilityNotFountException } from 'src/common/notFoundExceptions/not.found.exception';
import { NestKafkaService } from 'ifmcommon';
import { Neo4jService, assignDtoPropToEntity, Transaction } from 'sgnm-neo4j/dist';

@Injectable()
export class OrganizationRepository implements BaseInterfaceRepository<Facility> {
  constructor(private readonly neo4jService: Neo4jService, private readonly kafkaService: NestKafkaService) {}

  async findOneByRealm(realm: string): Promise<Facility> {
    const facility = await this.neo4jService.read(`match (n:Root ) where n.realm=$realm return n`, { realm });
    if (!facility['records'][0]) {
      throw FacilityNotFountException(realm);
    }
    return facility['records'][0]['_fields'][0];
  }

  async findOneByRealmAndLabel(label: string, realm: string) {
    let node = await this.neo4jService.findByRealmWithTreeStructure(label, realm);

    node = await this.neo4jService.changeObjectChildOfPropToChildren(node);

    return node;
  }

  async create(createFacilityDto: CreateOrganizationDto) {
    const { structureInfo, organizationInfo, classificationInfo, realm } = createFacilityDto;

    const facility = new Facility();
    facility.realm = realm;
    const structure = new Facility();
    structure.realm = realm;
    const classification = new Facility();
    classification.realm = realm;
    const types = new Facility();
    types.realm = realm;

    const finalOrganizationObject = assignDtoPropToEntity(facility, organizationInfo);
    const finalStructureObject = assignDtoPropToEntity(structure, structureInfo);
    const finalClassificationObject = assignDtoPropToEntity(classification, classificationInfo);
    const finalTypesObject = assignDtoPropToEntity(types, classificationInfo);

    //create  node with multi or single label
    const organizationNode = await this.neo4jService.createNode(finalOrganizationObject, [Neo4jLabelEnum.ROOT]);
    const structureNode = await this.neo4jService.createNode(finalStructureObject, [Neo4jLabelEnum.FACILITY_STRUCTURE]);
    const classificationNode = await this.neo4jService.createNode(finalClassificationObject, [
      Neo4jLabelEnum.CLASSIFICATION,
    ]);
    const typeNode = await this.neo4jService.createNode(finalTypesObject, [Neo4jLabelEnum.TYPES]);

    await this.neo4jService.addRelations(structureNode.identity.low, organizationNode.identity.low);
    await this.neo4jService.addRelations(classificationNode.identity.low, organizationNode.identity.low);
    await this.neo4jService.addRelations(typeNode.identity.low, organizationNode.identity.low);
    await this.kafkaService.producerSendMessage('createFacility', JSON.stringify(organizationInfo));

    const infraFirstLevelChildren = await this.getInfraChildren();

    infraFirstLevelChildren.map(async (node) => {
      //from lvl 1 to lvl 2 which nodes are replicable
      const replicableNodes = await this.getReplicableNodesFromFirstLvlNode(node.identity.low);

      //target realm node(Classification,Types)
      const targetRealmNode = await this.findByRealm(node.labels[0], realm);

      const replicableNodeWithRealm = replicableNodes.map(async (replicableNode) => {
        replicableNode.properties.realm = realm;
        const createdNodes = await this.neo4jService.createNode(replicableNode.properties, replicableNode.labels);

        await this.neo4jService.addRelations(targetRealmNode.identity.low, createdNodes.identity.low);

        await this.copySubGrapFromOneNodetOaNOTHER(replicableNode.labels[0], realm, replicableNode.properties.name);
        return replicableNode;
      });
    });

    return organizationNode;
  }
  async update(_id: string, updateFacilityDto: UpdateOrganizationDto) {
    const updatedFacility = await this.neo4jService.updateById(_id, updateFacilityDto);

    if (!updatedFacility) {
      throw FacilityNotFountException(_id);
    }
    return updatedFacility;
  }

  //FacilityInfra yı label ve realm ile bulan fonksiyon
  //match(n:FacilityInfra {realm:'Signum'} ) return n

  //FacilityInfrayı ve çocuklarını bulan fonksiyon
  //match(n:FacilityInfra {realm:'Signum'} ) match (p ) MATCH(n)-[:PARENT_OF]->(p) return p

  //neo4j id si verilen nodun kopyalanabilir ve root olan cocuklarını getiren query
  //match(n) where id(n)=106 match (p {isCopied:true,isRoot:true}) MATCH(n)-[:PARENT_OF]->(p) return p

  async findOneById(id: string): Promise<any> {
    const infraChildren = await this.neo4jService.read(`match (n:Root ) where n.id=$id return n`, { id });
    return 'facility';
  }

  //----------------------------------------This funcs will add to  neo4j Service-------------------------
  async getInfraChildren() {
    const nodes = await this.neo4jService.read(
      `match(n:FacilityInfra {realm:'Signum'} ) match (p ) MATCH(n)-[:PARENT_OF]->(p) return p`,
      {},
    );

    const nodesChildren = nodes.records.map((children) => {
      return children['_fields'][0];
    });

    return nodesChildren;
  }

  async getReplicableNodesFromFirstLvlNode(id) {
    const nodes = await this.neo4jService.read(
      `match(n) where id(n)=$id match (p {isCopied:true,isRoot:true}) MATCH(n)-[:PARENT_OF]->(p) return p`,
      { id },
    );

    const nodesChildren = nodes.records.map((children) => {
      return children['_fields'][0];
    });

    return nodesChildren;
  }

  async getNodeByLabelAndRealm(label, realm) {
    const nodes = await this.neo4jService.findByRealm(label, realm);

    const nodesChildren = nodes.records.map((children) => {
      return children['_fields'][0];
    });

    return nodesChildren;
  }

  async findByRealm(label: string, realm: string, databaseOrTransaction?: string | Transaction) {
    try {
      if (!label || !realm) {
        throw new HttpException('not found label', 400);
      }
      const cypher = `MATCH (n:${label} {isDeleted: false}) where  n.realm = $realm return n`;

      const result = await this.neo4jService.read(cypher, { realm });

      if (!result['records'].length) {
        throw new HttpException('not found in db', 404);
      }

      return result['records'][0]['_fields'][0];
    } catch (error) {
      if (error.response?.code) {
        throw new HttpException({ message: error.response?.message, code: error.response?.code }, error.status);
      } else {
        throw new HttpException(error, 500);
      }
    }
  }

  async copySubGrapFromOneNodetOaNOTHER(
    mainLabel: string,
    realm: string,
    name,
    databaseOrTransaction?: string | Transaction,
  ) {
    try {
      const cypher = `MATCH  (rootA:${mainLabel}{name:$name,realm:'Signum'}),
      (rootB:${mainLabel}{name:$name,realm:$realm})
MATCH path = (rootA)-[:PARENT_OF*]->(node)
WITH rootA, rootB, collect(path) as paths
CALL apoc.refactor.cloneSubgraphFromPaths(paths, {
   standinNodes:[[rootA, rootB]]
})
YIELD input, output, error
RETURN input, output, error`;

      const result = await this.neo4jService.write(cypher, { realm, name });

      console.log(result);
    } catch (error) {
      if (error.response?.code) {
        throw new HttpException({ message: error.response?.message, code: error.response?.code }, error.status);
      } else {
        throw new HttpException(error, 500);
      }
    }
  }
}
