export interface GeciciInterface<T> {
  update(id: string, data: T | any): any;
  create(data: T | any): any;
  findOneByRealm(label: string, realm: string): any;
  delete(id: string): any;
  changeNodeBranch(id: string, target_parent_id: string): any;
  findOneNodeByKey(key: string): any;
  setIsActiveTrueOfClassificationAndItsChild(id:string):any;
  setIsActiveFalseOfClassificationAndItsChild(id:string):any;
  getClassificationByIsActiveStatus(realm: string,isActive:boolean,language: string): any;
  findOneFirstLevelByRealm(label: string, realm: string): any;
}
