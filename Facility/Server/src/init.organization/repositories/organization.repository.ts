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
    const obj = {
      canDelete: false,
      isDeleted: false,
      name: '',
      realm: 'Signum',
    };

    //create  node with multi or single label
    const infraNode = await this.neo4jService.createNode(
      { canDelete: false, isDeleted: false, name: 'Infra', realm: 'Signum' },
      ['Infra'],
    );
    const classificationNode = await this.neo4jService.createNode(
      { canDelete: false, isDeleted: false, name: 'Classification', realm: 'Signum' },
      ['Classification'],
    );
    const typeNode = await this.neo4jService.createNode(
      { canDelete: false, isDeleted: false, name: 'Types', realm: 'Signum' },
      ['Types'],
    );
    console.log(typeNode);

    await this.neo4jService.addRelations(classificationNode.identity.low, infraNode.identity.low);
    await this.neo4jService.addRelations(typeNode.identity.low, infraNode.identity.low);

    const omni11Node = await this.neo4jService.createNode(
      {
        canDelete: false,
        isDeleted: false,
        name: 'OmniClass11',
        realm: 'Signum',
        isRoot: true,
        canCopied: true,
      },
      ['OmniClass11'],
    );

    const facilityStatusNode = await this.neo4jService.createNode(
      {
        canDelete: false,
        isDeleted: false,
        name: 'FacilityStatus',
        realm: 'Signum',
        isRoot: true,
        canCopied: true,
      },
      ['FacilityStatus'],
    );

    const FacilityDocTypesNode = await this.neo4jService.createNode(
      {
        canDelete: false,
        isDeleted: false,
        name: 'FacilityDocTypes',
        realm: 'Signum',
        isRoot: true,
        canCopied: true,
      },
      ['FacilityDocTypes'],
    );
    await this.neo4jService.addRelations(omni11Node.identity.low, classificationNode.identity.low);
    await this.neo4jService.addRelations(facilityStatusNode.identity.low, classificationNode.identity.low);
    await this.neo4jService.addRelations(FacilityDocTypesNode.identity.low, classificationNode.identity.low);

    const facilityTypesNode = await this.neo4jService.createNode(
      {
        canDelete: false,
        isDeleted: false,
        name: 'FacilityTypes',
        realm: 'Signum',
        isRoot: true,
        canCopied: true,
      },
      ['FacilityTypes'],
    );

    await this.neo4jService.addRelations(facilityTypesNode.identity.low, typeNode.identity.low);

    const facilityStatusNode1 = await this.neo4jService.createNode({
      canDelete: true,
      isDeleted: false,
      name_TR: 'Kullanımda',
      name_EN: 'In used',
    });
    const facilityStatusNode2 = await this.neo4jService.createNode({
      canDelete: true,
      isDeleted: false,
      name_TR: 'Kullanım dışı',
      name_EN: 'out of use',
    });

    const facilityStatusNode3 = await this.neo4jService.createNode({
      canDelete: true,
      isDeleted: false,
      name_TR: 'Kiralık',
      name_EN: 'rented',
    });
    const facilityStatusNode4 = await this.neo4jService.createNode({
      canDelete: true,
      isDeleted: false,
      name_TR: 'Satıldı',
      name_EN: 'sold',
    });
    await this.neo4jService.addRelations(facilityStatusNode1.identity.low, facilityStatusNode.identity.low);
    await this.neo4jService.addRelations(facilityStatusNode2.identity.low, facilityStatusNode.identity.low);
    await this.neo4jService.addRelations(facilityStatusNode3.identity.low, facilityStatusNode.identity.low);
    await this.neo4jService.addRelations(facilityStatusNode4.identity.low, facilityStatusNode.identity.low);

    const facilityTypesNode1 = await this.neo4jService.createNode({
      canDelete: true,
      isDeleted: false,
      name_TR: 'Bina',
      name_EN: 'Building',
    });
    const facilityTypesNode2 = await this.neo4jService.createNode({
      canDelete: true,
      isDeleted: false,
      name_TR: 'Kat',
      name_EN: 'Floor',
    });
    const facilityTypesNode3 = await this.neo4jService.createNode({
      canDelete: true,
      isDeleted: false,
      name_TR: 'Room',
      name_EN: 'Oda',
    });
    await this.neo4jService.addRelations(facilityTypesNode1.identity.low, facilityTypesNode.identity.low);
    await this.neo4jService.addRelations(facilityTypesNode2.identity.low, facilityTypesNode.identity.low);
    await this.neo4jService.addRelations(facilityTypesNode3.identity.low, facilityTypesNode.identity.low);

    return facilityTypesNode;
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

    const infraFirstLevelChildren = await this.getInfraChildren();

    infraFirstLevelChildren.map(async (node) => {
      //from lvl 1 to lvl 2 which nodes are replicable
      const replicableNodes = await this.getReplicableNodesFromFirstLvlNode(node.identity.low);

      //target realm node(Classification,Types)
      const targetRealmNode = await this.findByRealm(node.labels[0], realm);

      const replicableNodeWithRealm = replicableNodes.map(async (replicableNode) => {
        replicableNode.properties.realm = realm;
        const createdNodes = await this.neo4jService.createNode(replicableNode.properties, replicableNode.labels);

        await this.neo4jService.addRelations(createdNodes.identity.low, targetRealmNode.identity.low);

        await this.copySubGrapFromOneNodetOaNOTHER(replicableNode.labels[0], realm, replicableNode.properties.name);
        return replicableNode;
      });
    });

    await this.kafkaService.producerSendMessage('createFacility', JSON.stringify(organizationNode.properties));

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
      `match(n:Infra {realm:'Signum'} ) match (p ) MATCH(n)-[:PARENT_OF]->(p) return p`,
      {},
    );

    const nodesChildren = nodes.records.map((children) => {
      return children['_fields'][0];
    });

    return nodesChildren;
  }

  async getReplicableNodesFromFirstLvlNode(id) {
    const nodes = await this.neo4jService.read(
      `match(n) where id(n)=$id match (p {canCopied:true,isRoot:true}) MATCH(n)-[:PARENT_OF]->(p) return p`,
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
    } catch (error) {
      if (error.response?.code) {
        throw new HttpException({ message: error.response?.message, code: error.response?.code }, error.status);
      } else {
        throw new HttpException(error, 500);
      }
    }
  }
}