/**
 * LDS Product — the viewer-overlay surface family: chrome that floats over a
 * viewer (video, dark map) instead of sitting in the page flow.
 *
 * One source, two deliberate levels — they are different jobs, not drift:
 *
 * - `strong` (94% + blur): interactive chrome the operator reads and clicks —
 *   ViewerToolbar. Legibility of the controls outranks seeing through them.
 * - `soft` (72% + blur): manual controls the operator holds while watching the
 *   footage underneath — Robotics DirectionalPad / Joystick overlays. The
 *   translucency keeps the ground visible through the control; the blur, not
 *   the opacity, carries ink legibility over busy frames.
 *
 * Shared grammar: the fallback tone is static-black, never a themed surface —
 * an overlay sits on footage, so it stays a dark scrim with light ink even on
 * a light page. Border, shadow, blur, and ink are identical across levels so
 * the two read as one family when they share a frame.
 */

const surfaceAt = (opacity) =>
  `color-mix(in srgb, var(--viewer-surface-elevated, var(--color-semantic-static-black)) ${opacity}%, transparent)`;

const SHARED = {
  border: '1px solid color-mix(in srgb, var(--color-semantic-static-white) 20%, transparent)',
  shadow: '0 2px 8px color-mix(in srgb, var(--color-semantic-static-black) 24%, transparent)',
  blur: 'blur(8px)',
  ink: 'var(--color-semantic-static-white)',
  inkMuted: 'color-mix(in srgb, var(--color-semantic-static-white) 76%, transparent)',
  hairline: 'color-mix(in srgb, var(--color-semantic-static-white) 28%, transparent)',
  /** Text outside a scrim sits on raw footage; the shadow is its legibility floor. */
  textShadow: '0 1px 2px color-mix(in srgb, var(--color-semantic-static-black) 60%, transparent)',
};

export const VIEWER_OVERLAY_SURFACE = {
  strong: { surface: surfaceAt(94), ...SHARED },
  soft: { surface: surfaceAt(72), ...SHARED },
};
