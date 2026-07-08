import React from 'react';
import { SearchField } from '../forms/SearchField.jsx';

/**
 * LK ROBOTICS - DataToolbar
 * Header/controls bar for DataGrid and Table surfaces: title, result count,
 * search field, filter chips/menus, selected-count bulk actions, and trailing
 * commands. It keeps dense operational tables from inventing custom toolbars.
 */
export function DataToolbar({
  title,
  description,
  count,
  searchValue,
  defaultSearchValue = '',
  onSearchChange,
  searchPlaceholder = '검색',
  filters,
  actions,
  selectedCount = 0,
  bulkActions,
  onClearSelection,
  size = 'md',
  style,
  ...rest
}) {
  const isSearchControlled = searchValue !== undefined;
  const [internalSearch, setInternalSearch] = React.useState(defaultSearchValue);
  const currentSearch = isSearchControlled ? searchValue : internalSearch;
  const setSearch = (value) => {
    if (!isSearchControlled) setInternalSearch(value);
    onSearchChange && onSearchChange(value);
  };
  const compact = size === 'sm';
  // Control scale: sm 32 (compact) / 40 (button md step) — keeps toolbar rows
  // flush with the sm/md button heights beside them.
  const controlHeight = compact ? 'var(--control-h-sm)' : 40;

  return (
    <div
      style={{
        display: 'grid',
        gap: compact ? 'var(--space-2)' : 'var(--space-3)',
        padding: compact ? '10px 12px' : '14px 16px',
        border: '1px solid var(--bw-border)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bw-white)',
        fontFamily: 'var(--font-sans)',
        minWidth: 0,
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap', minWidth: 0 }}>
        <div style={{ display: 'grid', gap: 3, minWidth: 0 }}>
          {/* WDS Card/List Cell title:description ratio — 16:13 (default),
              15:13 (compact) — SemiBold title over a 13px muted description. */}
          {title != null && <strong style={{ color: 'var(--label-strong)', fontSize: compact ? 'var(--body2-size)' : 'var(--body1-size)', fontWeight: 'var(--fw-semibold)', lineHeight: compact ? 'var(--body2-line)' : 'var(--body1-line)' }}>{title}</strong>}
          {description != null && <span style={{ color: 'var(--label-alternative)', fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)' }}>{description}</span>}
        </div>
        {/* Header right slot holds page-level context only: result count and
            persistent actions. Selection controls live in the contextual bar
            below so the two scopes never blur together. */}
        {(count != null || actions != null) && (
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-2)', flexWrap: 'wrap', marginLeft: 'auto' }}>
            {count != null && <span style={{ color: 'var(--label-alternative)', fontSize: 'var(--label2-size)', fontVariantNumeric: 'tabular-nums' }}>{count}개</span>}
            {actions}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', minWidth: 0 }}>
        <div style={{ flex: '1 1 260px', minWidth: 200, maxWidth: 360 }}>
          <SearchField
            value={currentSearch}
            onChange={setSearch}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            size="sm"
            style={{ height: controlHeight }}
          />
        </div>
        {filters != null && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>{filters}</div>}
      </div>
      {/* Contextual selection bar: a tinted strip appears only while rows are
          selected, carrying the count, bulk actions, and a clear affordance. */}
      {selectedCount > 0 && (
        <div
          role="status"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            flexWrap: 'wrap',
            minHeight: controlHeight,
            padding: compact ? '6px 10px' : '8px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--lk-accent-tint-2)',
            color: 'var(--label-normal)',
          }}
        >
          {/* Status on the left; actions grouped on the right so the two
              controls read as one cluster instead of splitting the bar. */}
          <span style={{ color: 'var(--label-strong)', fontSize: 'var(--label2-size)', fontWeight: 'var(--fw-semibold)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
            {selectedCount}개 선택됨
          </span>
          {(bulkActions != null || onClearSelection) && (
            <div style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {bulkActions}
              {onClearSelection && (
                <button
                  type="button"
                  onClick={onClearSelection}
                  aria-label="선택 해제"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '4px 8px',
                    border: 0,
                    background: 'transparent',
                    color: 'var(--label-neutral)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--label2-size)',
                    fontWeight: 'var(--fw-semibold)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  선택 해제
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
