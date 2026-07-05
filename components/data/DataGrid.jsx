import React from 'react';

function sortRows(rows, key, dir) {
  if (!key) return rows;
  const s = [...rows].sort((a, b) => {
    const x = a[key]; const y = b[key];
    if (x == null) return 1; if (y == null) return -1;
    if (typeof x === 'number' && typeof y === 'number') return x - y;
    return String(x).localeCompare(String(y), 'ko');
  });
  return dir === 'desc' ? s.reverse() : s;
}

/**
 * LK ROBOTICS — DataGrid
 * A Table with click-to-sort headers and optional row selection. `columns`
 * mark `sortable`; `render` a cell for custom content. Emits selected row
 * indices via `onSelectionChange`.
 */
export function DataGrid({ columns = [], rows = [], selectable = false, onSelectionChange, size = 'md', style, ...rest }) {
  const [sort, setSort] = React.useState({ key: null, dir: 'asc' });
  const [sel, setSel] = React.useState(() => new Set());
  const pad = size === 'sm' ? '10px 12px' : '13px 16px';
  const sorted = sortRows(rows, sort.key, sort.dir);
  const toggleSort = (c) => { if (!c.sortable) return; setSort((s) => (s.key === c.key ? { key: c.key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key: c.key, dir: 'asc' })); };
  const emit = (n) => { onSelectionChange && onSelectionChange([...n]); };
  const toggleRow = (i) => setSel((prev) => { const n = new Set(prev); if (n.has(i)) n.delete(i); else n.add(i); emit(n); return n; });
  const toggleAll = () => setSel((prev) => { const n = prev.size === sorted.length ? new Set() : new Set(sorted.map((_, i) => i)); emit(n); return n; });
  const allOn = selectable && sorted.length > 0 && sel.size === sorted.length;
  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-lg)', ...style }} {...rest}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)' }}>
        <thead>
          <tr>
            {selectable && <th style={{ padding: pad, borderBottom: '1px solid var(--bw-border)', width: 44 }}><input type="checkbox" checked={allOn} onChange={toggleAll} aria-label="select all" /></th>}
            {columns.map((c) => (
              <th key={c.key} onClick={() => toggleSort(c)} style={{ textAlign: c.align || 'left', padding: pad, borderBottom: '1px solid var(--bw-border)', fontSize: 12, fontWeight: 'var(--fw-bold)', letterSpacing: '0.4px', textTransform: 'uppercase', color: 'var(--label-alternative)', cursor: c.sortable ? 'pointer' : 'default', whiteSpace: 'nowrap', userSelect: 'none' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  {c.label}
                  {c.sortable && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: sort.key === c.key ? 1 : 0.3 }}><path d={sort.key === c.key && sort.dir === 'desc' ? 'm6 9 6 6 6-6' : 'm6 15 6-6 6 6'} /></svg>}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r, ri) => (
            <tr key={ri} style={{ background: sel.has(ri) ? 'var(--lk-accent-tint)' : 'transparent' }}>
              {selectable && <td style={{ padding: pad, borderBottom: '1px solid var(--bw-border)' }}><input type="checkbox" checked={sel.has(ri)} onChange={() => toggleRow(ri)} aria-label={`select row ${ri + 1}`} /></td>}
              {columns.map((c) => <td key={c.key} style={{ textAlign: c.align || 'left', padding: pad, borderBottom: '1px solid var(--bw-border)', fontSize: 14.5, color: 'var(--label-neutral)', whiteSpace: 'nowrap' }}>{typeof c.render === 'function' ? c.render(r) : r[c.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
