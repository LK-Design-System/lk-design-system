import React from 'react';
import { Button } from '../buttons/Button.jsx';
import { Icon } from '../icon/Icon.jsx';
import { Select } from '../forms/Select.jsx';

/**
 * LK Product Extension — RefreshControl
 * Presents a controlled refresh action, freshness text and optional automatic
 * interval selector. Polling and timestamp calculation remain product-owned.
 */
export function RefreshControl({
  refreshing = false,
  onRefresh,
  lastUpdated,
  lastUpdatedLabel = '마지막 업데이트',
  refreshLabel = '새로고침',
  autoRefreshValue,
  autoRefreshOptions,
  onAutoRefreshChange,
  autoRefreshLabel = '자동 새로고침 간격',
  disabled = false,
  unavailableReason,
  size = 'sm',
  style,
  ...rest
}) {
  const reasonId = React.useId();
  const unavailable = disabled || refreshing;
  const refreshDisabled = disabled || typeof onRefresh !== 'function';
  const autoRefreshDisabled = disabled || typeof onAutoRefreshChange !== 'function';

  return (
    <div
      role="group"
      aria-label="데이터 새로고침"
      aria-describedby={disabled && unavailableReason ? reasonId : undefined}
      style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', minWidth: 0, fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {lastUpdated != null && (
        <span data-refresh-freshness style={{ minWidth: 0, overflowWrap: 'anywhere', color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>
          {lastUpdatedLabel}: {lastUpdated}
        </span>
      )}

      {Array.isArray(autoRefreshOptions) && autoRefreshOptions.length > 0 && (
        <Select
          value={autoRefreshValue}
          onChange={onAutoRefreshChange}
          options={autoRefreshOptions}
          size={size}
          disabled={autoRefreshDisabled}
          aria-label={autoRefreshLabel}
          style={{ width: 150 }}
        />
      )}

      <Button
        type="button"
        size={size}
        variant="ghost"
        iconOnly
        aria-label={refreshLabel}
        title={refreshLabel}
        loading={refreshing}
        loadingLabel={`${refreshLabel} 중`}
        disabled={refreshDisabled}
        style={{ color: refreshDisabled || refreshing ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-normal)' }}
        onClick={unavailable ? undefined : onRefresh}
        aria-describedby={disabled && unavailableReason ? reasonId : undefined}
      >
        {!refreshing && <Icon name="refresh" size={16} aria-hidden="true" />}
      </Button>

      {disabled && unavailableReason != null && (
        <span id={reasonId} data-unavailable-reason style={{ flexBasis: '100%', color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>
          {unavailableReason}
        </span>
      )}
    </div>
  );
}
