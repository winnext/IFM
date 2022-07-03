import { int } from "neo4j-driver";
import { startWith } from "rxjs";
//transfer dto(object come from client) properties to specific node entity object
export function assignDtoPropToEntity(entity, dto) {
  Object.keys(dto).forEach((element) => {

        entity[element] = dto[element];

  });

  return entity;
}

export function createDynamicCyperCreateQuery(entity: object, labels?: Array<string>) {
  let optionalLabels = '';

  if (labels && labels.length > 0) {
    labels.map((item) => {
      optionalLabels = optionalLabels + ':' + item;
    });
  }

  let dynamicQueryParameter = `CREATE (node${optionalLabels} {`;

  Object.keys(entity).forEach((element, index) => {
    if (index === 0) {
      dynamicQueryParameter += ` ${element}` + `: $` + `${element}`;
    } else {
      dynamicQueryParameter += `,${element}` + `: $` + `${element}`;
    }
    if (Object.keys(entity).length === index + 1) {
      dynamicQueryParameter += ` }) return node`;
    }
  });

  return dynamicQueryParameter;
}

export function createDynamicCyperObject(entity) {
  const dynamicObject = {};
  Object.keys(entity).forEach((element) => {
    dynamicObject[element] = entity[element];
  });

  return dynamicObject;
}


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
