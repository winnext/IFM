import Pino, { Logger ,LoggerOptions,destination } from 'pino';
import { trace, context } from '@opentelemetry/api';

export const loggerOptions: LoggerOptions = {
  customLevels: {["success"]:200,["error"]:400},
  formatters: {
    log(object) {
      const span = trace.getSpan(context.active());
      
      if (!span) return { ...object };
      const { spanId, traceId } = trace.getSpan(context.active())?.spanContext();
      return { ...object ,spanId, traceId };
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

export const logger: Logger = Pino(loggerOptions, destination(`/var/log/app.log`));