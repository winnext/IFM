import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConnectionEnums } from './common/const/connection.enum';
import { I18nModule } from 'nestjs-i18n';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MessagebrokerModule } from './messagebroker/messagebroker.module';
import * as Joi from 'joi';
import { MulterModule } from '@nestjs/platform-express';
import { HistoryModule } from './kiramenKatibin/history.module';
import * as redisStore from 'cache-manager-redis-store';
import { LoggerModule } from './trace_logger/trace.logger.module';
import { OpenTelemetryModuleConfig } from './common/configs/opentelemetry.options';
import { Neo4jModule } from 'sgnm-neo4j';
import { i18nOptions } from './common/configs/i18n.options';
import { KeycloakModule } from './common/keycloak/keycloak.module';
import { HttpCacheInterceptor } from 'ifmcommon';
import { AssetModule } from './asset/asset.module';
import { TreeModule } from './assetTree/tree.module';

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

    I18nModule.forRoot(i18nOptions(__dirname)),

    MongooseModule.forRootAsync({
      connectionName: ConnectionEnums.ASSET,
      useFactory: (config: ConfigService) => ({
        uri: config.get('DATABASE_LINK'),
        dbName: config.get('ASSET_DB_NAME'),
        user: config.get('DB_USER'),
        pass: config.get('DB_PASS'),
      }),
      inject: [ConfigService],
    }),
    Neo4jModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: configService.get('NEO4J_HOST'),
        password: configService.get('NEO4J_PASSWORD'),
        port: configService.get('NEO4J_PORT'),
        scheme: configService.get('NEO4J_SCHEME'),
        username: configService.get('NEO4J_USERNAME'),
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
    TreeModule,
    HistoryModule,
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
