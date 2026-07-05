import React from 'react';

/**
 * LK ROBOTICS — Pagination
 * Numbered page control with prev/next chevrons and ellipsis collapsing. The
 * current page fills with the cyan wash + signal-ink ring. Ends disable at the
 * bounds. Controlled — pass `page`, `count`, `onChange`.
 */
export function Pagination({ page = 1, count = 1, onChange, siblingCount = 1, style, ...rest }) {
  const go = (p) => { if (p >= 1 && p <= count && p !== page && onChange) onChange(p); };
  const range = (a, b) => { const r = []; for (let i = a; i <= b; i++) r.push(i); return r; };
  const left = Math.max(2, page - siblingCount);
  const right = Math.min(count - 1, page + siblingCount);
  const pages = [1];
  if (left > 2) pages.push('start-ellipsis');
  for (const p of range(left, right)) pages.push(p);
  if (right < count - 1) pages.push('end-ellipsis');
  if (count > 1) pages.push(count);

  const Arrow = ({ dir, disabled }) => (
    <button
      type="button"
      aria-label={dir === 'prev' ? 'previous page' : 'next page'}
      disabled={disabled}
      onClick={() => go(dir === 'prev' ? page - 1 : page + 1)}
      style={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-md)', background: 'var(--bw-white)', cursor: disabled ? 'not-allowed' : 'pointer', color: disabled ? 'var(--label-disable)' : 'var(--label-neutral)' }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d={dir === 'prev' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} /></svg>
    </button>
  );

  return (
    <nav aria-label="pagination" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, ...style }} {...rest}>
      <Arrow dir="prev" disabled={page <= 1} />
      {pages.map((p, i) => (
        typeof p === 'string' ? (
          <span key={p + i} style={{ minWidth: 20, textAlign: 'center', color: 'var(--label-assistive)', fontFamily: 'var(--font-sans)' }}>…</span>
        ) : (
          <button
            key={p}
            type="button"
            aria-current={p === page ? 'page' : undefined}
            onClick={() => go(p)}
            style={{
              minWidth: 32, height: 32, padding: '0 6px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
              border: `1px solid ${p === page ? 'var(--lk-accent-ink)' : 'transparent'}`,
              background: p === page ? 'var(--lk-accent-tint-2)' : 'transparent',
              fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 'var(--fw-bold)', letterSpacing: '-0.2px', fontVariantNumeric: 'tabular-nums',
              color: p === page ? 'var(--lk-accent-ink)' : 'var(--label-neutral)',
            }}
          >
            {p}
          </button>
        )
      ))}
      <Arrow dir="next" disabled={page >= count} />
    </nav>
  );
}
