import React from 'react';
import { Skeleton } from '../status/Skeleton.jsx';

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
        border: '1px solid var(--bw-border)',
        borderRadius: 'var(--radius-md)',
        background: saved ? 'var(--lk-accent-tint-2)' : 'var(--bw-white)',
        color: saved ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-label-alternative)',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      {/* Glyph path kept in sync with content/Bookmark.jsx; box styling is a signed-off LK override. */}
      <svg width="17" height="17" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
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
 */
export function Card({
  children,
  elevation = 'md',
  interactive = false,
  dark = false,
  padding,
  platform = 'desktop',
  skeleton = false,
  save = false,
  saved = false,
  onSave,
  thumbnail,
  topContent,
  leadingContent,
  trailingContent,
  title,
  description,
  caption,
  subCaption,
  bottomContent,
  footer,
  style,
  onMouseEnter,
  onMouseLeave,
  ...rest
}) {
  const shadows = {
    none: 'var(--component-card-shadow-none)',
    sm: 'var(--component-card-shadow-sm)',
    md: 'var(--component-card-shadow-md)',
    lg: 'var(--component-card-shadow-lg)',
  };
  const [hover, setHover] = React.useState(false);
  const compact = platform === 'mobile';
  const structured = skeleton || save || thumbnail != null || topContent != null || leadingContent != null || trailingContent != null || title != null || description != null || caption != null || subCaption != null || bottomContent != null || footer != null;
  const resolvedPadding = padding != null ? padding : compact ? 12 : 'var(--component-card-padding)';
  const structuredContent = skeleton ? (
    <StructuredSkeleton compact={compact} />
  ) : (
    <div style={{ display: 'grid', gap: compact ? 6 : 8 }}>
      {(topContent != null || save) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ minWidth: 0 }}>{topContent}</div>
          {save && <SaveButton saved={saved} onClick={onSave} />}
        </div>
      )}
      {thumbnail != null && <div>{thumbnail}</div>}
      {(leadingContent != null || trailingContent != null || title != null || description != null || caption != null || subCaption != null) && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          {leadingContent != null && <div style={{ flexShrink: 0 }}>{leadingContent}</div>}
          <div style={{ display: 'grid', gap: 4, minWidth: 0, flex: 1 }}>
            {caption != null && <div style={{ fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)', color: 'var(--color-semantic-label-alternative)', fontWeight: 'var(--fw-medium)' }}>{caption}</div>}
            {title != null && <div style={{ fontSize: compact ? 15 : 16, lineHeight: 1.5, color: dark ? 'var(--color-semantic-inverse-label)' : 'var(--color-semantic-label-strong)', fontWeight: 'var(--fw-semibold)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>}
            {description != null && <div style={{ fontSize: 13, lineHeight: 1.5, color: dark ? 'var(--inverse-label-neutral)' : 'var(--color-semantic-label-alternative)', wordBreak: 'keep-all' }}>{description}</div>}
            {subCaption != null && <div style={{ fontSize: 12, lineHeight: 1.35, color: 'var(--color-semantic-label-assistive)' }}>{subCaption}</div>}
          </div>
          {trailingContent != null && <div style={{ flexShrink: 0 }}>{trailingContent}</div>}
        </div>
      )}
      {children}
      {bottomContent != null && <div>{bottomContent}</div>}
      {footer != null && <div>{footer}</div>}
    </div>
  );
  return (
    <div
      onMouseEnter={(e) => { if (interactive) setHover(true); onMouseEnter && onMouseEnter(e); }}
      onMouseLeave={(e) => { if (interactive) setHover(false); onMouseLeave && onMouseLeave(e); }}
      style={{
        background: dark ? 'var(--component-card-bg-dark)' : 'var(--component-card-bg)',
        color: dark ? 'var(--component-card-fg-dark)' : 'var(--component-card-fg)',
        border: dark ? 'var(--component-card-border-dark)' : 'var(--component-card-border)',
        borderRadius: 'var(--component-card-radius)',
        boxShadow: interactive && hover ? 'var(--component-card-shadow-lg)' : shadows[elevation],
        transform: interactive && hover ? 'var(--component-card-hover-transform)' : 'none',
        transition: 'var(--component-card-transition)',
        padding: resolvedPadding,
        maxWidth: compact ? 320 : undefined,
        ...style,
      }}
      {...rest}
    >
      {structured ? structuredContent : children}
    </div>
  );
}
