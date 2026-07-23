import React from 'react';

/**
 * LK ROBOTICS — Blockquote
 * A quotation with a signal-ink left rule (인용, 고객 사례). Optional
 * `attribution` renders a muted source line.
 *
 * HTML convention — the attribution is NOT part of the quotation, so it lives
 * in `<figcaption>` next to the `<blockquote>` inside a `<figure>`, per the
 * HTML spec's "attribution outside the blockquote" guidance. The left rule and
 * padding move to the figure so the visual is unchanged.
 *
 * Naming — `attribution` is the human-readable source. The HTML `cite`
 * ATTRIBUTE takes a URL, so that is exposed separately as `citeUrl`; the legacy
 * `cite` prop is still accepted as an alias for `attribution`.
 */
export function Blockquote({ children, attribution, cite, citeUrl, style, ...rest }) {
  const source = attribution ?? cite;
  const quoteStyle = { fontSize: 'var(--headline2-size)', lineHeight: 1.7, letterSpacing: 0, color: 'var(--color-semantic-label-normal)', wordBreak: 'keep-all' };
  const frameStyle = { margin: 0, padding: '6px 0 6px 20px', borderLeft: '3px solid var(--color-semantic-primary-normal)', fontFamily: 'var(--font-sans)', ...style };

  if (source == null) {
    return (
      <blockquote cite={citeUrl} style={frameStyle} {...rest}>
        <div style={quoteStyle}>{children}</div>
      </blockquote>
    );
  }

  return (
    <figure style={frameStyle} {...rest}>
      <blockquote cite={citeUrl} style={{ margin: 0 }}>
        <div style={quoteStyle}>{children}</div>
      </blockquote>
      <figcaption style={{ marginTop: 8, fontSize: 'var(--label2-size)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-semantic-label-alternative)' }}>— {source}</figcaption>
    </figure>
  );
}
