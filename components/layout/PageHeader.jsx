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
  avatar,
  title,
  description,
  status,
  meta,
  actions,
  align = 'start',
  size = 'md',
  headingLevel = 1,
  style,
  ...rest
}) {
  const compact = size === 'sm';
  const titleSize = compact ? 'var(--heading2-size)' : 'var(--heading1-size)';
  const titleLine = compact ? 'var(--heading2-line)' : 'var(--heading1-line)';
  const titleSpacing = compact ? 'var(--heading2-spacing)' : 'var(--heading1-spacing)';
  const resolvedHeadingLevel = Math.min(6, Math.max(1, headingLevel));
  const Heading = `h${resolvedHeadingLevel}`;
  const hasContext = breadcrumb != null || eyebrow != null;
  return (
    <header
      style={{
        display: 'grid',
        gap: compact ? 4 : 6,
        width: '100%',
        minWidth: 0,
        color: 'var(--color-semantic-label-normal)',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      {/* Context row (breadcrumb/eyebrow) spans the full width above the title
          row, so actions anchor to the title instead of straddling it. */}
      {hasContext && (
        <div data-page-header-context style={{ display: 'grid', gap: compact ? 4 : 6, minWidth: 0 }}>
          {breadcrumb != null && <div style={{ minWidth: 0 }}>{breadcrumb}</div>}
          {eyebrow != null && (
            <div style={{ fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--label2-spacing)', color: 'var(--color-semantic-label-neutral)' }}>
              {eyebrow}
            </div>
          )}
        </div>
      )}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: compact ? 'var(--space-2)' : 'var(--space-3)',
          rowGap: compact ? 'var(--space-3)' : 'var(--space-4)',
          alignItems: align === 'center' ? 'center' : 'start',
          minWidth: 0,
        }}
      >
        {/* Identity image (avatar/thumbnail) leading the title, the way an
            account or record masthead reads: Polaris `Page` carries a thumbnail
            and Lightning's record-home header an icon. It is a slot, so the
            layout does not depend on the avatar implementation. */}
        {avatar != null && (
          <div data-page-header-avatar style={{ flexShrink: 0, display: 'flex' }}>
            {avatar}
          </div>
        )}
        {/* The flex-basis is the point where actions stop sharing the title row
            and drop below the content: the row wraps once basis + actions no
            longer fit. 18rem keeps actions title-aligned on ordinary content
            panes (~640px) and defers the drop to genuinely narrow layouts —
            32rem pushed page-level actions below the description on plain
            desktop splits, which read as detached from the header. */}
        <div data-page-header-content style={{ display: 'grid', gap: compact ? 4 : 6, flex: '1 1 18rem', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', minWidth: 0 }}>
            <Heading style={{ margin: 0, minWidth: 0, color: 'var(--color-semantic-label-strong)', fontSize: titleSize, lineHeight: titleLine, fontWeight: 'var(--fw-extra)', letterSpacing: titleSpacing, wordBreak: 'keep-all', overflowWrap: 'anywhere' }}>
              {title}
            </Heading>
            {status != null && <div style={{ flexShrink: 0 }}>{status}</div>}
          </div>
          {description != null && (
            <p style={{ margin: 0, maxWidth: 680, color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-reading-line)', letterSpacing: 'var(--label1-spacing)', wordBreak: 'keep-all', overflowWrap: 'anywhere' }}>
              {description}
            </p>
          )}
          {meta != null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)', letterSpacing: 'var(--label2-spacing)' }}>
              {meta}
            </div>
          )}
        </div>
        {actions != null && (
          <div data-page-header-actions style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-2)', flex: '0 1 auto', flexWrap: 'wrap', minWidth: 0, maxWidth: '100%', marginInlineStart: 'auto' }}>
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
