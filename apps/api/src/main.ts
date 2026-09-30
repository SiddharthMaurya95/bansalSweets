import { buildApp } from './app.js';
import { loadEnv } from './config/env.js';

async function start() {
  const env = loadEnv();
  const app = await buildApp();

  const shutdown = async (signal: string) => {
    app.log.info({ signal }, 'Received shutdown signal, closing server gracefully...');
    try {
      await app.close();
      app.log.info('Server closed successfully.');
      process.exit(0);
    } catch (err) {
      app.log.error({ err }, 'Error during graceful shutdown');
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));

  try {
    const address = await app.listen({ port: env.PORT, host: env.HOST });
    app.log.info({ address, env: env.NODE_ENV }, '🚀 Bansal Foods API server running');
  } catch (err) {
    app.log.fatal({ err }, 'Failed to start server');
    process.exit(1);
  }
}

void start();
