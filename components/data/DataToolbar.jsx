import React from 'react';
import { SearchField } from '../forms/SearchField.jsx';

/**
 * LK ROBOTICS - DataToolbar
 * Header/controls bar for DataGrid and Table surfaces: title, result count,
 * search field, filter chips/menus, and trailing commands. Row selection and
 * its bulk actions live on the DataGrid (they replace the grid's header row),
 * so the toolbar stays a stable page-level surface.
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
  // Snap every control to the DS button-height scale so search, chips, and
  // buttons share one baseline (sm 32 / md 40) instead of an invented rhythm.
  const controlHeight = compact ? 'var(--component-button-height-sm)' : 'var(--component-button-height-md)';

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
              15:13 (compact) — SemiBold title over a 13px muted description.
              The result count sits beside the title as context, not next to
              the export CTA where it reads ambiguously. */}
          {(title != null || count != null) && (
            <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 'var(--space-2)', minWidth: 0 }}>
              {title != null && <strong style={{ color: 'var(--color-semantic-label-strong)', fontSize: compact ? 'var(--body2-size)' : 'var(--body1-size)', fontWeight: 'var(--fw-semibold)', lineHeight: compact ? 'var(--body2-line)' : 'var(--body1-line)' }}>{title}</strong>}
              {count != null && <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--label2-size)', fontWeight: 'var(--fw-medium)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{count}개</span>}
            </div>
          )}
          {description != null && <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)' }}>{description}</span>}
        </div>
        {/* Header right slot holds page-level actions only. */}
        {actions != null && (
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-2)', flexWrap: 'wrap', marginLeft: 'auto' }}>
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
    </div>
  );
}
