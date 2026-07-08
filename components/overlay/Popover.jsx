import React from 'react';
import { anchoredPanelStyle } from './anchored-panel-style.js';

/**
 * LK ROBOTICS — Popover
 * An anchored floating panel with arbitrary content (info, mini-forms, pickers).
 * Like DropdownMenu but you own the body. Closes on outside-click.
 */
export function Popover({ trigger, children, align = 'left', width = 260, style, ...rest }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block', ...style }} {...rest}>
      <span onClick={() => setOpen((o) => !o)} style={{ display: 'inline-flex' }}>{trigger}</span>
      {open && (
        <div role="dialog" style={{ ...anchoredPanelStyle(width), [align]: 0 }}>
          {children}
        </div>
      )}
    </div>
  );
}
