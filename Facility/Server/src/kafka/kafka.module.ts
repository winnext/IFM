import { Module, DynamicModule, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { KafkaConfig } from 'kafkajs';
import { KAFKA_PRODUCER, KAFKA_OPTIONS } from './kafka.constants';
import { KafkaService } from './kafka.service';
import {  createProducer } from './kafka.util';

@Module({})
export class KafkaModule {
  static forRoot(config: KafkaConfig): DynamicModule {
    return {
      module: KafkaModule,
      global: true,
      providers: [
        {
          provide: KAFKA_OPTIONS,
          useValue: config,
        },
        {
          provide: KAFKA_PRODUCER,
          inject: [KAFKA_OPTIONS],
          useFactory: async (config: KafkaConfig) => createProducer(config),
        },
        KafkaService,
      ],
      exports: [KafkaService],
    };
  }

  static forRootAsync(configProvider: any): DynamicModule {
    return {
      module: KafkaModule,
      global: true,
      imports: [ConfigModule],

      providers: [
        {
          provide: KAFKA_OPTIONS,
          ...configProvider,
        } as Provider<any>,
        {
          provide: KAFKA_PRODUCER,
          inject: [KAFKA_OPTIONS],
          useFactory: async (config: KafkaConfig) => createProducer(config),
        },
        KafkaService,
      ],
      exports: [KafkaService],
    };
  }
}
