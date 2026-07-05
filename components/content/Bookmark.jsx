import React from 'react';

/**
 * LK ROBOTICS — Bookmark
 * A save/bookmark toggle. Outline (assistive-grey) at rest; fills with the
 * signal ink when saved, with a small press-in. Controlled (`active`) or
 * uncontrolled (`defaultActive`).
 */
export function Bookmark({ active, defaultActive, onChange, size = 24, disabled = false, style, ...rest }) {
  const isControlled = active !== undefined;
  const [internal, setInternal] = React.useState(!!defaultActive);
  const on = isControlled ? active : internal;
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label="bookmark"
      disabled={disabled}
      onClick={toggle}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.86)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'none'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 4,
        border: 'none', background: 'transparent', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, color: on ? 'var(--lk-accent-ink)' : 'var(--label-assistive)',
        transition: 'color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)', ...style,
      }}
      {...rest}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
