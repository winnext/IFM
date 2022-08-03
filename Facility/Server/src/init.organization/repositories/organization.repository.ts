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
import { generateUuid } from 'src/common/baseobject/base.virtual.node.object';
import { OrganizationInterface } from 'src/common/interface/organization.interface';
const exceljs = require('exceljs');

@Injectable()
export class OrganizationRepository implements OrganizationInterface<Facility> {
  constructor(private readonly neo4jService: Neo4jService, private readonly kafkaService: NestKafkaService) {}

  async findOneByRealm(realm: string): Promise<Facility> {
    const facility = await this.neo4jService.read(`match (n:Root ) where n.realm=$realm return n`, { realm });
    if (!facility['records'][0]) {
      throw FacilityNotFountException(realm);
    }
    return facility['records'][0]['_fields'][0];
  }

  async findOneByRealmAndLabel(label: string, realm: string) {
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
    await this.neo4jService.addRelations(classificationNode.identity.low, infraNode.identity.low);
    await this.neo4jService.addRelations(typeNode.identity.low, infraNode.identity.low);


    const facilityStatusNode = await this.neo4jService.createNode(
      {
        canDelete: false,
        isDeleted: false,
        name: 'FacilityStatus',
        realm: 'Signum',
        isRoot: true,
        canCopied: true,
      },
      ['FacilityStatus_EN'],
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
      ['FacilityDocTypes_EN'],
    );
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
      ['FacilityTypes_EN'],
    );

    await this.neo4jService.addRelations(facilityTypesNode.identity.low, typeNode.identity.low);

    const facilityStatusNode1 = await this.neo4jService.createNode({
      canDelete: true,
      isDeleted: false,
      name: 'In used',
    });
    const facilityStatusNode2 = await this.neo4jService.createNode({
      canDelete: true,
      isDeleted: false,
      name: 'out of use',
    });

    const facilityStatusNode3 = await this.neo4jService.createNode({
      canDelete: true,
      isDeleted: false,
      name: 'rented',
    });
    const facilityStatusNode4 = await this.neo4jService.createNode({
      canDelete: true,
      isDeleted: false,
      name: 'sold',
    });
    await this.neo4jService.addRelations(facilityStatusNode1.identity.low, facilityStatusNode.identity.low);
    await this.neo4jService.addRelations(facilityStatusNode2.identity.low, facilityStatusNode.identity.low);
    await this.neo4jService.addRelations(facilityStatusNode3.identity.low, facilityStatusNode.identity.low);
    await this.neo4jService.addRelations(facilityStatusNode4.identity.low, facilityStatusNode.identity.low);

    const facilityTypesNode1 = await this.neo4jService.createNode({
      canDelete: true,
      isDeleted: false,
      name: 'Building',
    },['FacilityType']);
    const facilityTypesNode2 = await this.neo4jService.createNode({
      canDelete: true,
      isDeleted: false,
      name: 'Floor',
    },['FacilityType']);
    const facilityTypesNode3 = await this.neo4jService.createNode({
      canDelete: true,
      isDeleted: false,
      name: 'Room',
    },['FacilityType']);
    await this.neo4jService.addRelations(facilityTypesNode1.identity.low, facilityTypesNode.identity.low);
    await this.neo4jService.addRelations(facilityTypesNode2.identity.low, facilityTypesNode.identity.low);
    await this.neo4jService.addRelations(facilityTypesNode3.identity.low, facilityTypesNode.identity.low);
  
    
    const facilityTypesNode1property1 = await this.neo4jService.createNode({
      canDelete: true,
      isDeleted: false,
      isActive: true,
      name: 'name',
      type: "input",
      dataType: "string",
      defaultValue: "",
      rules: ['not null'],
      options: [],
      placeHolder: 'Name',
      index: 0
    },['FacilityTypeProperty']);

    const facilityTypesNode1property2 = await this.neo4jService.createNode({
      canDelete: true,
      isDeleted: false,
      isActive: true,
      name: 'm2',
      type: "input",
      dataType: "number",
      defaultValue: 0,
      rules: [],
      options: [],
      placeHolder: 'M2',
      index: 1
    },['FacilityTypeProperty']);

