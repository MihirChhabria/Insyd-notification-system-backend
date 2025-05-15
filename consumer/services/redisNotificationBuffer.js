import { redisClient } from '../config/redisConfig.js';

const NOTIF_BUFFER_PREFIX = 'notifications:buffer:';
const NOTIF_TTL_SECONDS = 3600; 

export async function addNotificationToBuffer(userId, notification) {
  const key = `${NOTIF_BUFFER_PREFIX}${userId}`;

  // Add status = 'pending' before storing
  const enrichedNotification = {
    ...notification,
    status: 'pending'
  };

  const notifString = JSON.stringify(enrichedNotification);
  await redisClient.rPush(key, notifString);
  const ttl = await redisClient.ttl(key);
  if (ttl === -1) {
    await redisClient.expire(key, NOTIF_TTL_SECONDS);
  }

  console.log(`[RedisBuffer] Added pending notification for user ${userId}, key: ${key}`);
}
