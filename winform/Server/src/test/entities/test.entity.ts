import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TestDocument = Test & Document;

@Schema()
export class Test {
  @Prop()
  name: string;

  @Prop()
  type: string;

  @Prop()
  items: any[];
}

export const TestSchema = SchemaFactory.createForClass(Test);
