import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FacilityModule } from './facility/facility.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConnectionEnums } from './common/const/connection.enum';
import { I18nModule } from 'nestjs-i18n';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MessagebrokerModule } from './messagebroker/messagebroker.module';
import * as Joi from 'joi';
import { MulterModule } from '@nestjs/platform-express';
import { FacilityStructuresModule } from './facility-structures/facility-structures.module';
import { HistoryModule } from './kiramenKatibin/history.module';
import * as redisStore from 'cache-manager-redis-store';
import { LoggerModule } from './trace_logger/trace.logger.module';
import { OpenTelemetryModuleConfig } from './common/configs/opentelemetry.options';
import { Neo4jModule } from 'sgnm-neo4j';

import { i18nOptions } from './common/configs/i18n.options';
import { RoomModule } from './rooms/room.module';
import { KeycloakModule } from './common/keycloak/keycloak.module';
import { ClassificationModule } from './classification/classification.module';
import { HttpCacheInterceptor } from 'ifmcommon';

@Module({
  imports: [
    OpenTelemetryModuleConfig,
    LoggerModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get('CACHE_TTL'), //time to keep in cache in seconds
        store: redisStore,
        host: configService.get('CACHE_HOST'),
        port: +configService.get('CACHE_PORT'),
        isGlobal: true,
        max: +configService.get('CACHE_MAX'), // maximum number of items in cache
      }),
      inject: [ConfigService],
    }),

    MulterModule.register({
      dest: './upload',
    }),
    FacilityModule,

    KeycloakModule,

    I18nModule.forRoot(i18nOptions(__dirname)),
    MongooseModule.forRootAsync({
      connectionName: ConnectionEnums.FACILITY,
      useFactory: (config: ConfigService) => ({
        uri: config.get('DATABASE_LINK'),

        dbName: config.get('FACILITY_DB_NAME'),
        user: config.get('DB_USER'),
        pass: config.get('DB_PASS'),
      }),
      inject: [ConfigService],
    }),

    MongooseModule.forRootAsync({
      connectionName: ConnectionEnums.CLASSIFICATION,
      useFactory: (config: ConfigService) => ({
        uri: config.get('DATABASE_LINK'),
        dbName: config.get('CLASSIFICATION_DB_NAME'),
        user: config.get('DB_USER'),
        pass: config.get('DB_PASS'),
      }),
      inject: [ConfigService],
    }),
    Neo4jModule.forRoot({
      scheme: 'neo4j',
      host: '172.30.99.120',
      port: 7687,
      username: 'neo4j',
      password: 'password',
    }),

    MongooseModule.forRootAsync({
      connectionName: ConnectionEnums.ROOM,
      useFactory: (config: ConfigService) => ({
        uri: config.get('DATABASE_LINK'),
        dbName: config.get('ROOM_DB_NAME'),
        user: config.get('DB_USER'),
        pass: config.get('DB_PASS'),
      }),
      inject: [ConfigService],
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_LINK: Joi.string().required(),
        CACHE_HOST: Joi.string().required(),
        CACHE_PORT: Joi.string().required(),
      }),
    }),

    MessagebrokerModule,

    FacilityStructuresModule,

    HistoryModule,

    RoomModule,

    ClassificationModule,
  ],
  providers: [
    //to cache all get request
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
  ],
})
export class AppModule {}
