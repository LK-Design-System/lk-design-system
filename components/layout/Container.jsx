import React from 'react';

/**
 * LK ROBOTICS — Container
 * The centered page column. `size`:
 *   default — responsive: caps at 1100 (through lg), widens to 1440 at xl
 *   read    — narrow reading band (1100, text pages)
 *   wide    — full-bleed rails (1500)
 * Page side margin follows `--grid-margin` (16 → 32px across breakpoints).
 */
export function Container({ children, size = 'default', style, ...rest }) {
  if (size === 'default') {
    return (
      <div className="lk-container-fluid" style={style} {...rest}>
        {children}
      </div>
    );
  }
  const max = size === 'read' ? 'var(--container-read)' : 'var(--container-wide)';
  return (
    <div style={{ maxWidth: max, marginInline: 'auto', paddingInline: 'var(--grid-margin)', width: '100%', boxSizing: 'border-box', ...style }} {...rest}>
      {children}
    </div>
  );
}
