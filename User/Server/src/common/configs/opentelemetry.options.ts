import { OpenTelemetryModule } from 'nestjs-otel';
export const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
  metrics: {
    hostMetrics: true,
    defaultMetrics: true,
    apiMetrics: {
      enable: true,
    },
  },
});
