import React from 'react';
import { Button } from '../buttons/Button.jsx';
import { SearchField } from '../forms/SearchField.jsx';
import { Icon } from '../icon/Icon.jsx';
import { componentVars, partClassName, partStyle } from '../internal/surface.js';
import { Drawer } from '../overlay/Drawer.jsx';

const DATA_TOOLBAR_STYLE_ID = 'lk-data-toolbar-layout';
const DATA_TOOLBAR_STYLES = `
.lk-data-toolbar__controls{display:flex;align-items:center;gap:var(--space-2);flex-wrap:wrap;min-width:0}
.lk-data-toolbar__search{flex:1 1 260px;min-width:200px;max-width:var(--lds-data-toolbar-search-max-width,360px)}
.lk-data-toolbar__wide-controls{display:inline-flex;align-items:center;column-gap:var(--space-1-5);flex:1 0 auto;flex-wrap:nowrap;max-width:100%;min-width:0}
.lk-data-toolbar__filters{display:inline-flex;align-items:center;column-gap:var(--space-1-5);row-gap:var(--space-2);flex:1 1 auto;flex-wrap:wrap;width:max-content;max-width:100%;min-width:0}
.lk-data-toolbar__sort{display:inline-flex;align-items:center;flex:0 0 auto;min-width:0}
.lk-data-toolbar__metadata{display:inline-flex;align-items:center;min-width:0;margin-left:auto}
.lk-data-toolbar__narrow-controls{display:none;align-items:center;gap:var(--space-2);width:100%;min-width:0}
.lk-data-toolbar__narrow-sort{display:flex;flex:1 1 0;min-width:0}
.lk-data-toolbar__narrow-sort>*{width:100%;max-width:100%}
.lk-data-toolbar__filter-panel-content{display:grid;gap:var(--space-3);min-width:0}
.lk-data-toolbar__filter-panel-content>*{width:100%;max-width:100%}
.lk-data-toolbar[data-layout="narrow"]>.lk-data-toolbar__controls{display:grid;grid-template-columns:minmax(0,1fr);align-items:stretch}
.lk-data-toolbar[data-layout="narrow"]>.lk-data-toolbar__controls>.lk-data-toolbar__search{width:100%;max-width:none;min-width:0}
.lk-data-toolbar[data-layout="narrow"]>.lk-data-toolbar__controls>.lk-data-toolbar__wide-controls{display:none}
.lk-data-toolbar[data-layout="narrow"]>.lk-data-toolbar__controls>.lk-data-toolbar__narrow-controls{display:flex}
.lk-data-toolbar[data-layout="narrow"]>.lk-data-toolbar__controls>.lk-data-toolbar__metadata{width:100%;margin-left:0}
@container lds-data-toolbar (max-width:767px){
  .lk-data-toolbar[data-layout="auto"]>.lk-data-toolbar__controls{display:grid;grid-template-columns:minmax(0,1fr);align-items:stretch}
  .lk-data-toolbar[data-layout="auto"]>.lk-data-toolbar__controls>.lk-data-toolbar__search{width:100%;max-width:none;min-width:0}
  .lk-data-toolbar[data-layout="auto"]>.lk-data-toolbar__controls>.lk-data-toolbar__wide-controls{display:none}
  .lk-data-toolbar[data-layout="auto"]>.lk-data-toolbar__controls>.lk-data-toolbar__narrow-controls{display:flex}
  .lk-data-toolbar[data-layout="auto"]>.lk-data-toolbar__controls>.lk-data-toolbar__metadata{width:100%;margin-left:0}
}
`;

