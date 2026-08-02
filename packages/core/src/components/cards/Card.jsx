import React from 'react';
import { Skeleton } from '../status/Skeleton.jsx';
import { Icon } from '../icon/Icon.jsx';

function SaveButton({ saved = false, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? 'remove saved item' : 'save item'}
      onClick={onClick}
      style={{
        width: 32,
        height: 32,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--color-semantic-line-solid-normal)',
        borderRadius: 'var(--radius-md)',
        background: saved ? 'var(--color-semantic-primary-surface-strong)' : 'var(--color-semantic-background-elevated-normal)',
        color: saved ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-label-alternative)',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      <Icon name={saved ? 'bookmark-fill' : 'bookmark'} size={17} aria-hidden="true" />
    </button>
  );
}

function useCardStyles() {
  React.useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById('lk-card-css')) return;
    const el = document.createElement('style');
    el.id = 'lk-card-css';
    el.textContent =
      '.lk-card--interactive:focus-visible{outline:2px solid var(--color-semantic-focus-indicator);outline-offset:2px;}';
    document.head.appendChild(el);
  }, []);
}

function StructuredSkeleton({ compact }) {
  return (
    <div style={{ display: 'grid', gap: compact ? 10 : 12 }}>
      <Skeleton variant="rect" height={compact ? 132 : 156} radius={12} />
      <Skeleton variant="text" length="50%" />
      <Skeleton variant="text" length="82%" />
      <Skeleton variant="text" length="64%" />
    </div>
  );
}

/**
 * LK ROBOTICS — Card
 * The neutral surface everything is built on: white, hairline border, soft
 * navy-tinted shadow, 16px radius. `interactive` lifts gently on hover;
 * `dark` flips to a navy surface for dark sections.
 *
 * Accessibility — an `interactive` card is a real actionable control
 * (Material "actionable card" / Polaris convention): `role="button"`,
 * `tabIndex=0`, Enter/Space activation and a `:focus-visible` ring, so the
 * whole-card target is operable by keyboard (WCAG 2.1.1). The structured
 * `title` renders as a real heading (`headingLevel`, WCAG 1.3.1).
 */
