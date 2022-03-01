import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FacilityModule } from "./facility/facility.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { KeycloakModule } from "./facility/keyclock.module";
import { ClassificationModule } from './classification/classification.module';
import { ConnectionEnums } from "./common/const/connection.enum";
@Module({
  imports: [
    FacilityModule,KeycloakModule,

    MongooseModule.forRootAsync({
      connectionName:ConnectionEnums.FACILITY,
      useFactory: (config: ConfigService) => ({
        uri: config.get("DATABASE_LINK"),     
        dbName: config.get("FACILITY_DB_NAME"),
        user:config.get("DB_USER"),
        pass: config.get("DB_PASS"),
      }),
      inject: [ConfigService],
    }),

 MongooseModule.forRootAsync({
      connectionName:ConnectionEnums.CLASSIFICATION,
      useFactory: (config: ConfigService) => ({
        uri: config.get("DATABASE_LINK"),     
        dbName: config.get("CLASSIFICATION_DB_NAME"),
        user:config.get("DB_USER"),
        pass: config.get("DB_PASS"),
      }),
      inject: [ConfigService],
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ClassificationModule,
  ],
})
export class AppModule {}
