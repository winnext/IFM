import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { BasePersistantDocumentObject } from 'src/common/baseObject/base.object';
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
   * createDate of user
   */
  @Prop({
    type: Date,
    default: genCurrentDate(),
  })
  createdAt: Date;

  /**
   * updateDate of user when created
   */
  @Prop({
    type: Date,
    default: genCurrentDate(),
  })
  updatedAt: Date;

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
   * is user deleted(true or false)
   */
  @Prop({ default: false })
  isDeleted: boolean;

  /**
   * is user active(true or false)
   */
  @Prop({ default: true })
  isActive: boolean;

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
