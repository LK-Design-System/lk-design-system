import React from 'react';

/**
 * LK ROBOTICS — HoverCard
 * A popover that opens on hover (with a small delay) and closes on leave. Good
 * for profile/spec previews. Pass a `trigger` and arbitrary body children.
 */
export function HoverCard({ trigger, children, align = 'left', width = 280, style, ...rest }) {
  const [open, setOpen] = React.useState(false);
  const t = React.useRef(null);
  const show = () => { clearTimeout(t.current); t.current = setTimeout(() => setOpen(true), 120); };
  const hide = () => { clearTimeout(t.current); t.current = setTimeout(() => setOpen(false), 120); };
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }} onMouseEnter={show} onMouseLeave={hide} {...rest}>
      {trigger}
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', [align]: 0, zIndex: 40, width, background: 'var(--bw-white)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 16, fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: 1.6, color: 'var(--label-neutral)', ...style }}>
          {children}
        </div>
      )}
    </span>
  );
}