    const facilityTypesNode1property3 = await this.neo4jService.createNode({
      canDelete: true,
      isDeleted: false,
      isActive: true,
      name: 'Count of Floor',
      type: "input",
      dataType: "number",
      defaultValue: 0,
      rules: [],
      options: [],
      placeHolder: 'Count of Floor',
      index: 1
    },['FacilityTypeProperty']);


    await this.neo4jService.addRelations(facilityTypesNode1property1.identity.low, facilityTypesNode1.identity.low);
    await this.neo4jService.addRelations(facilityTypesNode1property2.identity.low, facilityTypesNode1.identity.low);
    await this.neo4jService.addRelations(facilityTypesNode1property3.identity.low, facilityTypesNode1.identity.low);

    const facilityTypesNode2property1 = await this.neo4jService.createNode({
      canDelete: true,
      isDeleted: false,
      isActive: true,
      name: 'name',
      type: "input",
      dataType: "string",
      defaultValue: "",
      rules: ['not null'],
      options: [],
      placeHolder: 'Name',
      index: 0
    },['FacilityTypeProperty']);

    const facilityTypesNode2property2 = await this.neo4jService.createNode({
      canDelete: true,
      isDeleted: false,
      isActive: true,
      name: 'm2',
      type: "input",
      dataType: "number",
      defaultValue: 0,
      rules: [],
      options: [],
      placeHolder: 'M2',
      index: 1
    },['FacilityTypeProperty']);

    const facilityTypesNode2property3 = await this.neo4jService.createNode({
      canDelete: true,
      isDeleted: false,
      isActive: true,
      name: 'Name of Floor',
      type: "input",
      dataType: "string",
      defaultValue: "",
      rules: ['not null'],
      options: [],
      placeHolder: 'Name of Floor',
      index: 0
    },['FacilityTypeProperty']);

    await this.neo4jService.addRelations(facilityTypesNode2property1.identity.low, facilityTypesNode2.identity.low);
    await this.neo4jService.addRelations(facilityTypesNode2property2.identity.low, facilityTypesNode2.identity.low);
    await this.neo4jService.addRelations(facilityTypesNode2property3.identity.low, facilityTypesNode2.identity.low);
    
    const facilityTypesNode3property1 = await this.neo4jService.createNode({
      canDelete: true,
      isDeleted: false,
      isActive: true,
      name: 'name',
      type: "input",
      dataType: "string",
      defaultValue: "",
      rules: ['not null'],
      options: [],
      placeHolder: 'Name',
      index: 0
    },['FacilityTypeProperty']);

    const facilityTypesNode3property2 = await this.neo4jService.createNode({
      canDelete: true,
      isDeleted: false,
      isActive: true,
      name: 'm2',
      type: "input",
      dataType: "number",
      defaultValue: 0,
      rules: [],
      options: [],
      placeHolder: 'M2',
      index: 1
    },['FacilityTypeProperty']);

    await this.neo4jService.addRelations(facilityTypesNode3property1.identity.low, facilityTypesNode3.identity.low);
    await this.neo4jService.addRelations(facilityTypesNode3property2.identity.low, facilityTypesNode3.identity.low);
    
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
    const contact = new Facility();
    contact.realm = realm;

    const typeInfo = {
      name: 'Type',
    };

    const contactInfo = {
      name: 'Contact',
    };

    const finalOrganizationObject = assignDtoPropToEntity(facility, organizationInfo);
    const finalStructureObject = assignDtoPropToEntity(structure, structureInfo);
    const finalClassificationObject = assignDtoPropToEntity(classification, classificationInfo);
    const finalTypesObject = assignDtoPropToEntity(types, typeInfo);
    const finalContactObject = assignDtoPropToEntity(contact, contactInfo);

    //create  node with multi or single label
    const organizationNode = await this.neo4jService.createNode(finalOrganizationObject, [Neo4jLabelEnum.ROOT]);
    const structureNode = await this.neo4jService.createNode(finalStructureObject, [Neo4jLabelEnum.FACILITY_STRUCTURE]);
    const classificationNode = await this.neo4jService.createNode(finalClassificationObject, [
      Neo4jLabelEnum.CLASSIFICATION,
    ]);
    const typeNode = await this.neo4jService.createNode(finalTypesObject, [Neo4jLabelEnum.TYPES]);
    const contactNode = await this.neo4jService.createNode(finalContactObject, [Neo4jLabelEnum.CONTACT]);

