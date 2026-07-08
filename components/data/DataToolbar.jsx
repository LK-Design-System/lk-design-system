import React from 'react';
import { Icon } from '../icon/Icon.jsx';

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
          {title != null && <strong style={{ color: 'var(--label-strong)', fontSize: compact ? 'var(--label1-size)' : 'var(--body2-size)', fontWeight: 'var(--fw-semibold)', lineHeight: 1.35 }}>{title}</strong>}
          {description != null && <span style={{ color: 'var(--label-alternative)', fontSize: 'var(--label2-size)', lineHeight: 1.45 }}>{description}</span>}
        </div>
        {(count != null || actions != null) && (
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-2)', flexWrap: 'wrap', marginLeft: 'auto' }}>
            {count != null && <span style={{ color: 'var(--label-alternative)', fontSize: 'var(--label2-size)', fontVariantNumeric: 'tabular-nums' }}>{count}개</span>}
            {actions}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', minWidth: 0 }}>
        <label style={{ position: 'relative', flex: '1 1 260px', minWidth: 200, maxWidth: 360 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--label-assistive)', pointerEvents: 'none' }} aria-hidden="true">
            <Icon name="search" size={17} role="presentation" aria-label={undefined} aria-hidden="true" />
          </span>
          <input
            value={currentSearch}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            style={{
              width: '100%',
              height: controlHeight,
              boxSizing: 'border-box',
              padding: '0 12px 0 36px',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface-raised)',
              color: 'var(--label-normal)',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--label1-size)',
              outline: 'none',
            }}
          />
        </label>
        {filters != null && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>{filters}</div>}
        {selectedCount > 0 && (
          <div
            role="status"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              minHeight: controlHeight,
              marginLeft: 'auto',
              paddingLeft: 'var(--space-3)',
              borderLeft: '1px solid var(--line-neutral)',
              color: 'var(--label-normal)',
              fontSize: 13,
              fontWeight: 'var(--fw-bold)',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', minHeight: controlHeight, padding: '0 10px', borderRadius: 'var(--radius-sm)', background: 'var(--fill-normal)' }}>
              {selectedCount}개 선택
            </span>
            {bulkActions}
          </div>
        )}
      </div>
    </div>
  );
}
