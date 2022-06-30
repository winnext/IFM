import { int } from "neo4j-driver";
import { startWith } from "rxjs";
//transfer dto(object come from client) properties to specific node entity object
export function assignDtoPropToEntity(entity, dto) {
  Object.keys(dto).forEach((element) => {

        entity[element] = dto[element];

  });

  return entity;
}

/*
  const createNode = `CREATE (node:${createFacilityStructureDto.labelclass} {name: \
        $name, code:$code,key:$key, hasParent: $hasParent \
         ,tag: $tag , label: $label, labelclass:$labelclass \
        , createdAt: $createdAt, updatedAt: $updatedAt, type: $type, typeId: $typeId,description: $description,isActive :$isActive\
        , isDeleted: $isDeleted, class_name: $class_name, selectable: $selectable }) return node`;

      =  createDynamicCyperCreateQuery(entity); is equalent

*/
export function createDynamicCyperCreateQuery(entity: object, label) {
  let optionalLabels = "";
  if ( entity["optionalLabels"] &&  entity["optionalLabels"].length > 0) {
    entity["optionalLabels"].map(item => {optionalLabels = optionalLabels + ':' + item;}) //12 haz 2022 değiştirildi
  }

  let dynamicQueryParameter = `CREATE (node:${label}:${entity["labelclass"]}${optionalLabels} {`;
  if (entity['__label']) {
    dynamicQueryParameter = `CREATE (node:${label}:${entity["__label"]}${optionalLabels} {`;
  }
  let counter = 0;
  Object.keys(entity).forEach((element, index) => {
   
    if (Object.keys(entity).length === index + 1) {
      if (!element.startsWith('__')  && element != 'optionalLabels') {
        if (counter == 0) {
          dynamicQueryParameter +=
          ` ${element}` + `: $` + `${element} }) return node`;
          counter = counter + 1;
        }
        else {
          dynamicQueryParameter +=
          `,${element}` + `: $` + `${element} }) return node`;
          counter = counter + 1;
        }
        
      }
      else {
        dynamicQueryParameter +=
        ` }) return node`;
      }
    } else {
      if (!element.startsWith('__')  && element != 'optionalLabels') {
        if (counter == 0) {
          dynamicQueryParameter += ` ${element}` + `: $` + `${element}`;
          counter = counter + 1;
         } else {
          dynamicQueryParameter += `,${element}` + `: $` + `${element}`;
          counter = counter + 1;
         }
       
      }
    }
  });

  return dynamicQueryParameter;
}

/*
 // const createNode = `(node:${entity.labelclass} {name: \
      //   $name, code:$code,key:$key, hasParent: $hasParent \
      //   ,tag: $tag , label: $label, labelclass:$labelclass \
      //   , createdAt: $createdAt, updatedAt: $updatedAt, type: $type, typeId: $typeId,description: $description,isActive :$isActive\
      //   , isDeleted: $isDeleted, class_name: $class_name, selectable: $selectable })`;

      const x =  createDynamiCyperParam(entity); is equalent

*/
export function createDynamiCyperParam(entity: object, label) {
  let optionalLabels = "";
  if ( entity["optionalLabels"] &&  entity["optionalLabels"].length > 0) {
    entity["optionalLabels"].map(item => {optionalLabels = optionalLabels + ':' + item;}) //10 haz 2022 değiştirildi
  }
 
  let dynamicQueryParameter = `(node:${label}:${entity['labelclass']}${optionalLabels} {`;
  if (entity["__label"]) {
    dynamicQueryParameter = `(node:${label}:${entity['__label']}${optionalLabels} {`;
  }
  
  let counter = 0;
  Object.keys(entity).forEach((element, index) => {
   
    if (Object.keys(entity).length === index + 1) {
      if (!element.startsWith('__') && element != 'optionalLabels') {
        if (counter == 0) {
          dynamicQueryParameter +=
          ` ${element}` + `: $` + `${element} }) return node`;
          counter = counter + 1;
        }
        else {
          dynamicQueryParameter +=
          `,${element}` + `: $` + `${element} }) return node`;
          counter = counter + 1;
        }
        
      }
      else {
        dynamicQueryParameter +=
        ` }) return node`;
      }
    } else {
      if (!element.startsWith('__')  && element != 'optionalLabels') {
        if (counter == 0) {
          dynamicQueryParameter += ` ${element}` + `: $` + `${element}`;
          counter = counter + 1;
         } else {
          dynamicQueryParameter += `,${element}` + `: $` + `${element}`;
          counter = counter + 1;
         }
       
      }
    }
  });
  console.log(dynamicQueryParameter)
  return dynamicQueryParameter;
}