    await this.neo4jService.addRelations(structureNode.identity.low, organizationNode.identity.low);
    await this.neo4jService.addRelations(classificationNode.identity.low, organizationNode.identity.low);
    await this.neo4jService.addRelations(typeNode.identity.low, organizationNode.identity.low);
    await this.neo4jService.addRelations(contactNode.identity.low, organizationNode.identity.low);

    const infraFirstLevelChildren = await this.getFirstLvlChildren('Infra','Signum');

    infraFirstLevelChildren.map(async (node) => {
      //from lvl 1 to lvl 2 which nodes are replicable
      const replicableNodes = await this.getReplicableNodesFromFirstLvlNode(node.identity.low);

      //target realm node(Classification,Types)
      const targetRealmNode = await this.findByRealm(node.labels[0], realm);

      replicableNodes.map(async (replicableNode) => {
        replicableNode.properties.realm = realm;
        const key=generateUuid()
        replicableNode.properties.key = key;
        const createdNodes = await this.neo4jService.createNode(replicableNode.properties, replicableNode.labels);

        await this.neo4jService.addRelations(createdNodes.identity.low, targetRealmNode.identity.low);

        await this.copySubGrapFromOneNodetOaNOTHER(replicableNode.labels[0], realm, replicableNode.properties.name);

       const replicableNodesChilds= await this.neo4jService.read(
          `match(n:${createdNodes.labels[0]} {realm:$realm} ) match (p ) MATCH(n)-[:PARENT_OF*]->(p) return p`,
          {realm},
        );

        if(replicableNodesChilds.records?.length){
          replicableNodesChilds.records.map(async node=>{
            const key=generateUuid()
            await this.neo4jService.updateById(node['_fields'][0].identity?.low,{key})
          })
        }

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
  async getFirstLvlChildren(label,realm) {
    const nodes = await this.neo4jService.read(
      `match(n:${label} {realm:$realm} ) match (p ) MATCH(n)-[:PARENT_OF]->(p) return p`,
      {realm},
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


  async importClassificationFromExcel(file: Express.Multer.File,language:string) {

    let data = [];
    let columnNames:string[]=[];
    let columnsLength:number;

    let buffer = new Uint8Array(file.buffer);
    const workbook = new exceljs.Workbook();

    await workbook.xlsx.load(buffer).then(function async(book) {
      const instructionsSheet = book.getWorksheet(1);
      const realmAndValue = instructionsSheet
        .getRow(1)
        .values.splice(1)
        .map((x) => x.toLocaleLowerCase());

      // if (!realmAndValue.includes('realm') || realmAndValue.length != 2) {
      //   console.log('realm and its value are not');
      // } else {
        const sheet = book.getWorksheet(20);

        columnsLength = book.getWorksheet(20)._columns?.length; //column length of specific sheet
        

        for (let i = 1; i <= columnsLength; i++) {
          data.push(sheet.getColumn(i).values);
        }

        //console.log(data.length)
        // for(let a = 0; a < data.length; a++){
        //   columnNames.push(data[a][1]);
        // }
        
      //}
    });

    let [ApprovalBy,AreaUnit,AssetType,category_facility,category_space,category_element,category_product,category_role,...others] = data;

    let firstThree=[ApprovalBy,AreaUnit,AssetType];
    //let classifications =[category_facility,category_space,category_product,category_role];
    let classifications =[category_facility];
    
    /////////// classifications ////////////////////////////////
    for (let i = 0; i < classifications.length; i++) {
      let deneme=[];

      for (let index = 2; index < classifications[i].length; index++) {
        const element = classifications[i][index].split(new RegExp(/\s{3,}|:\s/g));
       
        deneme.push(element);
      }
      for(let i=0;i<deneme.length;i++){
        deneme[i][0]=deneme[i][0].replace(/ /g, '-');
      }
      //let sortedValue =this.ascendingSort2(deneme)

      let classificationName2=`OmniClass${deneme[0][0].slice(0,2)}`;
  

      let newClassification=[]
      let codearray=[]


      
    for (let q = 0; q < deneme.length; q++) {
      
      let parentcode = "";   
      var z = 0;
      codearray= await deneme[q][0].split("-");

      for (let j=0; j < codearray.length; j++) {
        if (codearray[j] == "00") {
          z=z+1;
        }
      }

      if (z == 0) {
        for (let i=0; i<codearray.length-1; i++ ) {
          if (parentcode == "") {
            parentcode = codearray[i];
          }
          else {
            parentcode = parentcode + "-" + codearray[i];
          }
          
        }
        if (codearray.length == 4) {
          parentcode = parentcode + "-" +  "00";
        }  
      }
      else {
        if (z == 1) {
          for (let i=0; i<codearray.length-2; i++ ) {
            if (parentcode == "") {
              parentcode = codearray[i];
            }
            else {
              parentcode = parentcode + "-" + codearray[i];
            }
          }
            parentcode = parentcode + "-" + "00-00"; 
        }
        else if (z == 2) {
          for (let i=0; i<codearray.length-3; i++ ) {
            if (parentcode == "") {
              parentcode = codearray[i];
            }
            else {
              parentcode = parentcode + "-" + codearray[i];
            }
          }
            parentcode = parentcode + "-" + "00-00-00"; 
        }
        else if (z == 3) {
          for (let i=0; i<codearray.length-4; i++ ) {
            if (parentcode == "") {
              parentcode = codearray[i];
            } 
            else {
              parentcode = parentcode + "-" + codearray[i];
            }
          }
          if (parentcode == "") {
            parentcode = "00-00-00-00";
          } 
          else {
            parentcode = parentcode + "-" + "00-00-00-00"; 
          }
            
        }

        else if (z == 4) {
          for (let i=0; i<codearray.length-5; i++ ) {
            if (parentcode == "") {
              parentcode = codearray[i];
            } 
            else {
              parentcode = parentcode + "-" + codearray[i];
            }
          }
          if (parentcode == "") {
            parentcode = "00-00-00-00-00";
          } 
          else {
            parentcode = parentcode + "-" + "00-00-00-00-00"; 
          }
            
        }
      } 
    
      var codestr = "";
      for (let t=0; t < codearray.length; t++) {
        if (codestr == "") {
          codestr =  codearray[t];
        }
        else {
          codestr = codestr + "-" + codearray[t]; 
        }
        
      }
      
       
      let dto = {
        code: codestr,
        parentCode: parentcode,
        name: deneme[q][1],
        key: generateUuid(),
        isDeleted:false,
        isActive:true,
        canDelete:true,
      };
    
    
      
      newClassification.push(dto);

  }
  const realmName="Signum"
  ///////// the process start here

      let cypher= `Match (a:Infra {realm:"${realmName}"})-[:PARENT_OF]->(n:Classification {realm:"${realmName}"}) MERGE (b:${classificationName2}_${language} {code:"${newClassification[0].parentCode}",name:"${classificationName2}",isDeleted:${newClassification[i].isDeleted},canCopied:true,canDelete:false,realm:"${realmName}",isRoot:true}) MERGE (n)-[:PARENT_OF]->(b)`;
      let data =await this.neo4jService.write(cypher);
        console.log(data)
      

      for(let i=0;i<newClassification.length;i++){

       let cypher2= `MATCH (n) where n.code="${newClassification[i].parentCode}" MERGE (b {code:"${newClassification[i].code}",parentCode:"${newClassification[i].parentCode}",name:"${newClassification[i].name}",isDeleted:${newClassification[i].isDeleted},isActive:${newClassification[i].isActive},canDelete:${newClassification[i].canDelete}}) MERGE (n)-[:PARENT_OF]->(b)`;
       let data2= await this.neo4jService.write(cypher2)
       //console.log(data2);
      }
     }
  ////////////////////////////category element//////////////////////////////////////

  // let cat=await category_element.filter(i=>i!="")  

  // let values=[];
  // for (let index = 1; index < cat.length; index++) {
   
  //   const element = cat[index].split()
   
  //   values.push(element);
  // }
  
  // let cat2= this.ascendingSort2(values)
  // console.log(cat2)
 
    
  // console.log(values);

  // let cypher= `MERGE (n:PickList {name:"PickList"}) MERGE (b:CategoryElement {name:"CategoryElement",isDeleted:false}) MERGE (n)-[:PARENT_OF]->(b) MERGE (n)<-[:CHILD_OF]-(b)`;
  // await this.neo4jService.write(cypher);

  // for(let i=0;i<values.length;i++){
       
  //   let cypher2= `MATCH (n:CategoryElement {name:"CategoryElement",isDeleted:false}) MERGE (b {code:"${values[i][0]}",name:"${values[i][1]}"}) MERGE (n)<-[:CHILD_OF]-(b) MERGE (n)-[:PARENT_OF]->(b)`;
  //   await this.neo4jService.write(cypher2)
  // }
  
  /////////////////////////////////////////////////////////////// first three datas ////////////////////////////////////////////////////////////////
  // let deneme4 = []
  // const realmName="IFM"
  // function key(){
  //   return uuidv4()
  //   }

   
  //   for(let i=0;i<firstThree.length;i++){
  //     let deneme5=[];
  //      let dto ={}
  //     for (let index = 1; index < firstThree[i].length; index++) {
      
  //       dto={name_EN:firstThree[i][index],key:key(),isDeleted:false,isActive:true,canDelete:true}
  //       deneme5.push(dto);
     
  //     }
  //    deneme4.push(deneme5);
  //     }
  

  //     for(let i=0;i < deneme4.length;i++){
  //       let cypher= `match (n:Classification {realm:"${realmName}"}) MERGE (b:${deneme4[i][0].name_EN} {name:"${deneme4[i][0].name_EN}",isDeleted:${deneme4[i][0].isDeleted},key:"${deneme4[i][0].key}",realm:"${realmName}",canDelete:false,isActive:true})  MERGE (n)-[:PARENT_OF]->(b)`;
  //       await this.neo4jService.write(cypher);

  //       for (let index = 1; index < deneme4[i].length; index++) {
          
  //      //console.log(deneme4[i][0].name_EN)
  //     let cypher3= `Match (n:${deneme4[i][0].name_EN} {isDeleted:false}) MERGE (b {name_EN:"${deneme4[i][index].name_EN}",isDeleted:${deneme4[i][index].isDeleted},key:"${deneme4[i][index].key}",canDelete:${deneme4[i][index].canDelete},})  MERGE (n)-[:PARENT_OF]->(b)`;
  //      let data =await this.neo4jService.write(cypher3)
  //      console.log(data);
  //       }
  //     }

  //   }
    ////////////////////////////////////////////////////////////// the rest of the process //////////////////////////////////////////////////////////////////


    //  let deneme2 = []
    // function key2(){
    //   return uuidv4()
    //   }

    // for (let i = 0; i < others.length; i++) {
    //   let deneme3 = [];
    //     let dto ={}
    //   for (let index = 1; index < others[i].length; index++) {
    //   dto={name_EN:others[i][index],key:key(),isDeleted:false,isActive:true,canDelete:true}
    //     deneme3.push(dto);
    //   }
    //   deneme2.push(deneme3);
    // }

    //  for(let i=0;i<deneme2.length;i++){

    //   let cypher= `match (n:Classification {realm:"${realmName}"}) MERGE  (b:${deneme2[i][0].name_EN}  {name:"${deneme2[i][0].name_EN}",isDeleted:${deneme2[i][0].isDeleted},key:"${deneme2[i][0].key}",isActive:true,canDelete:false}) MERGE (n)-[:PARENT_OF]->(b)`;
    //   await this.neo4jService.write(cypher)

    //   for (let index = 1; index < deneme2[i].length; index++) {
       
           
    //         let cypher2= `Match  (n:${deneme2[i][0].name_EN} {isDeleted:false}) MERGE (b {name_EN:"${deneme2[i][index].name_EN}",isDeleted:${deneme2[i][index].isDeleted},key:"${deneme2[i][index].key}",isActive:{deneme2[i][0].isActive},canDelete:{deneme2[i][0].canDelete}}) MERGE (n)-[:PARENT_OF]->(b)`;
    //       await this.neo4jService.write(cypher2)
    //   }
    //  }
    ////////////////////////////////
}
}
