import React from 'react';
import { thStyle, tdStyle } from './table-cell-styles.js';
import { Icon } from '../icon/Icon.jsx';

function sortRowEntries(entries, key, dir) {
  if (!key) return entries;
  const s = [...entries].sort((a, b) => {
    const x = a.row[key]; const y = b.row[key];
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
    border: `1px solid ${filled ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-line-solid-normal)'}`,
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
 * mark `sortable`; `render` a cell for custom content. Supports controlled
 * sort, stable row IDs, manual/server sorting, keyboard row activation, and
 * loading/error/empty states.
 */
export function DataGrid({
  columns = [],
  rows = [],
  selectable = false,
  selectedRows,
  defaultSelectedRows = [],
  onSelectionChange,
  getRowId,
  sort: controlledSort,
  defaultSort = { key: null, dir: 'asc' },
  onSortChange,
  sortingMode = 'client',
  onRowActivate,
  bulkActions,
  onClearSelection,
  loading = false,
  loadingLabel = '불러오는 중',
  error,
  emptyLabel = '표시할 항목이 없습니다.',
  stateActions,
  size = 'md',
  style,
  ...rest
}) {
  const [internalSort, setInternalSort] = React.useState(defaultSort);
  const sortControlled = controlledSort !== undefined;
  const sort = sortControlled ? controlledSort : internalSort;
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
  const entries = rows.map((row, index) => ({ row, id: getRowId ? getRowId(row, index) : index, sourceIndex: index }));
  const sorted = sortingMode === 'manual' ? entries : sortRowEntries(entries, sort?.key, sort?.dir);
  const toggleSort = (column) => {
    if (!column.sortable) return;
    const next = sort?.key === column.key
      ? { key: column.key, dir: sort.dir === 'asc' ? 'desc' : 'asc' }
      : { key: column.key, dir: 'asc' };
    if (!sortControlled) setInternalSort(next);
    onSortChange && onSortChange(next);
  };
  // Compute next selection in the event handler (not inside the setState
  // updater) so the parent callback never fires mid-render.
  const applySel = (n) => { if (!isControlled) setInternalSel(n); onSelectionChange && onSelectionChange([...n]); };
  const toggleRow = (id) => { const n = new Set(sel); if (n.has(id)) n.delete(id); else n.add(id); applySel(n); };
  const visibleIds = sorted.map((entry) => entry.id);
  const allOn = selectable && visibleIds.length > 0 && visibleIds.every((id) => sel.has(id));
  const toggleAll = () => {
    const n = new Set(sel);
    if (allOn) visibleIds.forEach((id) => n.delete(id));
    else visibleIds.forEach((id) => n.add(id));
    applySel(n);
  };
  const selecting = selectable && sel.size > 0;
  const colSpan = columns.length + (selectable ? 1 : 0);
  return (
    <div aria-busy={loading || undefined} style={{ overflowX: 'auto', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-lg)', ...style }} {...rest}>
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
                <th style={{ padding: pad, width: 44, textAlign: 'left', background: 'var(--color-semantic-primary-surface-strong)', borderBottom: '1px solid var(--color-semantic-line-solid-normal)' }}>
                  <input type="checkbox" checked={allOn} onChange={toggleAll} aria-label="전체 선택" style={checkboxStyle(allOn, !allOn)} />
                </th>
              )}
              <th colSpan={columns.length} scope="colgroup" style={{ padding: 0, background: 'var(--color-semantic-primary-surface-strong)', borderBottom: '1px solid var(--color-semantic-line-solid-normal)' }}>
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
              {selectable && <th style={{ padding: pad, borderBottom: '1px solid var(--color-semantic-line-solid-normal)', width: 44, textAlign: 'left' }}><input type="checkbox" checked={allOn} onChange={toggleAll} aria-label="전체 선택" style={checkboxStyle(allOn)} /></th>}
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
          {(loading || error != null || sorted.length === 0) && (
            <tr>
              <td colSpan={colSpan} style={{ padding: 'var(--space-8) var(--space-4)', textAlign: 'center', borderBottom: 0 }}>
                <div role={error != null ? 'alert' : 'status'} aria-live="polite" style={{ display: 'inline-grid', justifyItems: 'center', gap: 'var(--space-2)', color: error != null ? 'var(--color-semantic-status-negative)' : 'var(--color-semantic-label-assistive)', fontFamily: 'var(--font-sans)', fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)' }}>
                  <span>{loading ? loadingLabel : error ?? emptyLabel}</span>
                  {stateActions}
                </div>
              </td>
            </tr>
          )}
          {!loading && error == null && sorted.map(({ row, id }, rowIndex) => {
            const selected = sel.has(id);
            const activate = (event) => {
              if (!onRowActivate) return;
              const target = event.target;
              if (target?.closest?.('button, a, input, select, textarea')) return;
              onRowActivate(row, id, event);
            };
            return (
              <tr
                key={id}
                aria-selected={selectable ? selected : undefined}
                tabIndex={onRowActivate ? 0 : undefined}
                onClick={activate}
                onKeyDown={onRowActivate ? (event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onRowActivate(row, id, event);
                  }
                } : undefined}
                style={{ background: selected ? 'var(--color-semantic-primary-surface-normal)' : 'transparent', cursor: onRowActivate ? 'pointer' : undefined }}
              >
                {selectable && <td style={{ padding: pad, borderBottom: '1px solid var(--color-semantic-line-solid-normal)' }}><input type="checkbox" checked={selected} onChange={() => toggleRow(id)} aria-label={`${rowIndex + 1}행 선택`} style={checkboxStyle(selected)} /></td>}
                {columns.map((column) => <td key={column.key} style={{ ...tdStyle(pad), textAlign: column.align || 'left' }}>{typeof column.render === 'function' ? column.render(row, id) : row[column.key]}</td>)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
