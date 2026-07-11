export const STATUS_TONE_STYLE = {
  positive: {
    icon: 'circle-check-fill',
    foreground: 'var(--color-semantic-status-positive-text)',
    surface: 'var(--color-semantic-status-positive-surface)',
    border: 'var(--color-semantic-status-positive-border)',
  },
  cautionary: {
    icon: 'triangle-exclamation-fill',
    foreground: 'var(--color-semantic-status-cautionary-text)',
    surface: 'var(--color-semantic-status-cautionary-surface)',
    border: 'var(--color-semantic-status-cautionary-border)',
  },
  negative: {
    icon: 'circle-close-fill',
    foreground: 'var(--color-semantic-status-negative-text)',
    surface: 'var(--color-semantic-status-negative-surface)',
    border: 'var(--color-semantic-status-negative-border)',
  },
  signal: {
    icon: 'circle-info-fill',
    foreground: 'var(--color-semantic-status-info-text)',
    surface: 'var(--color-semantic-status-info-surface)',
    border: 'var(--color-semantic-status-info-border)',
  },
  offline: {
    icon: 'circle-info',
    foreground: 'var(--color-semantic-status-neutral-text)',
    surface: 'var(--color-semantic-status-neutral-surface)',
    border: 'var(--color-semantic-status-neutral-border)',
  },
};

export function statusToneStyle(tone, fallback = 'offline') {
  return STATUS_TONE_STYLE[tone] ?? STATUS_TONE_STYLE[fallback];
}
