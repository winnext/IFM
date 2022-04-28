import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { BasePersistantDocumentObject } from 'ifmcommon';
import { Languages } from 'src/common/const/language.enum';
import { genCurrentDate } from 'ifmcommon';

/**
 * User Document type for Mongoose
 */
export type UserDocument = User & Document;

@Schema()
/**
 * User Entity With Mongoose
 */
export class User extends BasePersistantDocumentObject {
  /**
   * userId from Keycloack
   */
  @Prop({ unique: true })
  userId: string;

  /**
   * User Phone Number
   */
  @Prop()
  phone_number: string;

  /**
   * User Business Code
   */
  @Prop()
  business_code: string;

  /**
   * User Business Name
   */
  @Prop()
  business_name: string;

  /**
   * User Language
   */
  @Prop({ default: Languages.EN })
  language: Languages;

  /**
   * Return class name(User)
   */
  @Prop({
    type: String,
    default: function getClassName() {
      return User.name;
    },
  })
  class_name: string;

  /**
   * when user logged in which page user will be landing
   */
  @Prop()
  landing_page: string;

  /**
   * LoginDate of user
   */
  @Prop({
    type: Date,
    default: genCurrentDate(),
  })
  LoginAt: Date;

  /**
   * LogoutDate of user
   */
  @Prop({
    type: Date,
    default: genCurrentDate(),
  })
  LogoutAt: Date;
}

/**
 * User Schema
 */
export const UserSchema = SchemaFactory.createForClass(User);
