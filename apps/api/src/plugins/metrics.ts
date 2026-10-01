import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

interface RequestMetric {
  method: string;
  route: string;
  statusCode: number;
  durationMs: number;
}

class MetricsRegistry {
  private requestsTotal: Map<string, number> = new Map();
  private requestDurations: RequestMetric[] = [];
  private startTime = Date.now();

  recordRequest(method: string, route: string, statusCode: number, durationMs: number) {
    const key = `${method}:${route}:${statusCode}`;
    this.requestsTotal.set(key, (this.requestsTotal.get(key) || 0) + 1);

    // Keep rolling window of last 1000 requests for duration statistics
    if (this.requestDurations.length > 1000) {
      this.requestDurations.shift();
    }
    this.requestDurations.push({ method, route, statusCode, durationMs });
  }

  getMetricsOutput(): string {
    const lines: string[] = [];

    lines.push('# HELP process_uptime_seconds The process uptime in seconds');
    lines.push('# TYPE process_uptime_seconds gauge');
    lines.push(`process_uptime_seconds ${((Date.now() - this.startTime) / 1000).toFixed(2)}`);

    const mem = process.memoryUsage();
    lines.push('# HELP process_resident_memory_bytes Resident memory size in bytes');
    lines.push('# TYPE process_resident_memory_bytes gauge');
    lines.push(`process_resident_memory_bytes ${mem.rss}`);

    lines.push('# HELP process_heap_used_bytes Process heap memory used in bytes');
    lines.push('# TYPE process_heap_used_bytes gauge');
    lines.push(`process_heap_used_bytes ${mem.heapUsed}`);

    lines.push('# HELP http_requests_total Total number of HTTP requests processed');
    lines.push('# TYPE http_requests_total counter');
    for (const [key, count] of this.requestsTotal.entries()) {
      const [method, route, status] = key.split(':');
      lines.push(
        `http_requests_total{method="${method}",route="${route}",status="${status}"} ${count}`,
      );
    }

    if (this.requestDurations.length > 0) {
      const totalDuration = this.requestDurations.reduce((acc, r) => acc + r.durationMs, 0);
      const avgDurationSec = (totalDuration / this.requestDurations.length / 1000).toFixed(4);

      lines.push('# HELP http_request_duration_seconds Average HTTP request duration in seconds');
      lines.push('# TYPE http_request_duration_seconds gauge');
      lines.push(`http_request_duration_seconds ${avgDurationSec}`);
    }

    return lines.join('\n') + '\n';
  }
}

export const metricsRegistry = new MetricsRegistry();

const metricsPluginImpl: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onResponse', async (request, reply) => {
    const route = request.routeOptions?.url || request.url.split('?')[0] || '/';
    const duration = reply.elapsedTime;
    metricsRegistry.recordRequest(request.method, route, reply.statusCode, duration);
  });

  // Expose /metrics endpoint in Prometheus format
  fastify.get('/metrics', async (_request, reply) => {
    reply.type('text/plain; version=0.0.4; charset=utf-8');
    return metricsRegistry.getMetricsOutput();
  });
};

export const metricsPlugin = fp(metricsPluginImpl, {
  name: 'metrics-plugin',
  fastify: '5.x',
});
