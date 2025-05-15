// consumer/services/eventProcessor.js
async function processEvent(event) {
    const { type, actorId, targetId, postId, timestamp } = event;
  
    if (!type || !actorId || !targetId || !postId || !timestamp) {
      throw new Error('Invalid event structure');
    }
  
    // For now, just simulate processing
    console.log(`✅ Processing event: ${type} by ${actorId} on post ${postId}`);
  
    // Next steps:
    // - Validate schema
    // - Deduplication
    // - Throttling
    // - Forward to formatter service
  }
  

  export{
    processEvent
  }