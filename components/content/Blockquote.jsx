import React from 'react';

/**
 * LK ROBOTICS — Blockquote
 * A quotation on a quiet fill surface (인용, 고객 사례). Optional
 * `attribution` renders a muted source line.
 *
 * The former 3px primary left rule is gone: primary is this system's
 * interaction ink, so a quotation wearing it read as a link or a selection
 * accent rather than as quoting. The fill box is the snippet idiom — text
 * visibly lifted out of another document — and it is the same treatment
 * SourceDisclosure gives a cited excerpt, so quoting looks like one thing
 * everywhere.
 *
 * HTML convention — the attribution is NOT part of the quotation, so it lives
 * in `<figcaption>` next to the `<blockquote>` inside a `<figure>`, per the
 * HTML spec's "attribution outside the blockquote" guidance. The surface and
 * padding move to the figure so the visual is unchanged.
 *
 * Naming — `attribution` is the human-readable source. The HTML `cite`
 * ATTRIBUTE takes a URL, so that is exposed separately as `citeUrl`; the legacy
 * `cite` prop is still accepted as an alias for `attribution`.
 */
export function Blockquote({ children, attribution, cite, citeUrl, style, ...rest }) {
  const source = attribution ?? cite;
  const quoteStyle = { fontSize: 'var(--headline2-size)', lineHeight: 1.7, letterSpacing: 0, color: 'var(--color-semantic-label-normal)', wordBreak: 'keep-all' };
  const frameStyle = { margin: 0, padding: 'var(--space-3) var(--space-4)', background: 'var(--color-semantic-fill-alternative)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', ...style };

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
