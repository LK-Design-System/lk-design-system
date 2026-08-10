import React from 'react';
import { Skeleton } from '../status/Skeleton.jsx';
import { Icon } from '../icon/Icon.jsx';
import { componentVars, partClassName, partStyle } from '../internal/surface.js';

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

function StructuredSkeleton({ mobile, dense, className, style }) {
  return (
    <div
      data-slot="content"
      className={className}
      style={{ display: 'grid', gap: mobile ? 'var(--space-2-5)' : dense ? 'var(--space-2)' : 'var(--space-3)', ...style }}
    >
      <Skeleton variant="rect" height={mobile ? 132 : 156} radius={12} />
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
export const Card = React.forwardRef(function Card({
  as: Component = 'div',
  children,
  elevation,
  surface = 'default',
  interactive = false,
  dark = false,
  headingLevel = 3,
  padding,
  platform = 'desktop',
  density = 'comfortable',
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
  classNames,
  styles,
  vars,
  ...rest
}, forwardedRef) {
  useCardStyles();
  const shadows = {
    none: 'var(--component-card-shadow-none)',
    xs: 'var(--component-card-shadow-xs)',
    sm: 'var(--component-card-shadow-sm)',
    md: 'var(--component-card-shadow-md)',
    lg: 'var(--component-card-shadow-lg)',
  };
  const [hover, setHover] = React.useState(false);
  const mobile = platform === 'mobile';
  const dense = density === 'compact' && !mobile;
  /* 평상시는 `xs`, 들어올린 상태가 `md`다 — `NewsCard`·`ListingCard`가 이미
     쓰던 단계와 같다. 예전에는 rest가 `md`(0 16px 40px), hover가 `lg`라 카드
     하나가 Tooltip·Combobox 드롭다운·Fab 같은 **떠 있는** 요소와 같은 그림자를
     달고 가만히 놓여 있었다. 40px 번짐은 오버레이 등급이라 쉬는 표면에는
     과하고, 같은 시스템 안에서 형제 카드와 규칙이 어긋났다. */
  const resolvedElevation = elevation ?? (surface === 'subtle' ? 'none' : 'xs');
  const structured = skeleton || save || toggleIcon != null || thumbnail != null || topContent != null || leadingContent != null || trailingContent != null || title != null || description != null || caption != null || subCaption != null || metaCaption != null || bottomContent != null || footer != null;
  const defaultPadding = mobile ? 'var(--space-3)' : dense ? 'var(--space-4)' : 'var(--component-card-padding)';
  const resolvedPaddingValue = padding != null
    ? typeof padding === 'number' ? `${padding}px` : padding
    : `var(--lds-card-padding, ${defaultPadding})`;
  const contentGap = mobile ? 'var(--space-1-5)' : dense ? 'var(--space-1)' : 'var(--space-2)';
  const groupGap = dense ? 'var(--space-2)' : 'var(--space-3)';
  const actionGap = dense ? 'var(--space-1)' : 'var(--space-2)';
  const HeadingTag = headingLevel === false || headingLevel == null ? 'div' : `h${headingLevel}`;
  const structuredContent = skeleton ? (
    <StructuredSkeleton mobile={mobile} dense={dense} className={partClassName(classNames, 'content') || undefined} style={partStyle(styles, 'content')} />
  ) : (
    <div data-slot="content" className={partClassName(classNames, 'content') || undefined} style={{ display: 'grid', gap: `var(--lds-card-gap, ${contentGap})`, ...partStyle(styles, 'content') }}>
      {(topContent != null || save || toggleIcon != null) && (
        <div data-slot="header" className={partClassName(classNames, 'header') || undefined} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: groupGap, ...partStyle(styles, 'header') }}>
          <div style={{ minWidth: 0 }}>{topContent}</div>
          {(save || toggleIcon != null) && (
            <div data-slot="actions" className={partClassName(classNames, 'actions') || undefined} style={{ display: 'flex', alignItems: 'center', gap: actionGap, flexShrink: 0, ...partStyle(styles, 'actions') }}>
              {toggleIcon}
              {save && <SaveButton saved={saved} onClick={onSave} />}
            </div>
          )}
        </div>
      )}
      {thumbnail != null && <div data-slot="media" className={partClassName(classNames, 'media') || undefined} style={partStyle(styles, 'media')}>{thumbnail}</div>}
      {(leadingContent != null || trailingContent != null || title != null || description != null || caption != null || subCaption != null || metaCaption != null) && (
        <div data-slot="body" className={partClassName(classNames, 'body') || undefined} style={{ display: 'flex', alignItems: 'flex-start', gap: groupGap, ...partStyle(styles, 'body') }}>
          {leadingContent != null && <div style={{ flexShrink: 0 }}>{leadingContent}</div>}
          <div style={{ display: 'grid', gap: 4, minWidth: 0, flex: 1 }}>
            {caption != null && <div style={{ fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)', color: 'var(--color-semantic-label-alternative)', fontWeight: 'var(--fw-medium)' }}>{caption}</div>}
            {title != null && <HeadingTag data-slot="title" className={partClassName(classNames, 'title') || undefined} style={{ margin: 0, fontSize: mobile ? 'var(--body2-size)' : 'var(--body1-size)', lineHeight: 1.5, color: dark ? 'var(--component-card-fg-dark)' : 'var(--color-semantic-label-strong)', fontWeight: 'var(--fw-semibold)', overflow: titleWrap === 'truncate' ? 'hidden' : undefined, textOverflow: titleWrap === 'truncate' ? 'ellipsis' : undefined, whiteSpace: titleWrap === 'truncate' ? 'nowrap' : 'normal', overflowWrap: titleWrap === 'wrap' ? 'anywhere' : undefined, wordBreak: titleWrap === 'wrap' ? 'keep-all' : undefined, ...partStyle(styles, 'title') }}>{title}</HeadingTag>}
            {description != null && <div data-slot="description" className={partClassName(classNames, 'description') || undefined} style={{ fontSize: 'var(--label2-size)', lineHeight: 1.5, color: dark ? 'var(--color-semantic-inverse-label-neutral-soft)' : 'var(--color-semantic-label-alternative)', wordBreak: 'keep-all', ...partStyle(styles, 'description') }}>{description}</div>}
            {subCaption != null && <div style={{ fontSize: 'var(--caption1-size)', lineHeight: 1.35, color: 'var(--color-semantic-label-alternative)' }}>{subCaption}</div>}
            {metaCaption != null && <div style={{ fontSize: 'var(--caption2-size)', lineHeight: 1.3, color: 'var(--color-semantic-label-alternative)', fontVariantNumeric: 'tabular-nums' }}>{metaCaption}</div>}
          </div>
          {trailingContent != null && <div style={{ flexShrink: 0 }}>{trailingContent}</div>}
        </div>
      )}
      {children}
      {bottomContent != null && <div>{bottomContent}</div>}
      {footer != null && <div data-slot="footer" className={partClassName(classNames, 'footer') || undefined} style={partStyle(styles, 'footer')}>{footer}</div>}
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
      ref={forwardedRef}
      data-slot="root"
      data-interactive={interactive ? 'true' : undefined}
      data-surface={surface}
      data-dark={dark ? 'true' : undefined}
      data-loading={skeleton ? 'true' : undefined}
      data-density={density}
      className={partClassName(classNames, 'root', interactive ? 'lk-card--interactive' : null, className) || undefined}
      role={rest.role ?? (interactive ? 'button' : undefined)}
      tabIndex={rest.tabIndex ?? (interactive ? 0 : undefined)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={(e) => { if (interactive) setHover(true); onMouseEnter && onMouseEnter(e); }}
      onMouseLeave={(e) => { if (interactive) setHover(false); onMouseLeave && onMouseLeave(e); }}
      style={{
        ...componentVars(vars, '--lds-card-'),
        background: dark
          ? 'var(--component-card-bg-dark)'
          : surface === 'subtle'
            ? 'var(--component-card-bg-subtle)'
            : 'var(--component-card-bg)',
        color: dark ? 'var(--component-card-fg-dark)' : 'var(--component-card-fg)',
        border: dark ? 'var(--component-card-border-dark)' : 'var(--component-card-border)',
        borderRadius: 'var(--lds-card-radius, var(--component-card-radius))',
        boxShadow: interactive && hover ? 'var(--component-card-shadow-md)' : shadows[resolvedElevation],
        transform: interactive && hover ? 'var(--component-card-hover-transform)' : 'none',
        transition: 'var(--component-card-transition)',
        cursor: interactive ? 'pointer' : undefined,
        padding: resolvedPaddingValue,
        maxWidth: mobile ? 'var(--lds-card-max-width, 320px)' : 'var(--lds-card-max-width, none)',
        ...partStyle(styles, 'root'),
        ...style,
      }}
      {...rest}
    >
      {structured ? structuredContent : children}
    </Component>
  );
});
