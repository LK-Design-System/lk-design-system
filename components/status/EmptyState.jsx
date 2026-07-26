import React from 'react';
import { statusToneStyle } from './status-presentation.js';

/**
 * LK ROBOTICS — EmptyState
 * A centered placeholder for empty lists / no-results / errors. A muted icon in
 * a soft cyan tile, a bold title, a calm description and an optional action.
 *
 * The title renders as a real heading (Carbon / Polaris / Atlassian do the same)
 * so screen-reader users can reach the empty state through heading navigation.
 * `headingLevel` places it in the surrounding document outline.
 */
export function EmptyState({ icon, title, description, action, tone = 'signal', headingLevel = 2, style, ...rest }) {
  const Heading = `h${Math.min(6, Math.max(2, headingLevel))}`;
  const palette = statusToneStyle(tone);
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        gap: 'var(--space-1-5)', padding: '48px 24px', fontFamily: 'var(--font-sans)', maxWidth: 420, margin: '0 auto', ...style,
      }}
      {...rest}
    >
      {icon != null && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56,
          borderRadius: 'var(--radius-xl)', background: palette.surface, color: palette.foreground, marginBottom: 12,
        }}>{icon}</div>
      )}
      {title != null && (
        <Heading style={{ margin: 0, fontSize: 'var(--headline1-size)', lineHeight: 'var(--headline1-line)', fontWeight: 'var(--fw-bold)', letterSpacing: 0, color: 'var(--color-semantic-label-normal)' }}>
          {title}
        </Heading>
      )}
      {description != null && <div style={{ fontSize: 'var(--label1-size)', lineHeight: 1.65, color: 'var(--color-semantic-label-alternative)', wordBreak: 'keep-all' }}>{description}</div>}
      {action != null && <div style={{ marginTop: 'var(--space-3-5)' }}>{action}</div>}
    </div>
  );
}
