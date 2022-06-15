


import { BaseGraphDatabaseInterfaceRepository } from 'ifmcommon';
import { Type } from '../entities/type.entity';
import { TypeNotFountException } from 'src/common/notFoundExceptions/not.found.Exceptions';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTypeDto } from '../dtos/create.type.dto';
import { int } from 'neo4j-driver';
import { GeciciTypeInterface } from '../type.service';
import { TypeProperty } from '../entities/type.property.entity';
import { CreateTypePropertyDto } from '../dtos/create.type.property.dto';
import { UpdateTypeDto } from '../dtos/update.type.dto';
import { assignDtoPropToEntity, Neo4jService } from 'src/sgnm-neo4j/src';
//import { assignDtoPropToEntity, Neo4jService } from 'sgnm-neo4j/dist';


@Injectable()
export class TypeRepository implements GeciciTypeInterface {
  constructor(private readonly neo4jService: Neo4jService) {}

  async findOneById(id: string) {
    return null;
  } 

  async findOneByIdAndLabels(id: string, label1: string, label2: string) {

    const tree = await this.neo4jService.findByIdAndLabelsWithTreeStructure(id, label1, label2);
    if (!tree) {
      
      throw new TypeNotFountException(id);
    }
    return tree;

    // const idNum = parseInt(id);
    
    // let result = await this.neo4jService.read(
    //   'MATCH p=(n {isDeleted:false})-[:CHILDREN]->(m {isDeleted:false}) \
    //   WHERE  id(n)=$idNum and n.labelclass=$label1 \
    //   and m.labelclass=$label2 \
    //   WITH COLLECT(p) AS ps \
    //   CALL apoc.convert.toTree(ps) yield value \
    //   RETURN value',
    //   { idNum, label1, label2 },
    // );
    // if (!result['records'][0]["_fields"][0]["label"]) {
    //   let resultRoot = await this.neo4jService.read('match (n) where id(n)=$idNum  return n',{idNum});
    //   if  (resultRoot['records'][0]["_fields"][0]["properties"]["label"]) {
    //      const o = { root: resultRoot['records'][0]['_fields'] };
    //       return  o;
    //   }
    //   else {
    //     throw new TypeNotFountException('Type');
    //   }
      
    // } else {
    //   const o = { root: result['records'][0]['_fields'] };
    //   return o;
    // }
  }

