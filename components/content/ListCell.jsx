import React from 'react';

/**
 * LK ROBOTICS — ListCell
 * The workhorse list row: optional leading (icon/avatar), a title + optional
 * description, and optional trailing content (value / chevron / switch). Set
 * `onClick` to make it an interactive row (hover wash, keyboard-operable);
 * `divider` adds a hairline underline.
 */
export function ListCell({ leading, title, description, trailing, onClick, divider = false, style, ...rest }) {
  const clickable = !!onClick;
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const dividerLeft = leading != null ? 62 : 14;
  const dividerRight = trailing != null ? 62 : 14;

  return (
    <div
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      onKeyDown={clickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e); } } : undefined}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minHeight: 62,
        padding: '12px 14px',
        boxSizing: 'border-box',
        cursor: clickable ? 'pointer' : 'default',
        background: clickable && hover ? 'var(--lk-accent-tint)' : 'transparent',
        borderRadius: 'var(--radius-lg)',
        outline: focus ? '2px solid var(--focus-ring)' : 'none',
        outlineOffset: -2,
        transition: 'background var(--dur-fast) var(--ease-out), outline-color var(--dur-fast) var(--ease-out)',
        ...style,
      }}
      {...rest}
    >
      {leading != null && (
        <div
          style={{
            width: 36,
            height: 36,
            flexShrink: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--lk-accent-ink)',
            background: 'var(--lk-accent-tint)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          {leading}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 'var(--fw-bold)', lineHeight: 1.35, letterSpacing: 0, color: 'var(--label-normal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
        {description != null && <div style={{ marginTop: 3, fontFamily: 'var(--font-sans)', fontSize: 12.5, lineHeight: 1.45, color: 'var(--label-alternative)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{description}</div>}
      </div>
      {trailing != null && <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--label-alternative)' }}>{trailing}</div>}
      {divider && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: dividerLeft,
            right: dividerRight,
            bottom: 0,
            height: 1,
            background: 'var(--border-subtle)',
            opacity: 0.72,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}
