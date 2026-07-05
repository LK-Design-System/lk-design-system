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
  return (
    <div
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onKeyDown={clickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e); } } : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '14px 4px',
        cursor: clickable ? 'pointer' : 'default',
        background: clickable && hover ? 'var(--fill-alt)' : 'transparent',
        borderRadius: 'var(--radius-md)',
        borderBottom: divider ? '1px solid var(--bw-border)' : 'none',
        transition: 'background var(--dur-fast) var(--ease-out)', ...style,
      }}
      {...rest}
    >
      {leading != null && <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', color: 'var(--lk-accent-ink)' }}>{leading}</div>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 15.5, fontWeight: 'var(--fw-bold)', letterSpacing: '-0.2px', color: 'var(--label-normal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
        {description != null && <div style={{ marginTop: 2, fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--label-alternative)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{description}</div>}
      </div>
      {trailing != null && <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--label-alternative)' }}>{trailing}</div>}
    </div>
  );
}