/*
await this.neo4jService.write(makeNodeConnectParent, {
        labelclass: facilityStructure.labelclass,
        name: facilityStructure.name,
        code: facilityStructure.code,
        key: facilityStructure.key,
        hasParent: facilityStructure.hasParent,
        tag: facilityStructure.tag,
        label: facilityStructure.label,
        createdAt: facilityStructure.createdAt,
        updatedAt: facilityStructure.updatedAt,
        selectable: facilityStructure.selectable,
        type: facilityStructure.type,
        typeId: facilityStructure.typeId,
        description: facilityStructure.description,
        isActive: facilityStructure.isActive,
        isDeleted: facilityStructure.isDeleted,
        className: facilityStructure.class_name,
        parent_id: createFacilityStructureDto.parent_id,
      });

      this method create second paramater of method(object) which is parameter of cyper query
*/
export function createDynamicCyperObject(entity) {
  const dynamicObject = {};
  Object.keys(entity).forEach((element) => {
    dynamicObject[element] = entity[element];
  });

  return dynamicObject;
}

//create dynamic cyper updateNode query
// export function updateNodeQuery(id, dto) {
//    let optionalLabels = "";
//    if ( dto["optionalLabels"] &&  dto["optionalLabels"].length > 0) {
//      for (let i=0; i < dto["optionalLabels"].length; i++) {  //14 haz 2022 değiştirildi
//        if (i == 0) {
//         optionalLabels = dto["optionalLabels"][i];
//        }
//        else {
//         optionalLabels = optionalLabels + ':' + dto["optionalLabels"][i];
//        }
//      }        
//    }
    
//   id = int(id);
//   let dynamicQueryParameter = "";
//   if (optionalLabels != "") {
//     dynamicQueryParameter = ` match (node {isDeleted: false}) where id(node) = ${id} set node.optionalLabel= '${optionalLabels}',`;
//   }
//   else {
//     dynamicQueryParameter = ` match (node {isDeleted: false}) where id(node) = ${id} set `;
//    }

//   let counter = 0;
//   Object.keys(dto).forEach((element, index) => {
   
//     if (Object.keys(dto).length === index + 1) {
//       if (!element.startsWith('__')  && element != 'optionalLabels') {
//         if (counter == 0) {
//           dynamicQueryParameter +=
//           ` node.${element}` + `= $` + `${element}  return node`;
//           counter = counter + 1;
//         }
//         else {
//           dynamicQueryParameter +=
//           `,node.${element}` + `= $` + `${element}  return node`;
//           counter = counter + 1;
//         }
        
//       }
//       else {
//         dynamicQueryParameter +=
//         `  return node`;
//       }
//     } else {
//       if (!element.startsWith('__')  && element != 'optionalLabels') {
//         if (counter == 0) {
//           dynamicQueryParameter += ` node.${element}` + `= $` + `${element}`;
//           counter = counter + 1;
//          } else {
//           dynamicQueryParameter += `,node.${element}` + `= $` + `${element}`;
//           counter = counter + 1;
//          }
       
//       }
//     }
//   });
//   return dynamicQueryParameter;
// }
//create dynamic cyper updateNode query

/////////////////// Temiz ///////////////////////////////////////////////////////////////
export function updateNodeQuery(id, dto) {
  id = int(id);
  let dynamicQueryParameter = ` match (node {isDeleted: false}) where id(node) = ${id} set `;

  Object.keys(dto).forEach((element, index) => {
    if (Object.keys(dto).length === index + 1) {
      dynamicQueryParameter += `node.${element}` + `= $` + `${element}`;
    } else {
      dynamicQueryParameter += `node.${element}` + `= $` + `${element} ,`;
    }
  });
  dynamicQueryParameter += `  return node`;
  return dynamicQueryParameter;
}
///////////////////////////////////////////////////////////////////////////////////////////