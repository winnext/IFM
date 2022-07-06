import { BaseGraphObject } from 'src/common/baseobject/base.graph.object';

export class Contact extends BaseGraphObject {

  className : string = Contact.name;  //required

  email: string;   //required
  company: string; //required
  phone: string;   //required

  externalSystem: string;     //  external ref  (not in dto)
  externalObject: string;     //  external ref  (not in dto) 
  externalIdentifier: string; //  external ref  (not in dto) 

  department: string;       //optional
  organizationCode: string; //optional
  givenName: string;        //optional 
  familyName: string;       //optional
  street: string;           //optional
  postalBox: string;        //optional
  town: string;             //optional
  stateRegion: string;      //optional
  postalCode: string;       //optional
  country: string;          //optional 



}
