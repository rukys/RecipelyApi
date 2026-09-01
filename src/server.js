import { createApp } from './app.js';
import { config } from './config/index.js';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`=========================================`);
  console.log(` 🍳 Recipely API is running on port ${config.port}`);
  console.log(` 📖 Documentation: http://localhost:${config.port}/api/docs`);
  console.log(` 🌍 Environment: ${config.nodeEnv}`);
  console.log(`=========================================`);
});

// Handle graceful shutdown
const shutdown = () => {
  console.log('Shutting down Recipely API...');
  server.close(() => {
    console.log('Server terminated cleanly.');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
