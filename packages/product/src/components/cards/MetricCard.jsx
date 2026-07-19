import React from 'react';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';
import { StatusBadge } from '@lk-robotics/lds-core/components/content/StatusBadge';
import { Skeleton } from '@lk-robotics/lds-core/components/status/Skeleton';
import { VisuallyHidden } from '@lk-robotics/lds-core/components/layout/VisuallyHidden';

const CHANGE_COLOR = {
  positive: 'var(--color-semantic-status-positive-text)',
  negative: 'var(--color-semantic-status-negative-text)',
  cautionary: 'var(--color-semantic-status-cautionary-text)',
  neutral: 'var(--color-semantic-label-alternative)',
};

const CHANGE_LABEL = {
  positive: '개선',
  negative: '악화',
  cautionary: '주의',
  neutral: '중립',
};

function resolveDirection(delta, deltaTone, changeDirection) {
  if (changeDirection && changeDirection !== 'auto') return changeDirection;
  if (deltaTone !== 'auto') return deltaTone;
  return typeof delta === 'number' ? (delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat') : 'flat';
}

function resolveChangeTone(direction, changeTone) {
  if (changeTone) return changeTone;
  if (direction === 'up') return 'positive';
  if (direction === 'down') return 'negative';
  return 'neutral';
}

/**
 * LDS Product Data — MetricCard
 * A KPI tile: an uppercase label, a big tabular value, an optional delta chip
 * (up = steel-positive, down = brick-red) and a caption. For dashboards / stat
 * bands.
 */
export function MetricCard({
  label,
  value,
  unit,
  delta,
  deltaTone = 'auto',
  changeDirection = 'auto',
  changeTone,
  changeToneLabel,
  period,
  baseline,
  caption,
  lastUpdated,
  action,
  icon,
  loading = false,
  loadingLabel = '지표를 불러오는 중',
  empty = false,
  emptyLabel = '표시할 지표가 없습니다.',
  error,
  stale = false,
  staleLabel = '오래된 데이터',
  style,
  role = 'group',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...rest
}) {
  const direction = resolveDirection(delta, deltaTone, changeDirection);
  const semanticTone = resolveChangeTone(direction, changeTone);
  const deltaColor = CHANGE_COLOR[semanticTone] || CHANGE_COLOR.neutral;
  const deltaText = typeof delta === 'number' ? `${delta > 0 ? '+' : ''}${delta}%` : delta;
  const semanticLabel = changeToneLabel !== undefined
    ? changeToneLabel
    : changeTone
      ? CHANGE_LABEL[semanticTone]
      : null;
  const rawId = React.useId();
  const labelId = `${rawId}-label`;
  const hasError = error !== undefined && error !== null && error !== false;
  const errorContent = error === true ? '지표를 불러오지 못했습니다.' : error;
  const state = loading ? 'loading' : hasError ? 'error' : empty ? 'empty' : stale ? 'stale' : 'ready';
  const showFooter = !loading && (stale || lastUpdated != null || action != null);

  let body;
  if (loading) {
    body = (
      <div data-metric-resource-state="loading" role="status" aria-live="polite" style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <VisuallyHidden>{loadingLabel}</VisuallyHidden>
        <Skeleton width="58%" height={32} />
        <Skeleton variant="text" length="72%" height={12} />
      </div>
    );
  } else if (hasError) {
    body = (
      <div data-metric-resource-state="error" role="alert" style={{ minHeight: 58, display: 'flex', alignItems: 'center', color: 'var(--color-semantic-status-negative-text)', fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)', fontWeight: 'var(--fw-medium)' }}>
        {errorContent}
      </div>
    );
  } else if (empty) {
    body = (
      <div data-metric-resource-state="empty" role="status" style={{ minHeight: 58, display: 'flex', alignItems: 'center', color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)', fontWeight: 'var(--fw-medium)' }}>
        {emptyLabel}
      </div>
    );
  } else {
    body = (
      <div style={{ display: 'grid', gap: 'var(--space-2)', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', minWidth: 0, flexWrap: 'wrap' }}>
          <span data-metric-value style={{ minWidth: 0, fontSize: 'var(--title1-size)', fontWeight: 'var(--fw-extra)', letterSpacing: 0, color: 'var(--color-semantic-label-normal)', lineHeight: 1, fontVariantNumeric: 'tabular-nums', overflowWrap: 'anywhere' }}>{value}</span>
          {unit != null && <span style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--body2-size)', lineHeight: 'var(--body2-line)', fontWeight: 'var(--fw-semibold)' }}>{unit}</span>}
        </div>
        {(delta != null || period != null || baseline != null) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0, flexWrap: 'wrap' }}>
            {delta != null && (
              <span
                data-change-direction={direction}
                data-change-tone={semanticTone}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: deltaColor, fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)', fontWeight: 'var(--fw-bold)', whiteSpace: 'nowrap' }}
              >
                {(direction === 'up' || direction === 'down') && <Icon name={direction === 'up' ? 'arrow-up' : 'arrow-down'} size={14} aria-hidden="true" />}
                <span>{deltaText}</span>
                {semanticLabel != null && <span style={{ fontWeight: 'var(--fw-semibold)' }}>· {semanticLabel}</span>}
              </span>
            )}
            {period != null && <span data-metric-period style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)' }}>{period}</span>}
            {baseline != null && <span data-metric-baseline style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)' }}>기준 {baseline}</span>}
          </div>
        )}
        {caption != null && <div style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)', overflowWrap: 'anywhere' }}>{caption}</div>}
      </div>
    );
  }

  return (
    <div
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy || (!ariaLabel && label != null ? labelId : undefined)}
      aria-busy={loading || undefined}
      data-metric-state={state}
      style={{
        display: 'grid',
        alignContent: 'start',
        minWidth: 0,
        boxSizing: 'border-box',
        background: 'var(--component-card-bg)',
        border: 'var(--component-card-border)',
        borderRadius: 'var(--component-card-radius)',
        padding: '22px 24px',
        boxShadow: 'var(--shadow-xs)',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, minWidth: 0, marginBottom: 14 }}>
        {label != null && <span id={labelId} style={{ minWidth: 0, fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', fontWeight: 'var(--fw-bold)', letterSpacing: '1.4px', textTransform: 'uppercase', overflowWrap: 'anywhere', color: 'var(--color-semantic-label-alternative)' }}>{label}</span>}
        {icon && <span style={{ color: 'var(--color-semantic-primary-normal)', display: 'inline-flex' }}>{icon}</span>}
      </div>
      {body}
      {showFooter && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', minWidth: 0, flexWrap: 'wrap', marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--color-semantic-line-normal-alternative)' }}>
          {(stale || lastUpdated != null) && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0, flexWrap: 'wrap' }}>
              {stale && <StatusBadge tone="cautionary">{staleLabel}</StatusBadge>}
              {lastUpdated != null && (
                <span data-metric-last-updated style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', overflowWrap: 'anywhere' }}>
                  <VisuallyHidden>마지막 업데이트 </VisuallyHidden>
                  {lastUpdated}
                </span>
              )}
            </div>
          )}
          {action != null && <div style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 'auto' }}>{action}</div>}
        </div>
      )}
    </div>
  );
}
