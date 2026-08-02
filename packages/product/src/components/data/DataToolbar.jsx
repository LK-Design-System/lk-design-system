import React from 'react';
import { SearchField } from '@lk-design-system/lds-core/components/forms/SearchField';

/**
 * LK PRODUCT — DataToolbar
 * Header/controls bar for DataGrid and Table surfaces: title, result count,
 * search field, filter chips/menus, and trailing commands. Row selection and
 * its bulk actions live on the DataGrid (they replace the grid's header row),
 * so the toolbar stays a stable page-level surface.
 */
export function DataToolbar({
  title,
  description,
  count,
  searchable = true,
  searchValue,
  defaultSearchValue = '',
  onSearchChange,
  searchPlaceholder = '검색',
  filters,
  actions,
  size = 'md',
  variant = 'standalone',
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
  const resolvedFilters = typeof filters === 'function' ? filters({ size }) : filters;

  return (
    <div
      style={{
        display: 'grid',
        gap: compact ? 'var(--space-2)' : 'var(--space-3)',
        padding: compact ? '10px 12px' : '14px 16px',
        // variant="embedded" bonds the toolbar as a header inside a parent
        // surface: it drops its own outer border/radius and keeps only a bottom
        // divider to the content below (e.g. a DataGrid in the same collection
        // card), so the parent owns one continuous perimeter.
        ...(variant === 'embedded'
          ? { borderBottom: '1px solid var(--color-semantic-line-solid-normal)' }
          : { border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-md)' }),
        background: 'var(--color-semantic-background-elevated-normal)',
        fontFamily: 'var(--font-sans)',
        minWidth: 0,
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap', minWidth: 0 }}>
        <div style={{ display: 'grid', gap: 'var(--space-1)', minWidth: 0 }}>
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
          {description != null && <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)', overflowWrap: 'anywhere' }}>{description}</span>}
        </div>
        {/* Header right slot holds page-level actions only. */}
        {actions != null && (
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-2)', flexWrap: 'wrap', marginLeft: 'auto' }}>
            {actions}
          </div>
        )}
      </div>
      {(searchable || resolvedFilters != null) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', minWidth: 0 }}>
          {searchable && (
            <div style={{ flex: '1 1 260px', minWidth: 200, maxWidth: 360 }}>
              <SearchField
                value={currentSearch}
                onChange={setSearch}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                size={size}
              />
            </div>
          )}
          {resolvedFilters != null && <div data-data-toolbar-filter-size={size} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1-5)', flexWrap: 'wrap' }}>{resolvedFilters}</div>}
        </div>
      )}
    </div>
  );
}
