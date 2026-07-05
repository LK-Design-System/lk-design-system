import React from 'react';

/**
 * LK ROBOTICS — ChoiceCard
 * A selectable framed option: a bordered tile that
 * highlights with an azure ring + tint when selected. Works as a radio
 * (single-choice) or checkbox (`multiple`) option; click or Enter/Space
 * toggles. Compose free-form content as children, or pass `title` /
 * `description` / `icon` for the standard layout.
 */
export function ChoiceCard({
  children,
  selected = false,
  disabled = false,
  multiple = false,
  onSelect,
  title,
  description,
  icon,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const border = selected ? 'var(--color-primary)' : (hover && !disabled ? 'var(--border-strong)' : 'var(--border-subtle)');
  const toggle = () => { if (!disabled && onSelect) onSelect(!selected); };

  return (
    <div
      role={multiple ? 'checkbox' : 'radio'}
      aria-checked={selected}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      onClick={toggle}
      onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !disabled) { e.preventDefault(); toggle(); } }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: 16,
        borderRadius: 'var(--radius-xl)',
        background: selected ? 'var(--lk-accent-tint)' : 'var(--surface-raised)',
        boxShadow: `inset 0 0 0 ${selected ? 1.5 : 1}px ${border}`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'box-shadow var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)',
        outline: 'none',
        ...style,
      }}
      {...rest}
    >
      {icon != null && <span style={{ flexShrink: 0, color: selected ? 'var(--color-accent)' : 'var(--label-neutral)', display: 'inline-flex' }}>{icon}</span>}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title != null && <div style={{ fontSize: 15, fontWeight: 'var(--fw-bold)', letterSpacing: '-0.2px', color: 'var(--label-strong)', wordBreak: 'keep-all' }}>{title}</div>}
        {description != null && <div style={{ marginTop: 3, fontSize: 13, lineHeight: 1.55, color: 'var(--label-alternative)', wordBreak: 'keep-all' }}>{description}</div>}
        {children}
      </div>
      <span
        aria-hidden="true"
        style={{
          flexShrink: 0,
          width: 20,
          height: 20,
          borderRadius: multiple ? 'var(--radius-sm)' : '50%',
          background: selected ? 'var(--color-primary)' : 'transparent',
          boxShadow: selected ? 'none' : `inset 0 0 0 1.5px var(--line-strong)`,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          transition: 'background var(--dur-fast) var(--ease-out)',
        }}
      >
        {selected && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        )}
      </span>
    </div>
  );
}
