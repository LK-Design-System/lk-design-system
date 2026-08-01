import React from 'react';
import { Icon } from '@lk-design-system/lds-core/components/icon/Icon';

/**
 * LK ROBOTICS — Bookmark
 * A save/bookmark toggle. Outline (assistive-grey) at rest; fills with the
 * signal ink when saved, with a small press-in. Controlled (`active`) or
 * uncontrolled (`defaultActive`).
 *
 * Accessibility — an APG toggle button: the accessible name describes the
 * *target* and never changes ("야간 순찰 경로 북마크"), while `aria-pressed`
 * alone carries the saved state. `label` supplies the target so a list of
 * bookmarks does not read as the same anonymous control repeated N times.
 * The press-in is React state, not a direct DOM style mutation, so Enter/Space
 * get the same feedback as the pointer.
 */
export function Bookmark({
  active,
  defaultActive,
  onChange,
  size = 24,
  disabled = false,
  label,
  style,
  'aria-label': ariaLabel,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onKeyDown,
  onKeyUp,
  onBlur,
  ...rest
}) {
  const isControlled = active !== undefined;
  const [internal, setInternal] = React.useState(!!defaultActive);
  const [pressed, setPressed] = React.useState(false);
  const on = isControlled ? active : internal;
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  const press = (next) => { if (!disabled) setPressed(next); };
  const name = ariaLabel || (label ? `${label} 북마크` : '북마크');
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={name}
      data-pressed={pressed ? 'true' : 'false'}
      disabled={disabled}
      onClick={toggle}
      onMouseDown={(e) => { press(true); onMouseDown && onMouseDown(e); }}
      onMouseUp={(e) => { press(false); onMouseUp && onMouseUp(e); }}
      onMouseLeave={(e) => { press(false); onMouseLeave && onMouseLeave(e); }}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') press(true); onKeyDown && onKeyDown(e); }}
      onKeyUp={(e) => { if (e.key === 'Enter' || e.key === ' ') press(false); onKeyUp && onKeyUp(e); }}
      onBlur={(e) => { press(false); onBlur && onBlur(e); }}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 4,
        border: 'none', background: 'transparent', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1, color: on ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-label-assistive)',
        transform: pressed ? 'scale(0.86)' : 'none',
        transition: 'color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)', ...style,
      }}
      {...rest}
    >
      <Icon name={on ? 'bookmark-fill' : 'bookmark'} size={size} aria-hidden="true" />
    </button>
  );
}
