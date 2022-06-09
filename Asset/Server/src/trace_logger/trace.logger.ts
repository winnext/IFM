import Pino, { Logger ,LoggerOptions,destination } from 'pino';
import { trace, context } from '@opentelemetry/api';

const timer =()=>{
  let date = new Date();
  return date;
}

export const loggerOptions: LoggerOptions = {
  formatters: {
    log(object) {
      const span = trace.getSpan(context.active());
      
      if (!span) return { ...object };
      const { spanId, traceId } = trace.getSpan(context.active())?.spanContext();
      let time1 = timer();
      return { ...object, spanId, traceId,time1 };
    },
  },
  prettyPrint:
    process.env.NODE_ENV === 'local'
      ? {
          colorize: true,
          levelFirst: true,
          translateTime: true,
        }
      : false,
};

export const logger: Logger = Pino(loggerOptions);
//export const logger: Logger = Pino(loggerOptions, destination(`/var/log/app_facility.log`));