  async createType(createTypeDto: CreateTypeDto) {
    
    let type = new Type();
    type = assignDtoPropToEntity(type, createTypeDto);
    //type.label = createTypeDto.code + ' . ' + createTypeDto.name;
    let _label = 'ChildNode';
    let _labelParent = 'ChildNode';
    let _parentHasLabeledNode = false;
    if (type.labelclass == 'Type') {
      _label = _label + ':Type';
      _parentHasLabeledNode = true;
    }
    type["__label"] = _label;
    type["__labelParent"] = _labelParent;
    type["__parentHasLabeledNode"] = _parentHasLabeledNode;

    if (createTypeDto.parent_id)
    { 

    let parent =  await this.neo4jService.findById(createTypeDto.parent_id.toString());
  
    if (type.labelclass == 'Type' && parent["properties"]["hasType"]) {
      
            throw new HttpException(  'Tip düğümüne sahip bir düğüme başka tip eklenemez.', HttpStatus.NOT_FOUND);
        }
    else if (parent["properties"]["labelclass"] != 'ChildNode') {

      throw new HttpException(  'Tip düğümüne  yeni düğüm eklenemez.', HttpStatus.NOT_FOUND);
      }

     if (_label == 'ChildNode:Type') {
      this.neo4jService.updateHasTypeProp(createTypeDto.parent_id.toString(), _parentHasLabeledNode)
     }
   
    const createdNode = await this.neo4jService.createNodeWithLabel(type, "TypeTree");

    if (createTypeDto.optionalLabels && createTypeDto["optionalLabels"].length > 0) {
      this.neo4jService.updateOptionalLabel(createdNode["identity"].low, createTypeDto["optionalLabels"][0]);
    }

    return createdNode;
    }
    else {
      if (_label == 'ChildNode:Type') {
             throw new HttpException( 'Bir düğüme bağlı olmayan tip düğümü eklememez.' , HttpStatus.BAD_REQUEST);
           }
      type.hasParent=false;       
      let typeResult = this.neo4jService.createNode(type, "TypeTree");
      return typeResult;
    }

    // const type = new Type();
    // type.name = createTypeDto.name;
    // type.code = createTypeDto.code;
    // type.label = createTypeDto.code + ' - ' + createTypeDto.name;
    // type.labelclass = createTypeDto.labelclass;

    // if (createTypeDto.key) {
    //   type.key = createTypeDto.key;
    // }
    // if (createTypeDto.tag) {
    //   type.tag = createTypeDto.tag;
    // }

    // let _type = 'ChildNode';
    // let _typeParent = 'ChildNode';
    // let _parentHasType = false;
    // if (type.labelclass == 'Type') {
    //   _type = _type + ':Type';
    //   _parentHasType = true;
    // }
 
    // if (createTypeDto.parent_id || createTypeDto.parent_id == 0) {
      
    //     let parent = await this.neo4jService.write(`match (x {isDeleted: false}) where id(x)=$parent_id return x`, {
    //       parent_id: int(createTypeDto.parent_id), 
    //     });
    //     if (type.labelclass == 'Type' && parent["records"][0]["_fields"][0]["properties"]["hasType"]) {
    //       throw new HttpException({ message: 'Tip düğümüne sahip bir düğüme başka tip eklenemez.' }, HttpStatus.NOT_FOUND);
    //     }
    //     else if (parent["records"][0]["_fields"][0]["properties"]["labelclass"] != 'ChildNode') {
    //       throw new HttpException({ message: 'Tip düğümüne yeni düğüm eklenemez.' }, HttpStatus.NOT_FOUND);
    //     }
        
     
    //   //if there is a parent of created node
    //   let makeNodeConnectParent = `(x: ${_type} {name: $name,code: $code ,key: $key , hasParent: $hasParent,tag: $tag ,label: $label, \
    //                                                          labelclass:$labelclass,createdAt: $createdAt , updatedAt: $updatedAt, isActive :$isActive,\ 
    //                                                          isDeleted: $isDeleted, hasType: $hasType})`;
    //   makeNodeConnectParent =
    //     ` match (y: ${_typeParent} {isDeleted: false}) where id(y)= $parent_id  create (y)-[:CHILDREN]->` +
    //     makeNodeConnectParent;
    //     await this.neo4jService.write(makeNodeConnectParent, {
    //     labelclass: type.labelclass,
    //     name: type.name,
    //     code: type.code,
    //     key: type.key,
    //     hasParent: type.hasParent,
    //     tag: type.tag,
    //     label: type.label,
    //     createdAt: type.createdAt,
    //     updatedAt: type.updatedAt,
    //     isActive: type.isActive,
    //     isDeleted: type.isDeleted,
    //     parent_id: createTypeDto.parent_id,
    //     hasType: type.hasType,
    //   });
    //   if (type.labelclass == 'Type') {
    //     await this.neo4jService.write(`match (x {isDeleted: false}) where id(x)=$parent_id set x.hasType=$hasParentType`, {
    //       parent_id: int(createTypeDto.parent_id), hasParentType: _parentHasType, 
    //     });
    //   }
     
    //   const createChildOfRelation = `match (x: ${_type} {isDeleted: false, code: $code}) \
    //      match (y: ${_typeParent} {isDeleted: false}) where id(y)= $parent_id \
    //      create (x)-[:CHILD_OF]->(y)`;
    //   await this.neo4jService.write(createChildOfRelation, {
    //     code: type.code,
    //     parent_id: int(createTypeDto.parent_id),
    //   });
    //   return type;
    // } else {

    //   if (type.labelclass == 'Type') {
    //     throw new HttpException({ message: 'Bir düğüme bağlı olmayan tip düğümü eklememez.' }, HttpStatus.BAD_REQUEST);
    //   }

    //   type.hasParent = false;

    //   const labelclass = type.labelclass;
    //   const name = type.name;
    //   const code = type.code;
    //   const key = type.key;
    //   const hasParent = type.hasParent;
    //   const tag = type.tag;
    //   const label = type.label;
    //   const createdAt = type.createdAt;
    //   const updatedAt = type.updatedAt;
    //   const isActive = type.isActive;
    //   const isDeleted = type.isDeleted;
    //   const hasType = type.hasType;

    //   const createNode = `CREATE (x:${_type} {name: \
    //     $name, code:$code,key:$key, hasParent: $hasParent \
    //     ,tag: $tag , label: $label, labelclass:$labelclass \
    //     , createdAt: $createdAt, updatedAt: $updatedAt,isActive :$isActive\ 
    //     , isDeleted: $isDeleted, hasType: $hasType })`;

    //   await this.neo4jService.write(createNode, {
    //     name,
    //     code,
    //     key,
    //     hasParent,
    //     tag,
    //     label,
    //     createdAt,
    //     updatedAt,
    //     labelclass,
    //     isActive,
    //     isDeleted,
    //     hasType,
    //   });
     
    //   return type;
    }
  

