import { int } from 'neo4j-driver';
//transfer dto(object come from client) properties to specific node entity object
export function assignDtoPropToEntity(entity, dto) {
  Object.keys(dto).forEach((element) => {
    entity[element] = dto[element];
  });

  return entity;
}

/*
 // const createNode = `CREATE (x:${createFacilityStructureDto.labelclass} {name: \
      //   $name, code:$code,key:$key, hasParent: $hasParent \
      //   ,tag: $tag , label: $label, labelclass:$labelclass \
      //   , createdAt: $createdAt, updatedAt: $updatedAt, type: $type, typeId: $typeId,description: $description,isActive :$isActive\
      //   , isDeleted: $isDeleted, class_name: $class_name, selectable: $selectable })`;

      const x = 'CREATE ' + createDynamiCyperParam(facilityStructure); is equalent

*/
export function createDynamiCyperParam(entity: object) {
  let dynamicQueryParameter = `(x: ${entity['labelclass']} {`;

  Object.keys(entity).forEach((element, index) => {
    if (Object.keys(entity).length === index + 1) {
      dynamicQueryParameter += `${element}` + `: $` + `${element} })`;
    } else {
      dynamicQueryParameter += `${element}` + `: $` + `${element},`;
    }
  });
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
  return dynamicQueryParameter;
}
