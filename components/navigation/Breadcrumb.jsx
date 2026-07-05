import React from 'react';

/**
 * LK ROBOTICS — Breadcrumb
 * A path trail with chevron separators. Ancestor items are muted links; the
 * last item is the bold current page. Pass `items` as `{ label, href }`.
 */
export function Breadcrumb({ items = [], style, ...rest }) {
  return (
    <nav aria-label="breadcrumb" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, fontFamily: 'var(--font-sans)', fontSize: 13.5, ...style }} {...rest}>
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            {last || !it.href ? (
              <span aria-current={last ? 'page' : undefined} style={{ color: last ? 'var(--label-normal)' : 'var(--label-alternative)', fontWeight: last ? 'var(--fw-bold)' : 'var(--fw-medium)', letterSpacing: '-0.1px' }}>{it.label}</span>
            ) : (
              <a href={it.href} style={{ color: 'var(--label-alternative)', fontWeight: 'var(--fw-medium)', letterSpacing: '-0.1px', textDecoration: 'none' }}>{it.label}</a>
            )}
            {!last && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--label-assistive)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
