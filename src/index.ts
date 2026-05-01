import { config } from './config/env';
import { connectDB } from './db/connection';
import { logger } from './utils/logger';
import app from './app';

const startServer = async () => {
  await connectDB();

  const server = app.listen(config.port, () => {
    logger.info(`🚀 T-World API running on port ${config.port} [${config.nodeEnv}]`);
  });

  // Graceful shutdown
  const shutdown = (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection:', reason);
    server.close(() => process.exit(1));
  });
};

startServer();