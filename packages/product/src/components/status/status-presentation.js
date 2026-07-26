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

const STATUS_TONE_ALIASES = {
  info: 'signal',
  success: 'positive',
  warning: 'cautionary',
  error: 'negative',
  normal: 'offline',
  online: 'positive',
};

export function normalizeStatusTone(tone, fallback = 'offline') {
  const normalized = STATUS_TONE_ALIASES[tone] ?? tone;
  return STATUS_TONE_STYLE[normalized] ? normalized : fallback;
}

export function statusToneStyle(tone, fallback = 'offline') {
  return STATUS_TONE_STYLE[normalizeStatusTone(tone, fallback)];
}

/**
 * Panel-embedded status band geometry shared by Banner `embedded` and the
 * ValidationSummary severity heading bands (Primer Banner `flush` parity:
 * side borders and radius removed, top/bottom tone hairlines kept). The band
 * owns both hairlines, so adjacent neutral separators must be omitted
 * wherever a band sits against them.
 */
export function embeddedBandStyle({ surface, border }) {
  return {
    background: surface,
    borderTop: `1px solid ${border}`,
    borderBottom: `1px solid ${border}`,
    borderLeft: 'none',
    borderRight: 'none',
    borderRadius: 0,
  };
}
