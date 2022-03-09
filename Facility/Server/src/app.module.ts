import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FacilityModule } from "./facility/facility.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { KeycloakModule } from "./facility/keyclock.module";
import { ClassificationModule } from "./classification/classification.module";
import { ConnectionEnums } from "./common/const/connection.enum";
import { AppLoggerMiddleware } from "./common/interceptors/apploggermiddleware";
import { I18nModule, I18nJsonParser } from "nestjs-i18n";
import * as path from "path";
import { APP_FILTER } from "@nestjs/core";
import { HttpExceptionFilter } from "./common/exceptionFilters/exception.filter";
import { MessagebrokerModule } from './messagebroker/messagebroker.module';
import * as Joi from "joi";

@Module({
  imports: [
    FacilityModule,
    KeycloakModule,
    I18nModule.forRoot({
      fallbackLanguage: "tr",
      fallbacks: {
        en: "en",
        tr: "tr",
      },
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, "/i18n/"),
      },
    }),
    MongooseModule.forRootAsync({
      connectionName: ConnectionEnums.FACILITY,
      useFactory: (config: ConfigService) => ({
        uri: config.get("DATABASE_LINK"),

        dbName: config.get("FACILITY_DB_NAME"),
        user: config.get("DB_USER"),
        pass: config.get("DB_PASS"),
      }),
      inject: [ConfigService],
    }),

    MongooseModule.forRootAsync({
      connectionName: ConnectionEnums.CLASSIFICATION,
      useFactory: (config: ConfigService) => ({
        uri: config.get("DATABASE_LINK"),
        dbName: config.get("CLASSIFICATION_DB_NAME"),
        user: config.get("DB_USER"),
        pass: config.get("DB_PASS"),
      }),
      inject: [ConfigService],
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_LINK: Joi.string().required(),
      }),
    }),

    ClassificationModule,

    MessagebrokerModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes("*");
  }
}

//export class AppModule {}