  async createTypeProperties(createTypeProperties: CreateTypePropertyDto[]) {
    
    if (createTypeProperties[0]["parent_id"]) {
      
      // const nodeType = await this.neo4jService.read(
      //   'MATCH (c:ChildNode {isDeleted: false})-[:CHILDREN]->(n:Type {isDeleted: false}) where id(c)=$id return n',
      //   {
      //     id: int(createTypeProperties[0].parent_id)
      //   }
      // );
      // if (nodeType['records'][0]) {
      //    const type_node_id = nodeType['records'][0]['_fields'][0]["identity"]["low"];
      //    const childrenList = await this.neo4jService.write(
      //   'MATCH (c:Type {isDeleted: false})-[:CHILDREN]->(n:TypeProperty {isDeleted: false}) where id(c)=$id detach delete n',
      //   {
      //     id: type_node_id
      //   }
      // );
  
    const nodeType = await this.neo4jService.findByIdAndLabelsWithChildNodes(createTypeProperties[0].parent_id.toString() , "ChildNode", "Type");
     if (nodeType[0]) {
         const type_node_id = nodeType[0]['_fields'][0]["identity"]["low"];
         const childrenList = await this.neo4jService.deleteChildrenNodesByIdAndLabels(type_node_id, "Type", "TypeProperty");
         
    let typePropertiesArray = []; 
    for (let i=0; i < createTypeProperties.length; i++ ) {
     
      let _label = 'ChildNode:Type:TypeProperty';
      let _labelParent = 'ChildNode:Type';
      let createTypeDto = createTypeProperties[i]
      let type = new TypeProperty();
      type = assignDtoPropToEntity(type, createTypeDto);
      type["__label"] = _label;
      type["__labelParent"] = _labelParent;
      type["parent_id"] = type_node_id;
      type["name"] = type["label"]; //Neo4j arayüzünde isim gözüksün diye 
      let createdNode = await this.neo4jService.createNodeWithLabel(type,"TypeTree");

      if (createTypeDto.optionalLabels && createTypeDto["optionalLabels"].length > 0) {
        createdNode = this.neo4jService.updateOptionalLabel(createdNode["identity"].low, createTypeDto["optionalLabels"][0]);
      }

      typePropertiesArray.push(createdNode);
      
      // let createTypeDto = createTypeProperties[i]
      // const type = new TypeProperty();
      
      // type.label = createTypeDto.label;
      // type.type = createTypeDto.type;
      // type.typeId = createTypeDto.typeId;
      // type.labelclass = createTypeDto.labelclass;
      // type.isActive = createTypeDto.isActive;
      // type.index = createTypeDto.index;

      // if (createTypeDto.key) {
      //   type.key = createTypeDto.key;
      // } 
      // if (createTypeDto.tag) {
      //   type.tag = createTypeDto.tag;
      // }
      // else {
      //   type.tag = [];
      // }
      // if (createTypeDto.rules) {
      //   type.rules = createTypeDto.rules;
      // }
      // else {
      //   type.rules = [];
      // }
      // if (createTypeDto.options) {
      //   type.options = createTypeDto.options;
      // }
      // else {
      //   type.options = [];
      // }
      // if (createTypeDto.defaultValue) {
      //    type.defaultValue = createTypeDto.defaultValue;
      // }
      // else {
      //   type.defaultValue = "";
      // }
      // if (createTypeDto.placeholder) {
      //   type.placeholder = createTypeDto.placeholder;
      // }
      // else {
      //   type.placeholder = "";
      // }
      //  if (createTypeDto.label2) {
      //    type.label2 = createTypeDto.label2;
      // }
      // else {
      //   type.label2 = "";
      // }
  
  
      // let _type = 'ChildNode:Type:TypeProperty';
      // let _typeParent = 'ChildNode:Type';

        
      //     let parent = await this.neo4jService.read(`match (x {isDeleted: false}) where id(x)=$parent_id return x`, {
      //       parent_id: type_node_id, 
      //     });
        
      //   let makeNodeConnectParent = `(x: ${_type} {label: $label, key: $key , tag: $tag , labelclass:$labelclass,createdAt: $createdAt , \
      //                                              updatedAt: $updatedAt, isActive :$isActive, isDeleted: $isDeleted, \
      //                                              defaultValue: $defaultValue, rules: $rules, options: $options, type: $type, typeId: $typeId, name: $label,
      //                                              placeholder: $placeholder, label2: $label2, index: $index})`;
      //   makeNodeConnectParent =
      //     ` match (y: ${_typeParent} {isDeleted: false}) where id(y)= $parent_id  create (y)-[:CHILDREN]->` +
      //     makeNodeConnectParent;
      //     await this.neo4jService.write(makeNodeConnectParent, {
      //     labelclass: type.labelclass,
      //     label: type.label,
      //     createdAt: type.createdAt,
      //     updatedAt: type.updatedAt,
      //     isActive: type.isActive,
      //     isDeleted: type.isDeleted,
      //     key: type.key,
      //     tag: type.tag,
      //     parent_id: type_node_id,
      //     rules: type.rules,
      //     options: type.options,
      //     defaultValue: type.defaultValue,
      //     type: type.type,
      //     typeId: type.typeId,
      //     placeholder: type.placeholder,
      //     label2: type.label2,
      //     index: type.index
      //   });
       
      //   const createChildOfRelation = `match (x: ${_type} {isDeleted: false, key: $key}) \
      //      match (y: ${_typeParent} {isDeleted: false}) where  id(y)= $parent_id \
      //      create (x)-[:CHILD_OF]->(y)`;
      //   await this.neo4jService.write(createChildOfRelation, {
      //     key: type.key,
      //     parent_id: type_node_id,
      //   });
        
     }
     return typePropertiesArray;
    } 
   }
   return null; 
  }

