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
        display: 'inline-flex', alignItems: 'center', gap: 8, height: 26, paddingInline: 11,
        borderRadius: 'var(--radius-pill)',
        background: onDark ? 'rgba(255,255,255,0.10)' : 'var(--fill-normal)',
        border: `1px solid ${onDark ? 'rgba(255,255,255,0.16)' : 'var(--line-normal)'}`,
        fontFamily: 'var(--font-sans)', fontSize: 12.5, whiteSpace: 'nowrap', textDecoration: 'none',
        cursor: isLink ? 'pointer' : 'default',
        color: onDark ? 'rgba(255,255,255,0.90)' : 'var(--label-neutral)',
        transition: 'border-color var(--dur-fast) var(--ease-out)',
        ...style,
      }}
      {...rest}
    >
      <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: onDark ? 'var(--lk-accent)' : 'var(--accent-text)' }}>{label}</span>
      <span aria-hidden="true" style={{ width: 1, height: 12, background: 'currentColor', opacity: 0.28 }} />
      <span style={{ fontWeight: 600 }}>{children}</span>
      {isLink && <span aria-hidden="true" style={{ opacity: hover ? 1 : 0.55, transition: 'opacity var(--dur-fast) var(--ease-out)' }}>↗</span>}
    </Comp>
  );
}
