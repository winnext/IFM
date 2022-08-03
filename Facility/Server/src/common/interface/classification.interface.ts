import { GeciciInterface } from "./gecici.interface";

export interface classificationInterface<T> extends GeciciInterface<T> {

setIsActiveTrueOfClassificationAndItsChild(id:string):any;
  setIsActiveFalseOfClassificationAndItsChild(id:string):any;
  getClassificationByIsActiveStatus(realm: string,isActive:boolean,language: string): any;
}