// consumer/services/eventProcessor.js
import { eventSchema } from '../validators/eventSchema.js';
import { isDuplicate } from '../services/deduplicationService.js';
import { isThrottled } from '../services/rateLimiterService.js';
import { getPriority } from '../services/priorityService.js';

async function processEvent(event) {
  try {
    // 1. Validate event schema
    eventSchema.parse(event);

    const { actorId, type } = event;

    // 2. Deduplication check
    const duplicate = await isDuplicate(event);
    if (duplicate) {
      console.warn('⏳ Event is a duplicate, skipping processing');
      return { status: 'duplicate' };
    }

    // 3. Rate limiting check
    const throttled = await isThrottled(actorId);
    if (throttled) {
      console.warn('⏳ User is rate limited, skipping processing');
      return { status: 'throttled' };
    }

    // 4. Priority tagging
    const priority = getPriority(type);
    console.log(`✅ Event priority: ${priority}`);

    // 5. Proceed with forwarding event for formatting/dispatching
    // For now, just simulate processing
    console.log(`✅ Processing event: ${type} by user ${actorId}`);

    return { status: 'processed', priority };

  } catch (err) {
    console.error('❌ Event processing failed:', err.message || err);
    return { status: 'error', error: err.message || err };
  }
}

export{
    processEvent
}