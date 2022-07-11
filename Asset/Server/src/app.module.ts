import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { I18nModule } from 'nestjs-i18n';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MessagebrokerModule } from './messagebroker/messagebroker.module';
import * as Joi from 'joi';
import { MulterModule } from '@nestjs/platform-express';

import * as redisStore from 'cache-manager-redis-store';
import { LoggerModule } from './trace_logger/trace.logger.module';
import { OpenTelemetryModuleConfig } from './common/configs/opentelemetry.options';

//import { Neo4jModule } from 'sgnm-neo4j';
import { Neo4jModule } from './sgnm-neo4j/src';

import { i18nOptions } from './common/configs/i18n.options';
import { KeycloakModule } from './common/keycloak/keycloak.module';
import { HttpCacheInterceptor, KafkaModule } from 'ifmcommon';
import { AssetModule } from './asset/asset.module';


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

    KeycloakModule,

    KafkaModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        brokers: [configService.get('KAFKA_BROKER')],
        clientId: configService.get('KAFKA_CLIENT_ID'),
      }),
    }),

    I18nModule.forRoot(i18nOptions(__dirname)),

    Neo4jModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: configService.get('NEO4J_HOST'),
        password: configService.get('NEO4J_PASSWORD'),
        port: configService.get('NEO4J_PORT'),
        scheme: configService.get('NEO4J_SCHEME'),
        username: configService.get('NEO4J_USERNAME'),
        database: configService.get('NEO4J_DATABASE'),
      }),
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

    AssetModule,
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
