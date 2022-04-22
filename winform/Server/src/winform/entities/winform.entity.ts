import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Document, Types, Schema as MongooseSchema } from 'mongoose';



export type FacilityDocument = Winform & Document;

@Schema()
export class Winform  {
 
 
  @Prop()
  form_name: string;

  @Prop()
  items: any[];
 
  

  // @Prop({
  //   type: Date,
  //   default: function genDate() {
  //     return new Date();
  //   },
  // })
  // createdAt: Date;

  // @Prop({
  //   type: Date,
  //   default: function genDate() {
  //     return new Date();
  //   },
  // })
  // updatedAt: Date;


 
}

export const WinformSchema = SchemaFactory.createForClass(Winform);
