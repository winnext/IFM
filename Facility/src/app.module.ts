import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FacilityModule } from "./facility/facility.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
@Module({
  imports: [
    FacilityModule,

    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.get("DATABASE_LINK"),
        dbName: "facility",
        user: "user",
        pass: "pass",
      }),
      inject: [ConfigService],
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
