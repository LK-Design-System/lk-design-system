import React from 'react';
import { thStyle, tdStyle } from './table-cell-styles.js';

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

function checkboxStyle(checked) {
  return {
    appearance: 'none',
    WebkitAppearance: 'none',
    width: 16,
    height: 16,
    margin: 0,
    borderRadius: 4,
    border: `1px solid ${checked ? 'var(--lk-accent-ink)' : 'var(--bw-border)'}`,
    backgroundColor: checked ? 'var(--lk-accent-ink)' : 'var(--surface-card)',
    backgroundImage: checked
      ? 'url("data:image/svg+xml,%3Csvg width=\'16\' height=\'16\' viewBox=\'0 0 16 16\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M4 8.2L6.7 10.8L12 5.2\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")'
      : 'none',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    cursor: 'pointer',
    verticalAlign: 'middle',
  };
}

/**
 * LK ROBOTICS — DataGrid
 * A Table with click-to-sort headers and optional row selection. `columns`
 * mark `sortable`; `render` a cell for custom content. Emits selected row
 * indices via `onSelectionChange`.
 */
export function DataGrid({ columns = [], rows = [], selectable = false, selectedRows, defaultSelectedRows = [], onSelectionChange, size = 'md', style, ...rest }) {
  const [sort, setSort] = React.useState({ key: null, dir: 'asc' });
  // Selection is controlled when `selectedRows` is passed, otherwise internal.
  const isControlled = selectedRows !== undefined;
  const [internalSel, setInternalSel] = React.useState(() => new Set(defaultSelectedRows));
  const sel = isControlled ? new Set(selectedRows) : internalSel;
  const pad = size === 'sm' ? '10px 12px' : '13px 16px';
  const sorted = sortRows(rows, sort.key, sort.dir);
  const toggleSort = (c) => { if (!c.sortable) return; setSort((s) => (s.key === c.key ? { key: c.key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key: c.key, dir: 'asc' })); };
  // Compute next selection in the event handler (not inside the setState
  // updater) so the parent callback never fires mid-render.
  const applySel = (n) => { if (!isControlled) setInternalSel(n); onSelectionChange && onSelectionChange([...n]); };
  const toggleRow = (i) => { const n = new Set(sel); if (n.has(i)) n.delete(i); else n.add(i); applySel(n); };
  const toggleAll = () => { const n = sel.size === sorted.length ? new Set() : new Set(sorted.map((_, i) => i)); applySel(n); };
  const allOn = selectable && sorted.length > 0 && sel.size === sorted.length;
  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-lg)', ...style }} {...rest}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)' }}>
        <thead>
          <tr>
            {selectable && <th style={{ padding: pad, borderBottom: '1px solid var(--bw-border)', width: 44 }}><input type="checkbox" checked={allOn} onChange={toggleAll} aria-label="전체 선택" style={checkboxStyle(allOn)} /></th>}
            {columns.map((c) => (
              <th
                key={c.key}
                aria-sort={c.sortable && sort.key === c.key ? (sort.dir === 'desc' ? 'descending' : 'ascending') : undefined}
                style={{ ...thStyle(pad), textAlign: c.align || 'left', userSelect: 'none' }}
              >
                {c.sortable ? (
                  <button
                    type="button"
                    onClick={() => toggleSort(c)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: 0, border: 0, background: 'transparent', cursor: 'pointer', font: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit', color: 'inherit' }}
                  >
                    {c.label}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ opacity: sort.key === c.key ? 1 : 0.3 }}><path d={sort.key === c.key && sort.dir === 'desc' ? 'm6 9 6 6 6-6' : 'm6 15 6-6 6 6'} /></svg>
                  </button>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>{c.label}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r, ri) => (
            <tr key={ri} style={{ background: sel.has(ri) ? 'var(--lk-accent-tint)' : 'transparent' }}>
              {selectable && <td style={{ padding: pad, borderBottom: '1px solid var(--bw-border)' }}><input type="checkbox" checked={sel.has(ri)} onChange={() => toggleRow(ri)} aria-label={`${ri + 1}행 선택`} style={checkboxStyle(sel.has(ri))} /></td>}
              {columns.map((c) => <td key={c.key} style={{ ...tdStyle(pad), textAlign: c.align || 'left' }}>{typeof c.render === 'function' ? c.render(r) : r[c.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
