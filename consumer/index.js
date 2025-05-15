import 'dotenv/config';
import { connectAndConsume } from './services/mqConsumerService.js';

async function startConsumer() {
  try {
    await connectAndConsume();
    console.log('Consumer started and listening for messages...');
  } catch (error) {
    console.error('[x] Consumer failed to start:', error);
    process.exit(1);
  }
}

startConsumer();