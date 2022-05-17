export function assignDtoPropToEntity(entity, dto) {
  Object.keys(dto).forEach((element) => {
    entity[element] = dto[element];
  });

  return entity;
}

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

export function createDynamicCyperObject(entity) {
  const dynamicObject = {};
  Object.keys(entity).forEach((element) => {
    dynamicObject[element] = entity[element];
  });

  return dynamicObject;
}
