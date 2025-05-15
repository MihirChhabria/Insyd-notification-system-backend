import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { redisClient } from '../consumer/config/redisConfig.js';

const onlineUsers = new Map(); // userId -> ws

export function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
  
    let userId;
  
    wss.on('connection', (ws) => {
      console.log('New WebSocket connection');
  
      let userId;
  
      ws.on('message', async (message) => {
        console.log('WS message received:', message.toString());
  
        try {
          const parsed = JSON.parse(message);
          console.log('Parsed message:', parsed);
  
          if (parsed.type === 'AUTH') {
            userId = parsed.userId;
            onlineUsers.set(userId, ws);
            console.log(`✅ WebSocket authenticated for user ${userId}`);
  
            const redisKey = `notifications:${userId}`;
            const pending = await redisClient.lRange(redisKey, 0, -1);
            console.log(`📨 Pending messages for user ${userId}: ${pending.length}`);
  
            for (let msg of pending) {
              const parsedMsg = JSON.parse(msg);
              if (parsedMsg.status === 'pending') {
                ws.send(JSON.stringify({ type: 'NOTIFICATION', payload: parsedMsg }));
                console.log('Sent notification:', parsedMsg.notificationId || parsedMsg);
              }
            }
          }
  
          // ✅ Add ACK handling here
          if (parsed.type === 'ACK' && userId) {
            const { notificationId } = parsed;
            const redisKey = `notifications:${userId}`;
            const all = await redisClient.lRange(redisKey, 0, -1);
  
            for (let i = 0; i < all.length; i++) {
              const entry = JSON.parse(all[i]);
              if (entry.notificationId === notificationId) {
                entry.status = 'delivered';
                await redisClient.lSet(redisKey, i, JSON.stringify(entry));
                console.log(`✅ ACK received. Updated Redis status for ${notificationId} to delivered`);
                break;
              }
            }
          }
  
        } catch (err) {
          console.error('Failed to parse WS message:', err);
        }
      });
    });
  })
}