export function Card({
  as: Component = 'div',
  children,
  elevation,
  surface = 'default',
  interactive = false,
  dark = false,
  headingLevel = 3,
  padding,
  platform = 'desktop',
  skeleton = false,
  save = false,
  saved = false,
  onSave,
  toggleIcon,
  thumbnail,
  topContent,
  leadingContent,
  trailingContent,
  title,
  titleWrap = 'truncate',
  description,
  caption,
  subCaption,
  metaCaption,
  bottomContent,
  footer,
  style,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onKeyDown,
  className,
  ...rest
}) {
  useCardStyles();
  const shadows = {
    none: 'var(--component-card-shadow-none)',
    sm: 'var(--component-card-shadow-sm)',
    md: 'var(--component-card-shadow-md)',
    lg: 'var(--component-card-shadow-lg)',
  };
  const [hover, setHover] = React.useState(false);
  const compact = platform === 'mobile';
  const resolvedElevation = elevation ?? (surface === 'subtle' ? 'none' : 'md');
  const structured = skeleton || save || toggleIcon != null || thumbnail != null || topContent != null || leadingContent != null || trailingContent != null || title != null || description != null || caption != null || subCaption != null || metaCaption != null || bottomContent != null || footer != null;
  const resolvedPadding = padding != null ? padding : compact ? 12 : 'var(--component-card-padding)';
  const HeadingTag = headingLevel === false || headingLevel == null ? 'div' : `h${headingLevel}`;
  const structuredContent = skeleton ? (
    <StructuredSkeleton compact={compact} />
  ) : (
    <div style={{ display: 'grid', gap: compact ? 6 : 8 }}>
      {(topContent != null || save || toggleIcon != null) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ minWidth: 0 }}>{topContent}</div>
          {(save || toggleIcon != null) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {toggleIcon}
              {save && <SaveButton saved={saved} onClick={onSave} />}
            </div>
          )}
        </div>
      )}
      {thumbnail != null && <div>{thumbnail}</div>}
      {(leadingContent != null || trailingContent != null || title != null || description != null || caption != null || subCaption != null || metaCaption != null) && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          {leadingContent != null && <div style={{ flexShrink: 0 }}>{leadingContent}</div>}
          <div style={{ display: 'grid', gap: 4, minWidth: 0, flex: 1 }}>
            {caption != null && <div style={{ fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)', color: 'var(--color-semantic-label-alternative)', fontWeight: 'var(--fw-medium)' }}>{caption}</div>}
            {title != null && <HeadingTag style={{ margin: 0, fontSize: compact ? 'var(--body2-size)' : 'var(--body1-size)', lineHeight: 1.5, color: dark ? 'var(--component-card-fg-dark)' : 'var(--color-semantic-label-strong)', fontWeight: 'var(--fw-semibold)', overflow: titleWrap === 'truncate' ? 'hidden' : undefined, textOverflow: titleWrap === 'truncate' ? 'ellipsis' : undefined, whiteSpace: titleWrap === 'truncate' ? 'nowrap' : 'normal', overflowWrap: titleWrap === 'wrap' ? 'anywhere' : undefined, wordBreak: titleWrap === 'wrap' ? 'keep-all' : undefined }}>{title}</HeadingTag>}
            {description != null && <div style={{ fontSize: 'var(--label2-size)', lineHeight: 1.5, color: dark ? 'var(--color-semantic-inverse-label-neutral-soft)' : 'var(--color-semantic-label-alternative)', wordBreak: 'keep-all' }}>{description}</div>}
            {subCaption != null && <div style={{ fontSize: 'var(--caption1-size)', lineHeight: 1.35, color: 'var(--color-semantic-label-alternative)' }}>{subCaption}</div>}
            {metaCaption != null && <div style={{ fontSize: 'var(--caption2-size)', lineHeight: 1.3, color: 'var(--color-semantic-label-alternative)', fontVariantNumeric: 'tabular-nums' }}>{metaCaption}</div>}
          </div>
          {trailingContent != null && <div style={{ flexShrink: 0 }}>{trailingContent}</div>}
        </div>
      )}
      {children}
      {bottomContent != null && <div>{bottomContent}</div>}
      {footer != null && <div>{footer}</div>}
    </div>
  );
  const handleKeyDown = (e) => {
    if (interactive && onClick && (e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) {
      e.preventDefault();
      onClick(e);
    }
    onKeyDown && onKeyDown(e);
  };
  return (
    <Component
      className={[interactive ? 'lk-card--interactive' : null, className].filter(Boolean).join(' ') || undefined}
      role={rest.role ?? (interactive ? 'button' : undefined)}
      tabIndex={rest.tabIndex ?? (interactive ? 0 : undefined)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={(e) => { if (interactive) setHover(true); onMouseEnter && onMouseEnter(e); }}
      onMouseLeave={(e) => { if (interactive) setHover(false); onMouseLeave && onMouseLeave(e); }}
      style={{
        background: dark
          ? 'var(--component-card-bg-dark)'
          : surface === 'subtle'
            ? 'var(--component-card-bg-subtle)'
            : 'var(--component-card-bg)',
        color: dark ? 'var(--component-card-fg-dark)' : 'var(--component-card-fg)',
        border: dark ? 'var(--component-card-border-dark)' : 'var(--component-card-border)',
        borderRadius: 'var(--component-card-radius)',
        boxShadow: interactive && hover ? 'var(--component-card-shadow-lg)' : shadows[resolvedElevation],
        transform: interactive && hover ? 'var(--component-card-hover-transform)' : 'none',
        transition: 'var(--component-card-transition)',
        cursor: interactive ? 'pointer' : undefined,
        padding: resolvedPadding,
        maxWidth: compact ? 320 : undefined,
        ...style,
      }}
      {...rest}
    >
      {structured ? structuredContent : children}
    </Component>
  );
}
