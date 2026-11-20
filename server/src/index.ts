import { createApp } from './app';
import { config } from './config';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📡 Health check: http://localhost:${config.port}/api/v1/health`);
});

const shutdown = () => {
  console.log('Shutting down server gracefully...');
  server.close(() => {
    console.log('Server terminated.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
