import React from 'react';

const ICON_TONES = {
  signal: { fg: 'var(--color-semantic-primary-normal)', bg: 'var(--color-semantic-primary-surface-normal)' },     // teal tile (default)
  steel:  { fg: 'var(--color-semantic-accent-foreground-blue)', bg: 'var(--color-semantic-primary-surface-normal)' },
  amber:  { fg: 'var(--color-semantic-accent-foreground-orange)', bg: 'color-mix(in srgb, var(--color-semantic-accent-foreground-orange) 14%, transparent)' },
  /* steel(#336CA1)은 signal(#3878B3)과 같은 파랑 계열이라 셋 이상을 나란히
     구분해야 하는 그리드에서 사실상 한 색으로 읽힌다. moss는 그 자리를 위한
     세 번째 색상축이다 — amber와 같은 파생 규칙(전경 14% 틴트 배경)을 쓴다. */
  moss:   { fg: 'var(--color-semantic-accent-foreground-green)', bg: 'color-mix(in srgb, var(--color-semantic-accent-foreground-green) 14%, transparent)' },
  navy:   { fg: 'var(--color-semantic-brand-on-surface)', bg: 'var(--color-semantic-brand-surface)' },
};

/**
 * LK ROBOTICS — FeatureCard
 * Tinted icon tile + title + supporting copy. The recurring capability cell
 * (핵심 기능 / 주요 기능). `boxed` wraps it in a white Card surface.
 *
 * Accessibility — mirrors the Core `Card` contract locally: `title` renders as
 * a real heading whose level is caller-controlled (`headingLevel`, WCAG 1.3.1),
 * and a card given an `onClick` becomes a real control (`role="button"`,
 * `tabIndex=0`, Enter/Space activation) so the whole-card target is operable by
 * keyboard (WCAG 2.1.1). An activatable card must not contain its own
 * focusable elements.
 */
export function FeatureCard({
  icon,
  title,
  children,
  tone = 'signal',
  boxed = false,
  density = 'comfortable',
  headingLevel = 4,
  style,
  onClick,
  onKeyDown,
  ...rest
}) {
  const t = ICON_TONES[tone] || ICON_TONES.signal;
  const activatable = typeof onClick === 'function';
  const compact = density === 'compact';
  const HeadingTag = headingLevel === false || headingLevel == null ? 'div' : `h${headingLevel}`;
  const handleKeyDown = (e) => {
    if (activatable && (e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) {
      e.preventDefault();
      onClick(e);
    }
    onKeyDown && onKeyDown(e);
  };
  return (
    <div
      data-density={density}
      role={rest.role ?? (activatable ? 'button' : undefined)}
      tabIndex={rest.tabIndex ?? (activatable ? 0 : undefined)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      style={{
        display: 'flex', flexDirection: 'column', gap: compact ? 'var(--space-3)' : 'var(--space-4)',
        background: boxed ? 'var(--component-card-bg)' : 'transparent',
        border: boxed ? 'var(--component-card-border)' : 'none',
        borderRadius: boxed ? 'var(--component-card-radius)' : 0,
        /* Card's default rest elevation (elevation="md") — same value as the
           previous var(--shadow-md), now tracked via the card token. */
        boxShadow: boxed ? 'var(--component-card-shadow-md)' : 'none',
        padding: boxed ? compact ? 'var(--space-4)' : 'var(--component-card-padding)' : 0,
        cursor: activatable ? 'pointer' : undefined,
        ...style,
      }}
      {...rest}
    >
      {icon && (
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: compact ? 'var(--space-10)' : 52, height: compact ? 'var(--space-10)' : 52, borderRadius: 'var(--radius-14)', color: t.fg, background: t.bg }}>
          {icon}
        </span>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 'var(--space-1)' : 'var(--space-2)' }}>
        <HeadingTag style={{ fontSize: 'var(--headline1-size)', fontWeight: 'var(--fw-extra)', letterSpacing: 0, color: 'var(--color-semantic-label-strong)', margin: 0, wordBreak: 'keep-all' }}>{title}</HeadingTag>
        <p style={{ fontSize: 'var(--body2-size)', lineHeight: 1.7, color: 'var(--color-semantic-label-alternative)', margin: 0, wordBreak: 'keep-all' }}>{children}</p>
      </div>
    </div>
  );
}
