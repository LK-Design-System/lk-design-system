import React from 'react';
import { statusToneStyle } from '../status/status-presentation.js';

function resolveTone(tone) {
  if (tone === 'critical') return statusToneStyle('negative');
  return statusToneStyle(tone);
}

/**
 * LDS Core — StatusBadge
 * A compact, non-interactive status label. Semantic tone is carried by a soft
 * surface and matching readable foreground; visible text remains the primary
 * status cue. Live availability belongs to StatusIndicator.
 */
export function StatusBadge({ children, tone = 'positive', style, ...rest }) {
  const appearance = resolveTone(tone);

  return (
    <span
      className={`lk-status-badge lk-status-badge--${tone}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        height: 20,
        maxWidth: '100%',
        padding: '0 var(--space-2)',
        borderRadius: 'var(--radius-pill)',
        background: appearance.surface,
        color: appearance.foreground,
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--caption1-size)',
        fontWeight: 'var(--fw-semibold)',
        lineHeight: 1,
        letterSpacing: 0,
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
