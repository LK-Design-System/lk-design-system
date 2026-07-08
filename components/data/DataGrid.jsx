import React from 'react';
import { thStyle, tdStyle } from './table-cell-styles.js';
import { Icon } from '../icon/Icon.jsx';

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

const CHECK_IMG = 'url("data:image/svg+xml,%3Csvg width=\'16\' height=\'16\' viewBox=\'0 0 16 16\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M4 8.2L6.7 10.8L12 5.2\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")';
const DASH_IMG = 'url("data:image/svg+xml,%3Csvg width=\'16\' height=\'16\' viewBox=\'0 0 16 16\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M4 8h8\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\'/%3E%3C/svg%3E")';

function checkboxStyle(checked, indeterminate = false) {
  const filled = checked || indeterminate;
  return {
    appearance: 'none',
    WebkitAppearance: 'none',
    width: 16,
    height: 16,
    margin: 0,
    borderRadius: 4,
    border: `1px solid ${filled ? 'var(--color-semantic-primary-normal)' : 'var(--bw-border)'}`,
    backgroundColor: filled ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-background-elevated-normal)',
    backgroundImage: indeterminate ? DASH_IMG : checked ? CHECK_IMG : 'none',
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
export function DataGrid({ columns = [], rows = [], selectable = false, selectedRows, defaultSelectedRows = [], onSelectionChange, bulkActions, onClearSelection, size = 'md', style, ...rest }) {
  const [sort, setSort] = React.useState({ key: null, dir: 'asc' });
  // Selection is controlled when `selectedRows` is passed, otherwise internal.
  const isControlled = selectedRows !== undefined;
  const [internalSel, setInternalSel] = React.useState(() => new Set(defaultSelectedRows));
  const sel = isControlled ? new Set(selectedRows) : internalSel;
  const pad = size === 'sm' ? '10px 12px' : '13px 16px';
  // Header and selection band share one fixed row height so replacing the
  // column header with the band never shifts the rows below. The value must
  // be >= the header's natural height (else only the band honors it), so it
  // is aligned to the data-row height.
  const headerH = size === 'sm' ? 50 : 58;
  const sorted = sortRows(rows, sort.key, sort.dir);
  const toggleSort = (c) => { if (!c.sortable) return; setSort((s) => (s.key === c.key ? { key: c.key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key: c.key, dir: 'asc' })); };
  // Compute next selection in the event handler (not inside the setState
  // updater) so the parent callback never fires mid-render.
  const applySel = (n) => { if (!isControlled) setInternalSel(n); onSelectionChange && onSelectionChange([...n]); };
  const toggleRow = (i) => { const n = new Set(sel); if (n.has(i)) n.delete(i); else n.add(i); applySel(n); };
  const toggleAll = () => { const n = sel.size === sorted.length ? new Set() : new Set(sorted.map((_, i) => i)); applySel(n); };
  const allOn = selectable && sorted.length > 0 && sel.size === sorted.length;
  const selecting = selectable && sel.size > 0;
  const colSpan = columns.length + (selectable ? 1 : 0);
  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-lg)', ...style }} {...rest}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)' }}>
        <thead>
          {selecting ? (
            /* Material-style selection band: replaces the column header at the
               same fixed height (no row shift), carrying the count, a clear
               affordance, and the bulk-action slot. The select-all checkbox
               stays in its own column so it remains reachable while selecting;
               it shows an indeterminate dash on a partial selection. */
            <tr style={{ height: headerH }}>
              {selectable && (
                <th style={{ padding: pad, width: 44, textAlign: 'left', background: 'var(--lk-accent-tint-2)', borderBottom: '1px solid var(--bw-border)' }}>
                  <input type="checkbox" checked={allOn} onChange={toggleAll} aria-label="전체 선택" style={checkboxStyle(allOn, !allOn)} />
                </th>
              )}
              <th colSpan={columns.length} scope="colgroup" style={{ padding: 0, background: 'var(--lk-accent-tint-2)', borderBottom: '1px solid var(--bw-border)' }}>
                <div role="status" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap', minHeight: headerH, padding: size === 'sm' ? '0 12px' : '0 16px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', minWidth: 0 }}>
                    <span style={{ color: 'var(--color-semantic-label-strong)', fontSize: 'var(--label2-size)', fontWeight: 'var(--fw-semibold)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{sel.size}개 선택됨</span>
                    {onClearSelection && (
                      <button type="button" onClick={onClearSelection} aria-label="선택 해제" title="선택 해제" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, padding: 0, border: 0, borderRadius: 'var(--radius-sm)', background: 'transparent', color: 'var(--color-semantic-label-neutral)', cursor: 'pointer' }}>
                        <Icon name="close" size={15} aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  {bulkActions != null && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>{bulkActions}</div>}
                </div>
              </th>
            </tr>
          ) : (
            <tr style={{ height: headerH }}>
              {selectable && <th style={{ padding: pad, borderBottom: '1px solid var(--bw-border)', width: 44, textAlign: 'left' }}><input type="checkbox" checked={allOn} onChange={toggleAll} aria-label="전체 선택" style={checkboxStyle(allOn)} /></th>}
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
          )}
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
