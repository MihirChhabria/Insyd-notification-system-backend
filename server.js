import 'dotenv/config'; // Load env variables first

import http from 'http';
import express from 'express';
import { setupWebSocket } from './websockets/wsServer.js';
import { connectRedis } from './consumer/config/redisConfig.js';

async function startServer() {
  // Log env to verify
  console.log('REDIS_URL:', process.env.REDIS_URL);

  await connectRedis();  // Connect Redis before using it

  const app = express();
  const server = http.createServer(app);
    
  setupWebSocket(server);

  const PORT = 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });
}

startServer();
