export const VIEWER_STATES = Object.freeze([
  'idle',
  'no-source',
  'loading',
  'connecting',
  'ready',
  'live',
  'degraded',
  'stale',
  'frozen',
  'paused',
  'unavailable',
  'disconnected',
  'no-signal',
  'error',
]);

export const VIEWER_BLOCKING_STATES = Object.freeze([
  'idle',
  'no-source',
  'loading',
  'connecting',
  'unavailable',
  'disconnected',
  'no-signal',
  'error',
]);

const VIEWER_STATE_SET = new Set(VIEWER_STATES);

/**
 * Resolve the new orthogonal Viewer axes to the legacy presentation state.
 * Explicit axes take precedence; `state` remains the compatibility adapter.
 */
export function resolveViewerState({
  state,
  availability,
  connection,
  freshness,
  playback,
} = {}) {
  const usesAxes = availability != null
    || connection != null
    || freshness != null
    || playback != null;

  if (!usesAxes) return VIEWER_STATE_SET.has(state) ? state : 'ready';

  const resolvedAvailability = availability ?? 'ready';
  const resolvedConnection = connection ?? 'connected';
  const resolvedFreshness = freshness ?? 'current';
  const resolvedPlayback = playback ?? 'playing';

  if (resolvedAvailability !== 'ready') {
    return ['idle', 'no-source', 'loading', 'unavailable', 'error'].includes(resolvedAvailability)
      ? resolvedAvailability
      : 'ready';
  }
  if (resolvedConnection !== 'connected') {
    return ['connecting', 'disconnected', 'no-signal'].includes(resolvedConnection)
      ? resolvedConnection
      : 'ready';
  }
  if (resolvedFreshness !== 'current') {
    return ['degraded', 'stale', 'frozen'].includes(resolvedFreshness)
      ? resolvedFreshness
      : 'ready';
  }
  if (resolvedPlayback !== 'playing') {
    return ['live', 'paused'].includes(resolvedPlayback)
      ? resolvedPlayback
      : 'ready';
  }
  return 'ready';
}
