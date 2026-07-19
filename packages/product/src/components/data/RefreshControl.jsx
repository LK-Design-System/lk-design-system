import React from 'react';
import { Button } from '@lk-robotics/lds-core/components/buttons/Button';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';
import { Select } from '@lk-robotics/lds-core/components/forms/Select';

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
      <Button
        type="button"
        size={size}
        variant="ghost"
        loading={refreshing}
        loadingLabel={`${refreshLabel} 중`}
        disabled={refreshDisabled}
        style={{ color: refreshDisabled || refreshing ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-normal)' }}
        onClick={unavailable ? undefined : onRefresh}
        aria-describedby={disabled && unavailableReason ? reasonId : undefined}
      >
        {!refreshing && <Icon name="refresh" size={16} aria-hidden="true" />}
        {refreshLabel}
      </Button>

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

      {lastUpdated != null && (
        <span data-refresh-freshness style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', minWidth: 0, color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>
          <Icon name="history" size={15} aria-hidden="true" style={{ flexShrink: 0 }} />
          <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{lastUpdatedLabel}: {lastUpdated}</span>
        </span>
      )}

      {disabled && unavailableReason != null && (
        <span id={reasonId} data-unavailable-reason style={{ flexBasis: '100%', color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>
          {unavailableReason}
        </span>
      )}
    </div>
  );
}