  async findOneNodeByKey(key: string) {
    const result = this.neo4jService.findOneNodeByKey(key) 
    if (!result) {
      throw new TypeNotFountException(key);
    } else {
      return result;
    }
  }
  async updateNode(id: string, updateTypeDto: UpdateTypeDto) {
    const checkNodeisExist = await this.neo4jService.findNodeByIdAndLabel(id,"ChildNode");
    const { name, code, tag, isActive, label } = updateTypeDto;
    let dto = {"name":name, "code": code, "tag":tag, "isActive": isActive, "label": label};

    if (checkNodeisExist[0]) {
      const updatedNode = await this.neo4jService.updateById(id,dto);
       
      // const  updatedNode = await this.neo4jService.write(
      //   'MATCH (c:ChildNode {isDeleted: false}) where id(c)=$id set c.code= $code, c.name= $name , c.tag= $tag, c.label = $label, c.isActive = $isActive ',
      //   {
      //     name: name,
      //     code: code,
      //     tag: tag,
      //     label: code + ' - ' + name,
      //     id: int(id),
      //     isActive: isActive
      //   },
      // );

      const hasTypeChild = await this.neo4jService.findByIdAndLabelsWithChildNodes(id, "ChildNode", "Type");
      // const hasTypeChild = await this.neo4jService.read(
      //   'MATCH (c:ChildNode {isDeleted: false})-[:CHILDREN]->(n:Type {isDeleted: false}) where id(c)=$id return n',
      //   {
      //     id: int(id)
      //   }
      // );
      
      if (hasTypeChild && hasTypeChild[0]) {  //update yapılan node'un type cinsinden çocuğu varsa o da update edilir. 
        let childNodeId = hasTypeChild[0]['_fields'][0]['identity']['low']; 
        delete dto["isActive"];
        delete dto["tag"]; 
        await this.neo4jService.updateById(childNodeId, dto);
        // await this.neo4jService.write(
        //   'MATCH (c:Type {isDeleted: false}) where id(c)=$id set c.code= $code, c.name= $name, c.label=$label',
        //   {
        //     id: hasTypeChild['records'][0]['_fields'][0]['identity']['low'],  
        //     name: name,
        //     code: code,
        //     label: code+' - '+name
        //   }
        // );

      }

      console.log('Node updated ................... ');
      return updatedNode;
    } else {
      console.log('Can not find a node for update  ....................');
      throw new NotFoundException('Can not find a node for update  ');
      //throw new TypeNotFoundException('Can not find a node for update  ');
    }
  }

