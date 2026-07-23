import React from 'react';
import { Icon } from '../icon/Icon.jsx';

/**
 * LK ROBOTICS — Breadcrumb
 * A path trail with chevron separators. Ancestor items are muted links; the
 * last item is the bold current page. Pass `items` as `{ label, href }`.
 * Follows the APG breadcrumb pattern: nav > ol > li, chevron separators are
 * decorative (`aria-hidden`), and the nav defaults to aria-label '현재 위치'
 * (consumer-provided aria-label wins).
 */
export function Breadcrumb({ items = [], style, ...rest }) {
  return (
    <nav aria-label="현재 위치" style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--label2-size)', ...style }} {...rest}>
      <ol style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {last || !it.href ? (
                <span aria-current={last ? 'page' : undefined} style={{ color: last ? 'var(--color-semantic-label-normal)' : 'var(--color-semantic-label-neutral)', fontWeight: last ? 'var(--fw-bold)' : 'var(--fw-medium)', letterSpacing: 0 }}>{it.label}</span>
              ) : (
                <a href={it.href} style={{ color: 'var(--color-semantic-label-neutral)', fontWeight: 'var(--fw-medium)', letterSpacing: 0, textDecoration: 'none' }}>{it.label}</a>
              )}
              {!last && (
                <Icon name="chevron-right-small" size={14} color="var(--color-semantic-label-assistive)" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
