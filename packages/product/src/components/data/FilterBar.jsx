import React from 'react';
import { TextButton } from '@lk-design-system/lds-core/components/buttons/TextButton';
import { Chip } from '@lk-design-system/lds-core/components/feedback/Chip';
import { Icon } from '@lk-design-system/lds-core/components/icon/Icon';

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

// Library-standard visually-hidden recipe (DataGrid, Chip, ToastStack): out of
// flow, so it never adds a grid track or gap to the surface it lives in.
const SR_ONLY_STYLE = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

// An applied filter reads as a token, so it reuses the selected chip surface.
// It is not a toggle though: the button removes the filter, so it must not
// carry aria-pressed (APG Button — toggle state belongs to controls that stay
// in place and flip). Passing Chip's `selected` would add both aria-pressed on
// the removable chip and a hidden "선택됨" on the read-only one, so the surface
// is expressed through the same tokens instead.
const APPLIED_CHIP_STYLE = {
  maxWidth: '100%',
  background: 'var(--component-chip-bg-selected)',
  border: 'var(--component-chip-border-active)',
  color: 'var(--color-semantic-label-normal)',
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

  const pendingRemovalRef = React.useRef(null);

  // WCAG 2.4.3 / PatternFly Filters: removing a chip destroys the focused
  // button, so focus is handed to the chip that took its place — then the last
  // chip, the clear-all action, and finally the named region itself.
  React.useEffect(() => {
    const pending = pendingRemovalRef.current;
    if (!pending?.root) return;
    // The product owns the query state: wait until the removal actually landed.
    if (filters.some((filter) => filter.id === pending.id)) return;
    pendingRemovalRef.current = null;
    const { root } = pending;
    const chips = [...root.querySelectorAll('[data-removable="true"]')];
    const next = chips[Math.min(pending.index, chips.length - 1)]
      || root.querySelector('[data-filter-bar-clear]')
      || root;
    next.focus?.();
  });

  const removeFilter = (filter, index, event) => {
    // The section element is read from the activated chip instead of a ref, so
    // a consumer-supplied `ref` on the surface is never displaced.
    pendingRemovalRef.current = {
      id: filter.id,
      index,
      root: event?.currentTarget?.closest?.('[data-filter-bar-variant]') ?? null,
    };
    onRemoveFilter(filter.id);
  };

  return (
    <section
      role="region"
      aria-label={ariaLabel}
      /* Focus fallback target when the last applied filter is removed; -1 keeps
         it out of the Tab sequence. */
      tabIndex={-1}
      data-filter-bar-variant={resolvedVariant}
      style={{
        display: 'grid',
        gap: compact ? 'var(--component-filter-bar-gap-sm, var(--space-2))' : 'var(--component-filter-bar-gap-md, var(--space-3))',
        minWidth: 0,
        padding: compact ? 'var(--component-filter-bar-padding-sm, var(--space-3))' : 'var(--component-filter-bar-padding-md, var(--space-4))',
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
            <div role="group" aria-label={summaryLabel} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flex: '1 1 360px', flexWrap: 'wrap', minWidth: 0 }}>
              <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--label2-size)', fontWeight: 'var(--fw-semibold)', whiteSpace: 'nowrap' }}>
                {summaryLabel}
              </span>
              {filters.map((filter, index) => {
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
                    aria-label={removable ? removeLabel : undefined}
                    onClick={removable ? (event) => removeFilter(filter, index, event) : undefined}
                    data-removable={removable ? 'true' : 'false'}
                    style={APPLIED_CHIP_STYLE}
                  >
                    <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {filter.label}{filter.value != null ? ': ' : ''}{filter.value}
                    </span>
                    {removable && <Icon name="close" size={14} aria-hidden="true" style={{ flexShrink: 0 }} />}
                  </Chip>
                );
              })}
              {onClearFilters && filters.length > 1 && (
                <TextButton size="sm" tone="neutral" data-filter-bar-clear="" onClick={onClearFilters}>
                  {clearLabel}
                </TextButton>
              )}
            </div>
          )}
          {resultText != null && (
            <span data-filter-bar-result="" style={{ marginLeft: 'auto', color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--label2-size)', fontWeight: 'var(--fw-medium)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
              {resultText}
            </span>
          )}
        </div>
      )}

      {/* The announcer is mounted for the whole life of the bar and only its
          text changes. A live region inserted together with its first message is
          not reliably announced (same contract as ToastStack), and the visible
          count only appears once a filter or a result count exists. */}
      <span data-filter-bar-result-live="" role="status" aria-live="polite" aria-atomic="true" style={SR_ONLY_STYLE}>
        {resultText ?? ''}
      </span>
    </section>
  );
}