  async findTypePropertiesByNodeId(id: string) {
    const nodeType = await this.neo4jService.findByIdAndLabelsWithChildNodes(id, "ChildNode" , "Type"); 
    
    if (nodeType && nodeType[0]) {
       const type_node_id = nodeType[0]['_fields'][0]["identity"]["low"];
       const childrenList = await this.neo4jService.findByIdAndLabelsWithChildNodes(type_node_id, "Type" , "TypeProperty","index","asc") as Array<any>; 

      //  const childrenList = await this.neo4jService.read(
    //   'MATCH (c:Type {isDeleted: false})-[:CHILDREN]->(n:TypeProperty  {isDeleted: false}) where id(c)=$id return n order by n.index asc',
    //   {
    //     id: type_node_id
    //   } 
    // );
    

    if (childrenList && childrenList[0]) {
      let propertyList = [];
       for (let i=0; i<childrenList.length; i++ ) {
        let property = childrenList[i];
       property["_fields"][0]["properties"]._id = property["_fields"][0]["identity"]["low"];
       propertyList.push(property["_fields"][0]["properties"]); 
      }
      return propertyList;
     }
   
    }
    return [];
  } 

  async delete(_id: string) {
    try {
      
      let nodeChildCount = await this.neo4jService.getChildrenCount(_id);
      // let nodeChildCount = await this.neo4jService.read(
      //   'MATCH (c {isDeleted: false})  -[r:CHILDREN]->(p {isDeleted: false}) where id(c)= $id return count(p)',
      //   {
      //     id: parseInt(_id),
      //   },
      // );
      
      let nodeChildCountNumber = parseInt(nodeChildCount);
      if (nodeChildCountNumber > 0) {

       if (nodeChildCountNumber == 1) {
           let nodeChildIsTypeCount = await this.neo4jService.getChildrenCountByIdAndLabels(_id, "Type", "TypeProperty");
           let nodeChildIsTypeCountNumber = parseInt(nodeChildIsTypeCount);
           if (nodeChildIsTypeCountNumber > 0) {
             let nodeChildIsTypeWithoutPropertyCount = 
                  await this.neo4jService.getChildrensChildrenCountByIdAndLabels(_id, "Type", "TypeProperty", "TypeProperty"); 

             let nodeChildIsTypeWithoutPropertyCountNumber =  parseInt(nodeChildIsTypeWithoutPropertyCount); 
             console.log("***********************************************************************************************")
             console.log(nodeChildIsTypeWithoutPropertyCountNumber)
             console.log("***********************************************************************************************") 
             if (nodeChildIsTypeWithoutPropertyCountNumber == 0) {
               let deleteNode = this.neo4jService.setDeletedTrueToNodeAndChildByIdAndLabels(_id, "Type","TypeProperty");
               return deleteNode; 
             }
             else {
               throw new HttpException({ message: 'Type (form tipinde) ancak property içeren çocuğu olan node silinemez' }, HttpStatus.NOT_FOUND);
             }
           }
           else {
             throw new HttpException({ message: 'Type (form tipinde) dışında Çocuğu olan node silinemez' }, HttpStatus.NOT_FOUND);
           }
         }
         else {
           throw new HttpException({ message: 'Birden çok çocuğu olan node silinemez' }, HttpStatus.NOT_FOUND);
         }

        // if (nodeChildCountNumber == 1) {
        //   let nodeChildIsTypeCount = 
        //   await this.neo4jService.read(
        //     'MATCH (c {isDeleted: false}) -[r1:CHILDREN]->(p {isDeleted: false}) '+ 
        //     'where id(c)= $id and p:Type and not p:TypeProperty return count(p)',
        //     {
        //       id: parseInt(_id),
        //     },
        //   );
        //   let nodeChildIsTypeCountNumber = parseInt(JSON.stringify(nodeChildIsTypeCount.records[0]['_fields'][0]['low']));
        //   if (nodeChildIsTypeCountNumber > 0) {
        //     let nodeChildIsTypeWithoutPropertyCount = 
        //     await this.neo4jService.read(
        //       'MATCH (c {isDeleted: false}) -[r1:CHILDREN]->(p {isDeleted: false})-[r2:CHILDREN]-(s {isDeleted: false}) '+ 
        //       'where id(c)= $id and p:Type and not p:TypeProperty and s:TypeProperty return count(s)',
        //       {
        //         id: parseInt(_id),
        //       },
        //     );
        //     let nodeChildIsTypeWithoutPropertyCountNumber =  parseInt(JSON.stringify(nodeChildIsTypeWithoutPropertyCount.records[0]['_fields'][0]['low']));  
        //     if (nodeChildIsTypeWithoutPropertyCountNumber == 0) {
        //       let deleteNode = await this.neo4jService.write('MATCH (c {isDeleted: false}) -[r1:CHILDREN]->(p {isDeleted: false}) '+ 
        //       'where id(c)= $id and p:Type and not p:TypeProperty set c.isDeleted= true, p.isDeleted = true',
        //       {
        //         id: parseInt(_id),
        //       },
        //       );
        //     }
        //     else {
        //       let node = await this.neo4jService.read('MATCH (c {isDeleted: false}) where id(c)= $id return c', {
        //         id: parseInt(_id),
        //       });
        //       throw new HttpException({ message: 'Type (form tipinde) ancak property içeren çocuğu olan node silinemez' }, HttpStatus.NOT_FOUND);
        //       //// nodeHasChildException(node['records'][0]['_fields'][0]['properties'].name); 
        //     }
        //   }
        //   else {
        //     let node = await this.neo4jService.read('MATCH (c {isDeleted: false}) where id(c)= $id return c', {
        //       id: parseInt(_id),
        //     });
        //     throw new HttpException({ message: 'Type (form tipinde) dışında Çocuğu olan node silinemez' }, HttpStatus.NOT_FOUND);
        //     //// nodeHasChildException(node['records'][0]['_fields'][0]['properties'].name);
        //   }
        // }
        // else {
        //   let node = await this.neo4jService.read('MATCH (c {isDeleted: false}) where id(c)= $id return c', {
        //     id: parseInt(_id),
        //   });
        //   throw new HttpException({ message: 'Birden çok çocuğu olan node silinemez' }, HttpStatus.NOT_FOUND);
        //   //// nodeHasChildException(node['records'][0]['_fields'][0]['properties'].name);
        // }

      } else {
       
        // let deleteNode = await this.neo4jService.write(
        //   'MATCH (c {isDeleted: false}) where id(c)= $id set c.isDeleted = true',
        //   {
        //     id: parseInt(_id),
        //   },
        // );
        let deleteNode = this.neo4jService.updateIsDeletedProp(_id, true);
        return deleteNode;
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async findTypeActivePropertiesByNodeId(id: string) {
    
    const nodeType = await this.neo4jService.findByIdAndLabelsWithActiveChildNodes(id, "ChildNode" , "Type"); 
    
    if (nodeType && nodeType[0]) {
       const type_node_id = nodeType[0]['_fields'][0]["identity"]["low"];
       const childrenList = await this.neo4jService.findByIdAndLabelsWithActiveChildNodes(type_node_id, "Type" , "TypeProperty","index","asc") as Array<any>; 


      if (childrenList && childrenList[0]) {
        let propertyList = [];
        for (let i=0; i<childrenList.length; i++ ) {
          let property = childrenList[i];
        property["_fields"][0]["properties"]._id = property["_fields"][0]["identity"]["low"];
         propertyList.push(property["_fields"][0]["properties"]); 
        }
        return propertyList;
       }
    }
    return [];
  } 

}
