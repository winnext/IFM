import Pino, { Logger, LoggerOptions, destination } from 'pino';
import { trace, context } from '@opentelemetry/api';

/**
 * Logger options for open telemetry
 */
export const loggerOptions: LoggerOptions = {
  formatters: {
    log(object) {
      const span = trace.getSpan(context.active());

      if (!span) return { ...object };
      const { spanId, traceId } = trace.getSpan(context.active())?.spanContext();
      return { ...object, spanId, traceId };
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

/**
 * Export pino logger
 */
export const logger: Logger = Pino(loggerOptions);
//export const logger: Logger = Pino(loggerOptions, destination(`/var/log/app_user.log`));
