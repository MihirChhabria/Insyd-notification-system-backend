import 'dotenv/config';
import { connectAndConsume } from './services/mqConsumerService.js';
import { connectRedis } from './config/redisConfig.js';

async function startConsumer() {
  try {
    await connectRedis();          // <-- Connect Redis first
    await connectAndConsume();     // <-- Then start consuming from MQ
    console.log('Consumer started and listening for messages...');
  } catch (error) {
    console.error('[x] Consumer failed to start:', error);
    process.exit(1);
  }
}

startConsumer();
