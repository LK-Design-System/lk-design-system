import React from 'react';

const MONO = 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)';

/**
 * LK ROBOTICS — SourceTag
 * A citation chip — a mono kicker (default "SOURCE"), a hairline divider, the
 * source name, and a trailing ↗ when it links out. Use to attribute specs,
 * datasets, press or research to their origin. Renders as a link when `href`
 * is set; `tone="onDark"` for navy surfaces.
 */
export function SourceTag({ children, label = 'SOURCE', href, tone = 'default', style, ...rest }) {
  const isLink = href != null;
  const Comp = isLink ? 'a' : 'span';
  const [hover, setHover] = React.useState(false);
  const onDark = tone === 'onDark';
  return (
    <Comp
      href={href}
      target={isLink ? '_blank' : undefined}
      rel={isLink ? 'noopener noreferrer' : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, height: 'var(--component-tag-height)', paddingInline: 11,
        borderRadius: 'var(--radius-pill)',
        background: onDark ? 'var(--color-semantic-inverse-fill-normal)' : 'var(--color-semantic-fill-normal)',
        border: `1px solid ${onDark ? 'var(--color-semantic-inverse-fill-strong)' : 'var(--color-semantic-line-normal-normal)'}`,
        fontFamily: 'var(--font-sans)', fontSize: 12.5, whiteSpace: 'nowrap', textDecoration: 'none',
        cursor: isLink ? 'pointer' : 'default',
        color: onDark ? 'var(--color-semantic-inverse-label-strong-soft)' : 'var(--color-semantic-label-neutral)',
        transition: 'border-color var(--dur-fast) var(--ease-out)',
        ...style,
      }}
      {...rest}
    >
      <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: onDark ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-primary-normal)' }}>{label}</span>
      <span aria-hidden="true" style={{ width: 1, height: 12, background: 'currentColor', opacity: 0.28 }} />
      <span style={{ fontWeight: 600 }}>{children}</span>
      {isLink && <span aria-hidden="true" style={{ opacity: hover ? 1 : 0.55, transition: 'opacity var(--dur-fast) var(--ease-out)' }}>↗</span>}
    </Comp>
  );
}
