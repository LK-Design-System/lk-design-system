import React from 'react';
import { SearchField } from '@lk-design-system/lds-core/components/forms/SearchField';
import { componentVars, partClassName, partStyle } from '@lk-design-system/lds-core/component-authoring';

// The count copy is Korean-fixed ("개"), so its digits are grouped with the same
// pinned locale instead of following the host environment. Ungrouped totals such
// as `3941개` are hard to size up at a glance in a collection header.
const formatCount = (count) => (typeof count === 'number' && Number.isFinite(count) ? count.toLocaleString('ko-KR') : count);

/**
 * LK PRODUCT — DataToolbar
 * Header/controls bar for DataGrid and Table surfaces: title, result count,
 * search field, filter chips/menus, and trailing commands. Row selection and
 * its bulk actions live on the DataGrid (they replace the grid's header row),
 * so the toolbar stays a stable page-level surface.
 */
export const DataToolbar = React.forwardRef(function DataToolbar({
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
  className,
  style,
  classNames,
  styles,
  vars,
  ...rest
}, forwardedRef) {
  const isSearchControlled = searchValue !== undefined;
  const [internalSearch, setInternalSearch] = React.useState(defaultSearchValue);
  const currentSearch = isSearchControlled ? searchValue : internalSearch;
  const setSearch = (value) => {
    if (!isSearchControlled) setInternalSearch(value);
    onSearchChange && onSearchChange(value);
  };
  const compact = size === 'sm';
  const resolvedFilters = typeof filters === 'function' ? filters({ size }) : filters;
  const hasHeader = title != null || description != null || count != null || actions != null;
  const hasControls = searchable || resolvedFilters != null;

  // Do not leave an empty bordered strip when the toolbar has no content. A
  // controls-only toolbar must also have one grid row so `gap` cannot create
  // asymmetric padding above the controls.
  if (!hasHeader && !hasControls) return null;

  return (
    <div
      ref={forwardedRef}
      data-slot="root"
      data-size={size}
      data-variant={variant}
      className={partClassName(classNames, 'root', className) || undefined}
      style={{
        ...componentVars(vars, '--lds-data-toolbar-'),
        display: 'grid',
        gap: `var(--lds-data-toolbar-gap, ${compact ? 'var(--component-data-toolbar-gap-sm, var(--space-2))' : 'var(--component-data-toolbar-gap-md, var(--space-3))'})`,
        padding: `var(--lds-data-toolbar-padding, ${compact ? 'var(--component-data-toolbar-padding-sm, 10px 12px)' : 'var(--component-data-toolbar-padding-md, 14px 16px)'})`,
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
        ...partStyle(styles, 'root'),
        ...style,
      }}
      {...rest}
    >
      {hasHeader && (
        <div data-slot="header" className={partClassName(classNames, 'header') || undefined} data-data-toolbar-header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap', minWidth: 0, ...partStyle(styles, 'header') }}>
          <div data-slot="heading" className={partClassName(classNames, 'heading') || undefined} style={{ display: 'grid', gap: 'var(--space-1)', minWidth: 0, ...partStyle(styles, 'heading') }}>
            {/* WDS Card/List Cell title:description ratio — 16:13 (default),
                15:13 (compact) — SemiBold title over a 13px muted description.
                The result count sits beside the title as context, not next to
                the export CTA where it reads ambiguously. */}
            {(title != null || count != null) && (
              <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 'var(--space-2)', minWidth: 0 }}>
                {title != null && <strong data-slot="title" className={partClassName(classNames, 'title') || undefined} style={{ color: 'var(--color-semantic-label-strong)', fontSize: compact ? 'var(--body2-size)' : 'var(--body1-size)', fontWeight: 'var(--fw-semibold)', lineHeight: compact ? 'var(--body2-line)' : 'var(--body1-line)', ...partStyle(styles, 'title') }}>{title}</strong>}
                {count != null && <span data-slot="count" className={partClassName(classNames, 'count') || undefined} style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--label2-size)', fontWeight: 'var(--fw-medium)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', ...partStyle(styles, 'count') }}>{formatCount(count)}개</span>}
              </div>
            )}
            {description != null && <span data-slot="description" className={partClassName(classNames, 'description') || undefined} style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)', overflowWrap: 'anywhere', ...partStyle(styles, 'description') }}>{description}</span>}
          </div>
          {/* Header right slot holds page-level actions only. */}
          {actions != null && (
            <div data-slot="actions" className={partClassName(classNames, 'actions') || undefined} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-2)', flexWrap: 'wrap', marginLeft: 'auto', ...partStyle(styles, 'actions') }}>
              {actions}
            </div>
          )}
        </div>
      )}
      {hasControls && (
        <div data-slot="controls" className={partClassName(classNames, 'controls') || undefined} data-data-toolbar-controls style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', minWidth: 0, ...partStyle(styles, 'controls') }}>
          {searchable && (
            <div data-slot="search" className={partClassName(classNames, 'search') || undefined} style={{ flex: '1 1 260px', minWidth: 200, maxWidth: 'var(--lds-data-toolbar-search-max-width, 360px)', ...partStyle(styles, 'search') }}>
              <SearchField
                value={currentSearch}
                onChange={setSearch}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                size={size}
              />
            </div>
          )}
          {resolvedFilters != null && (
            <div
              data-slot="filters"
              className={partClassName(classNames, 'filters') || undefined}
              data-data-toolbar-filter-size={size}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-1-5)',
                flex: '1 1 auto',
                flexWrap: 'wrap',
                width: 'max-content',
                maxWidth: '100%',
                minWidth: 0,
                ...partStyle(styles, 'filters'),
              }}
            >
              {resolvedFilters}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
