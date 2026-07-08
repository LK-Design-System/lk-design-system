import React from 'react';
import { anchoredPanelStyle } from './anchored-panel-style.js';

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
        <div style={{ ...anchoredPanelStyle(width), [align]: 0, ...style }}>
          {children}
        </div>
      )}
    </span>
  );
}
