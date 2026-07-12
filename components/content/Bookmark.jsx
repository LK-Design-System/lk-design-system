import React from 'react';
import { Icon } from '../icon/Icon.jsx';

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
        opacity: disabled ? 0.45 : 1, color: on ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-label-assistive)',
        transition: 'color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)', ...style,
      }}
      {...rest}
    >
      <Icon name={on ? 'bookmark-fill' : 'bookmark'} size={size} aria-hidden="true" />
    </button>
  );
}