// Layout rules live in one head-level style tag (the Input placeholder
// pattern) so the toolbar root keeps exactly one DOM child per grid row.
function useDataToolbarStyles() {
  React.useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById(DATA_TOOLBAR_STYLE_ID)) return;
    const el = document.createElement('style');
    el.id = DATA_TOOLBAR_STYLE_ID;
    el.textContent = DATA_TOOLBAR_STYLES;
    document.head.appendChild(el);
  }, []);
}

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
  activeFilterCount = 0,
  filterLabel = '필터',
  filterPanelTitle = '필터',
  filterCloseLabel = '완료',
  sort,
  metadata,
  actions,
  size = 'md',
  variant = 'standalone',
  layout = 'auto',
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
  const resolvedSort = typeof sort === 'function' ? sort({ size }) : sort;
  const resolvedLayout = ['auto', 'wide', 'narrow'].includes(layout) ? layout : 'auto';
  const resolvedFilterCount = typeof activeFilterCount === 'number' && Number.isFinite(activeFilterCount)
    ? Math.max(0, Math.floor(activeFilterCount))
    : 0;
  const filterTriggerText = resolvedFilterCount > 0 ? `${filterLabel} ${resolvedFilterCount}` : filterLabel;
  const [filterPanelOpen, setFilterPanelOpen] = React.useState(false);
  const filterTriggerRef = React.useRef(null);
  const filterPanelId = React.useId();
  useDataToolbarStyles();
  const hasHeader = title != null || description != null || count != null || actions != null;
  const hasControls = searchable || resolvedFilters != null || resolvedSort != null || metadata != null;

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
      data-layout={resolvedLayout}
      className={partClassName(classNames, 'root', 'lk-data-toolbar', className) || undefined}
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
        containerType: 'inline-size',
        containerName: 'lds-data-toolbar',
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
        <div data-slot="controls" className={partClassName(classNames, 'controls', 'lk-data-toolbar__controls') || undefined} data-data-toolbar-controls style={partStyle(styles, 'controls')}>
          {searchable && (
            <div data-slot="search" className={partClassName(classNames, 'search', 'lk-data-toolbar__search') || undefined} style={partStyle(styles, 'search')}>
              <SearchField
                value={currentSearch}
                onChange={setSearch}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                size={size}
              />
            </div>
          )}
          {(resolvedFilters != null || resolvedSort != null) && (
            <div className="lk-data-toolbar__wide-controls" data-toolbar-view="wide">
              {resolvedFilters != null && (
                <div
                  data-slot="filters"
                  className={partClassName(classNames, 'filters', 'lk-data-toolbar__filters') || undefined}
                  data-data-toolbar-filter-size={size}
                  style={partStyle(styles, 'filters')}
                >
                  {resolvedFilters}
                </div>
              )}
              {resolvedSort != null && (
                <div data-slot="sort" className={partClassName(classNames, 'sort', 'lk-data-toolbar__sort') || undefined} style={partStyle(styles, 'sort')}>
                  {resolvedSort}
                </div>
              )}
            </div>
          )}
          {(resolvedFilters != null || resolvedSort != null) && (
            <div data-slot="narrowControls" className={partClassName(classNames, 'narrowControls', 'lk-data-toolbar__narrow-controls') || undefined} data-toolbar-view="narrow" style={partStyle(styles, 'narrowControls')}>
              {resolvedFilters != null && (
                <Button
                  ref={filterTriggerRef}
                  type="button"
                  size={size}
                  variant="outlined"
                  color="assistive"
                  aria-haspopup="dialog"
                  aria-expanded={filterPanelOpen}
                  aria-controls={filterPanelId}
                  data-data-toolbar-filter-trigger=""
                  onClick={() => setFilterPanelOpen(true)}
                  vars={{ '--lds-button-height': compact ? 'var(--control-h-sm)' : 'var(--component-input-height)' }}
                  style={{ flexShrink: 0 }}
                >
                  <Icon name="tune" size={16} aria-hidden="true" />
                  {filterTriggerText}
                </Button>
              )}
              {resolvedSort != null && (
                <div className="lk-data-toolbar__narrow-sort" data-slot="sort" style={partStyle(styles, 'sort')}>
                  {resolvedSort}
                </div>
              )}
            </div>
          )}
          {metadata != null && (
            <div data-slot="metadata" className={partClassName(classNames, 'metadata', 'lk-data-toolbar__metadata') || undefined} style={partStyle(styles, 'metadata')}>
              {metadata}
            </div>
          )}
        </div>
      )}
      {resolvedFilters != null && (
        <Drawer
          id={filterPanelId}
          open={filterPanelOpen}
          onClose={() => setFilterPanelOpen(false)}
          returnFocusRef={filterTriggerRef}
          title={filterPanelTitle}
          density="compact"
          width={420}
          style={{ width: '100%', maxWidth: '100vw' }}
          bodyStyle={{ padding: 'var(--space-5)' }}
          footer={(
            <Button type="button" full onClick={() => setFilterPanelOpen(false)}>
              {filterCloseLabel}
            </Button>
          )}
        >
          <div data-slot="filterPanel" className={partClassName(classNames, 'filterPanel', 'lk-data-toolbar__filter-panel-content') || undefined} data-data-toolbar-filter-size={size} style={partStyle(styles, 'filterPanel')}>
            {resolvedFilters}
          </div>
        </Drawer>
      )}
    </div>
  );
});
