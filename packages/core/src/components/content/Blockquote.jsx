import React from 'react';

/**
 * LK ROBOTICS — Blockquote
 * A quotation with a signal-ink left rule (인용, 고객 사례). Optional `cite`
 * renders a muted attribution line.
 */
export function Blockquote({ children, cite, style, ...rest }) {
  return (
    <blockquote style={{ margin: 0, padding: '6px 0 6px 20px', borderLeft: '3px solid var(--color-semantic-primary-normal)', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <div style={{ fontSize: 'var(--headline2-size)', lineHeight: 1.7, letterSpacing: 0, color: 'var(--color-semantic-label-normal)', wordBreak: 'keep-all' }}>{children}</div>
      {cite != null && <div style={{ marginTop: 8, fontSize: 'var(--label2-size)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-semantic-label-alternative)' }}>— {cite}</div>}
    </blockquote>
  );
}
