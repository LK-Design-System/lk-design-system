import React from 'react';
import { statusToneStyle } from '../status/status-presentation.js';

/**
 * LK ROBOTICS — Notification
 * A compact notification-list row: icon, title, description, timestamp, and a
 * single primary unread cue. Set `onClick` to render a native button row.
 * `tone` colours the 36px rounded-square leading icon tile (the signed-off
 * LK icon-tile pattern) with the shared status grammar; without it the tile
 * stays neutral.
 */
export function Notification({
  icon,
  title,
  description,
  time,
  dateTime,
  tone,
  unread = false,
  onClick,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
  style,
  ...rest
}) {
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const Root = onClick ? 'button' : 'div';
  const background = unread
    ? hovered ? 'var(--color-semantic-primary-surface-strong)' : 'var(--component-notification-unread-surface)'
    : hovered
      ? 'var(--color-semantic-fill-alternative)'
      : 'transparent';

  return (
    <Root
      {...rest}
      {...(onClick ? { type: 'button' } : {})}
      onClick={onClick}
      onFocus={(event) => { setFocused(true); onFocus && onFocus(event); }}
      onBlur={(event) => { setFocused(false); onBlur && onBlur(event); }}
      onMouseEnter={(event) => { if (onClick) setHovered(true); onMouseEnter && onMouseEnter(event); }}
      onMouseLeave={(event) => { setHovered(false); onMouseLeave && onMouseLeave(event); }}
      style={{
        display: 'grid',
        gridTemplateColumns: icon != null ? '36px minmax(0, 1fr)' : 'minmax(0, 1fr)',
        alignItems: 'start',
        columnGap: 'var(--space-3)',
        width: '100%',
        minWidth: 0,
        padding: 'var(--space-3) var(--space-4)',
        boxSizing: 'border-box',
        border: 'none',
        borderRadius: 'inherit',
        appearance: 'none',
        cursor: onClick ? 'pointer' : 'default',
        textAlign: 'start',
        background,
        boxShadow: focused ? 'inset 0 0 0 2px var(--color-semantic-focus-indicator)' : 'none',
        color: 'inherit',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
    >
      {icon != null && (
        <span
          aria-hidden="true"
          style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-md)',
            background: tone ? statusToneStyle(tone).surface : 'var(--color-semantic-fill-normal)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: tone ? statusToneStyle(tone).foreground : 'var(--color-semantic-label-normal)',
          }}
        >
          {icon}
        </span>
      )}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-3)', minWidth: 0 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0 }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--color-semantic-label-normal)', fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--label1-spacing)' }}>{title}</span>
            {unread && <span role="img" aria-label="읽지 않음" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-semantic-primary-normal)', flexShrink: 0 }} />}
          </span>
          {time != null && <time dateTime={dateTime} style={{ flexShrink: 0, color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', letterSpacing: 'var(--caption1-spacing)' }}>{time}</time>}
        </div>
        {description != null && <div style={{ marginTop: 'var(--space-1)', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)', letterSpacing: 'var(--label2-spacing)', wordBreak: 'keep-all' }}>{description}</div>}
      </div>
    </Root>
  );
}
