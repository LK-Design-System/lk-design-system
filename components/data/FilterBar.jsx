import React from 'react';
import { TextButton } from '../buttons/TextButton.jsx';
import { Chip } from '../feedback/Chip.jsx';
import { Icon } from '../icon/Icon.jsx';

const VARIANT_STYLE = {
  standalone: {
    border: '1px solid var(--color-semantic-line-solid-normal)',
    borderRadius: 'var(--radius-md)',
  },
  embedded: {
    borderTop: '1px solid var(--color-semantic-line-solid-normal)',
    borderBottom: '1px solid var(--color-semantic-line-solid-normal)',
    borderRight: 0,
    borderLeft: 0,
    borderRadius: 0,
  },
};

function textLabel(value) {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
}

/**
 * LK Product Extension — FilterBar
 * A controlled visual contract for filter controls, applied-filter removal,
 * result count, saved-view slot and trailing actions. Query state remains
 * product-owned.
 */
export function FilterBar({
  controls,
  activeFilters = [],
  onRemoveFilter,
  onClearFilters,
  clearLabel = '모든 필터 지우기',
  summaryLabel = '적용된 필터',
  resultCount,
  resultCountLabel,
  viewControl,
  actions,
  variant = 'standalone',
  size = 'md',
  'aria-label': ariaLabel = '데이터 필터',
  style,
  ...rest
}) {
  const compact = size === 'sm';
  const filters = Array.isArray(activeFilters) ? activeFilters : [];
  const resolvedVariant = variant === 'embedded' ? 'embedded' : 'standalone';
  const hasSummary = filters.length > 0 || resultCount != null;
  const resultText = resultCountLabel ?? (resultCount != null ? `${resultCount}개 결과` : null);

  return (
    <section
      role="region"
      aria-label={ariaLabel}
      data-filter-bar-variant={resolvedVariant}
      style={{
        display: 'grid',
        gap: compact ? 'var(--space-2)' : 'var(--space-3)',
        minWidth: 0,
        padding: compact ? 'var(--space-3)' : 'var(--space-4)',
        background: 'var(--color-semantic-background-elevated-normal)',
        fontFamily: 'var(--font-sans)',
        ...VARIANT_STYLE[resolvedVariant],
        ...style,
      }}
      {...rest}
    >
      {(controls != null || viewControl != null || actions != null) && (
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap', minWidth: 0 }}>
          {controls != null && (
            <div data-filter-bar-controls style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-2)', flex: '1 1 360px', flexWrap: 'wrap', minWidth: 0 }}>
              {controls}
            </div>
          )}
          {(viewControl != null || actions != null) && (
            <div data-filter-bar-actions style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', gap: 'var(--space-2)', flexWrap: 'wrap', minWidth: 0, marginLeft: 'auto' }}>
              {viewControl}
              {actions}
            </div>
          )}
        </div>
      )}

      {hasSummary && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap', minWidth: 0 }}>
          {filters.length > 0 && (
            <div aria-label={summaryLabel} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flex: '1 1 360px', flexWrap: 'wrap', minWidth: 0 }}>
              <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--label2-size)', fontWeight: 'var(--fw-semibold)', whiteSpace: 'nowrap' }}>
                {summaryLabel}
              </span>
              {filters.map((filter) => {
                const label = textLabel(filter.label);
                const value = textLabel(filter.value);
                const removeLabel = filter.removeLabel || `${label}${value ? ` ${value}` : ''} 필터 제거`;
                const removable = typeof onRemoveFilter === 'function';
                return (
                  <Chip
                    key={filter.id}
                    as={removable ? 'button' : 'span'}
                    type={removable ? 'button' : undefined}
                    size="sm"
                    selected
                    aria-label={removable ? removeLabel : undefined}
                    onClick={removable ? () => onRemoveFilter(filter.id) : undefined}
                    data-removable={removable ? 'true' : 'false'}
                    style={{ maxWidth: '100%' }}
                  >
                    <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {filter.label}{filter.value != null ? ': ' : ''}{filter.value}
                    </span>
                    {removable && <Icon name="close" size={14} aria-hidden="true" style={{ flexShrink: 0 }} />}
                  </Chip>
                );
              })}
              {onClearFilters && filters.length > 1 && (
                <TextButton size="sm" tone="neutral" onClick={onClearFilters}>
                  {clearLabel}
                </TextButton>
              )}
            </div>
          )}
          {resultText != null && (
            <span role="status" aria-live="polite" aria-atomic="true" style={{ marginLeft: 'auto', color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--label2-size)', fontWeight: 'var(--fw-medium)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
              {resultText}
            </span>
          )}
        </div>
      )}
    </section>
  );
}
