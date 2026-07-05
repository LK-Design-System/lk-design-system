import React from 'react';

const toLen = (v) => (typeof v === 'number' ? v + 'px' : v);

const SURFACES = {
  subtle:  'var(--surface-subtle)',
  band:    'var(--surface-sunken)',
  raised:  'var(--surface-raised)',
  inverse: 'var(--surface-inverse)',
};

/**
 * LK ROBOTICS — Section
 * A full-width page band with responsive vertical rhythm (`--gap-section`) and
 * an optional surface background — the unit you DIVIDE a page into. Inner
 * content is centered in the responsive container by default.
 *
 * <Section surface="subtle"><h2>…</h2></Section>
 */
export function Section({ children, surface, py, container = true, innerStyle, style, ...rest }) {
  const outer = {
    background: surface ? SURFACES[surface] : undefined,
    color: surface === 'inverse' ? 'var(--text-on-inverse)' : undefined,
    ...(py != null ? { '--section-py': toLen(py) } : {}),
    ...style,
  };
  const inner = container
    ? <div className="lk-container-fluid" style={innerStyle}>{children}</div>
    : children;
  return (
    <section className="lk-section" style={outer} {...rest}>
      {inner}
    </section>
  );
}
