import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConnectionEnums } from './common/const/connection.enum';
import { I18nModule } from 'nestjs-i18n';
import { APP_INTERCEPTOR } from '@nestjs/core';
// import { MessagebrokerModule } from './messagebroker/messagebroker.module';
import * as Joi from 'joi';
import * as redisStore from 'cache-manager-redis-store';
import { HttpCacheInterceptor } from 'ifmcommon';
import { LoggerModule } from './trace_logger/trace.logger.module';
import { OpenTelemetryModuleConfig } from './common/configs/opentelemetry.options';
// import { UsersModule } from './users/users.module';
// import { HistoryModule } from './history/history.module';
import { i18nOptions } from './common/configs/i18n.options';
import { KeycloakModule } from './common/keycloack/keycloak.module';
import { TestModule } from './test/test.module';
import { TypeModule } from './winform/type.module';

//import { Neo4jModule } from './sgnm-neo4j/src';
import { Neo4jModule } from 'sgnm-neo4j/dist';


@Module({
  imports: [
    OpenTelemetryModuleConfig,
    LoggerModule,
    KeycloakModule,
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
    I18nModule.forRoot(i18nOptions(__dirname)),
    MongooseModule.forRootAsync({
      connectionName: ConnectionEnums.WINFORM,
      useFactory: (config: ConfigService) => ({
        uri: config.get('DATABASE_LINK'),
        dbName: config.get('WINFORM_DB_NAME'),
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
      cache: true,
      validationSchema: Joi.object({
        DATABASE_LINK: Joi.string().required(),
      }),
    }),
    //MessagebrokerModule,
    //HistoryModule,
    TypeModule,
    TestModule,
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
