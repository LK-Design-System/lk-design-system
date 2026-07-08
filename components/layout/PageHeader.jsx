import React from 'react';

/**
 * LK ROBOTICS — PageHeader
 * A page-level header for app screens: optional breadcrumb/eyebrow, title,
 * description, status/meta, and trailing actions. It keeps page titles and
 * primary actions consistent without turning every screen into a custom hero.
 */
export function PageHeader({
  eyebrow,
  breadcrumb,
  title,
  description,
  status,
  meta,
  actions,
  align = 'start',
  size = 'md',
  style,
  ...rest
}) {
  const compact = size === 'sm';
  const titleSize = compact ? 'var(--heading2-size)' : 'var(--heading1-size)';
  const titleLine = compact ? 'var(--heading2-line)' : 'var(--heading1-line)';
  return (
    <header
      style={{
        display: 'grid',
        gridTemplateColumns: actions != null ? 'minmax(0, 1fr) auto' : 'minmax(0, 1fr)',
        gap: compact ? 'var(--space-2)' : 'var(--space-3)',
        alignItems: align === 'center' ? 'center' : 'start',
        width: '100%',
        minWidth: 0,
        color: 'var(--color-semantic-label-normal)',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'grid', gap: compact ? 4 : 6, minWidth: 0 }}>
        {breadcrumb != null && <div style={{ minWidth: 0 }}>{breadcrumb}</div>}
        {eyebrow != null && (
          <div style={{ fontSize: 13, lineHeight: 1.45, fontWeight: 'var(--fw-bold)', letterSpacing: 0, color: 'var(--color-semantic-label-alternative)' }}>
            {eyebrow}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', minWidth: 0 }}>
          <h1 style={{ margin: 0, minWidth: 0, color: 'var(--color-semantic-label-strong)', fontSize: titleSize, lineHeight: titleLine, fontWeight: 'var(--fw-extra)', letterSpacing: 0, wordBreak: 'keep-all' }}>
            {title}
          </h1>
          {status != null && <div style={{ flexShrink: 0 }}>{status}</div>}
        </div>
        {description != null && (
          <p style={{ margin: 0, maxWidth: 680, color: 'var(--color-semantic-label-neutral)', fontSize: 14, lineHeight: 1.55, wordBreak: 'keep-all' }}>
            {description}
          </p>
        )}
        {meta != null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', color: 'var(--color-semantic-label-alternative)', fontSize: 13, lineHeight: 1.45 }}>
            {meta}
          </div>
        )}
      </div>
      {actions != null && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-2)', flexWrap: 'wrap', minWidth: 0 }}>
          {actions}
        </div>
      )}
    </header>
  );
}
