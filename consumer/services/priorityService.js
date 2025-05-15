const TRANSACTIONAL_TYPES = new Set(['LIKE', 'COMMENT', 'MENTION']);

export function getPriority(eventType) {
  return TRANSACTIONAL_TYPES.has(eventType) ? 'transactional' : 'promotional';
}
