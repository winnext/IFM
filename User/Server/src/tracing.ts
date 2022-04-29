/* eslint-disable @typescript-eslint/no-var-requires */
import { CompositePropagator, W3CTraceContextPropagator, W3CBaggagePropagator } from '@opentelemetry/core';

import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import * as process from 'process';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const { KafkaJsInstrumentation } = require('opentelemetry-instrumentation-kafkajs');

const { trace } = require('@opentelemetry/api');
const { BasicTracerProvider, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');

/**
 * trace provider
 */
const provider = new BasicTracerProvider({
  resource: new Resource({ [SemanticResourceAttributes.SERVICE_NAME]: 'user_service' }),
});
provider.register();
provider.addSpanProcessor(new BatchSpanProcessor(new JaegerExporter({host:process.env.JAEGER_HOST})));
trace.setGlobalTracerProvider(provider);

/**
 * name of tracer
 */
const name = 'user_service';
/**
 * version of tracer
 */
const version = '0.1.0';
/**
 * init tracer
 */
const tracer = trace.getTracer(name, version);
/**
 * trial for opentelemetery
 */
const trial = new NodeSDK({
  metricExporter: new PrometheusExporter({
    port: 8090,
  }),
  metricInterval: 6000,
  spanProcessor: tracer, //new BatchSpanProcessor(new JaegerExporter()),
  contextManager: new AsyncLocalStorageContextManager(),
  textMapPropagator: new CompositePropagator({
    propagators: [
      new JaegerPropagator(),
      new W3CTraceContextPropagator(),
      new W3CBaggagePropagator(),
      new B3Propagator(),
      new B3Propagator({
        injectEncoding: B3InjectEncoding.MULTI_HEADER,
      }),
    ],
  }),
  instrumentations: [getNodeAutoInstrumentations(), new PinoInstrumentation()],
});

/**
 * export trial
 */
export default trial;

process.on('SIGTERM', () => {
  trial
    .shutdown()
    .then(
      () => console.log('SDK shut down successfully'),
      (err) => console.log('Error shutting down SDK', err),
    )
    .finally(() => process.exit(0));
});
