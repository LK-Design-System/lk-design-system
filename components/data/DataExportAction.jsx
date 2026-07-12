import React from 'react';
import { Button } from '../buttons/Button.jsx';
import { Icon } from '../icon/Icon.jsx';
import { Select } from '../forms/Select.jsx';
import { ProgressBar } from '../status/ProgressBar.jsx';

const DEFAULT_FORMATS = [
  { value: 'csv', label: 'CSV' },
  { value: 'xlsx', label: 'Excel' },
];

function defaultScopes(selectedCount, totalCount) {
  const scopes = [{ value: 'currentPage', label: '현재 페이지' }];
  if (selectedCount > 0) scopes.push({ value: 'selected', label: `선택한 ${selectedCount}개` });
  if (totalCount != null) scopes.push({ value: 'allMatching', label: `전체 ${totalCount}개 결과` });
  return scopes;
}

/**
 * LK Product Extension — DataExportAction
 * Controls export format/scope presentation and async status. Products own
 * authorization decisions, job creation and download delivery.
 */
export function DataExportAction({
  formats = DEFAULT_FORMATS,
  formatValue,
  defaultFormatValue,
  onFormatChange,
  scopeValue,
  defaultScopeValue = 'currentPage',
  scopeOptions,
  onScopeChange,
  selectedCount = 0,
  totalCount,
  onExport,
  state = 'idle',
  progress,
  successMessage = '내보내기를 준비했습니다.',
  errorMessage = '내보내기를 완료하지 못했습니다.',
  allowed = true,
  unavailableBehavior = 'disabled',
  unavailableReason = '이 작업을 실행할 권한이 없습니다.',
  exportLabel = '내보내기',
  size = 'sm',
  style,
  ...rest
}) {
  const formatControlled = formatValue !== undefined;
  const scopeControlled = scopeValue !== undefined;
  const [internalFormat, setInternalFormat] = React.useState(defaultFormatValue ?? formats[0]?.value ?? 'csv');
  const [internalScope, setInternalScope] = React.useState(defaultScopeValue);
  const requestedFormat = formatControlled ? formatValue : internalFormat;
  const requestedScope = scopeControlled ? scopeValue : internalScope;
  const format = formats.some((option) => option.value === requestedFormat)
    ? requestedFormat
    : (formats[0]?.value ?? '');
  const scopes = Array.isArray(scopeOptions) && scopeOptions.length > 0
    ? scopeOptions
    : defaultScopes(selectedCount, totalCount);
  const scope = scopes.some((option) => option.value === requestedScope)
    ? requestedScope
    : (scopes[0]?.value ?? '');
  const reasonId = React.useId();
  const statusId = React.useId();
  const processing = state === 'processing';
  const exportUnavailable = !allowed || processing || !format || !scope || typeof onExport !== 'function';

  React.useEffect(() => {
    if (!formatControlled && internalFormat !== format) setInternalFormat(format);
  }, [format, formatControlled, internalFormat]);

  React.useEffect(() => {
    if (!scopeControlled && internalScope !== scope) setInternalScope(scope);
  }, [internalScope, scope, scopeControlled]);

  if (!allowed && unavailableBehavior === 'hidden') return null;

  const setFormat = (next) => {
    if (!formatControlled) setInternalFormat(next);
    onFormatChange?.(next);
  };
  const setScope = (next) => {
    if (!scopeControlled) setInternalScope(next);
    onScopeChange?.(next);
  };

  return (
    <div
      role="group"
      aria-label="데이터 내보내기"
      aria-describedby={[!allowed ? reasonId : null, state === 'success' || state === 'error' ? statusId : null].filter(Boolean).join(' ') || undefined}
      style={{ display: 'grid', gap: 'var(--space-2)', minWidth: 0, fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', minWidth: 0 }}>
        <Select
          value={format}
          onChange={setFormat}
          options={formats}
          size={size}
          disabled={!allowed || processing}
          aria-label="내보내기 형식"
          style={{ width: 118 }}
        />
        <Select
          value={scope}
          onChange={setScope}
          options={scopes}
          size={size}
          disabled={!allowed || processing}
          aria-label="내보내기 범위"
          style={{ width: 176 }}
        />
        <Button
          type="button"
          size={size}
          variant="ghost"
          disabled={!allowed || typeof onExport !== 'function' || !format || !scope}
          loading={processing}
          loadingLabel={`${exportLabel} 처리 중`}
          aria-describedby={!allowed ? reasonId : undefined}
          style={{ color: exportUnavailable ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-normal)' }}
          onClick={() => !exportUnavailable && onExport({ format, scope })}
        >
          {!processing && <Icon name="download" size={16} aria-hidden="true" />}
          {exportLabel}
        </Button>
      </div>

      {processing && (
        <ProgressBar
          value={typeof progress === 'number' ? progress : 0}
          indeterminate={typeof progress !== 'number'}
          size="sm"
          label={`${exportLabel} 처리 중`}
          showValue={typeof progress === 'number'}
        />
      )}

      {!allowed && unavailableReason != null && (
        <span id={reasonId} data-unavailable-reason style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 'var(--space-1)', color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>
          <Icon name="lock" size={15} aria-hidden="true" style={{ flexShrink: 0 }} />
          <span>{unavailableReason}</span>
        </span>
      )}

      {(state === 'success' || state === 'error') && (
        <span id={statusId} role={state === 'error' ? 'alert' : 'status'} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', color: state === 'error' ? 'var(--color-semantic-status-negative-text)' : 'var(--color-semantic-status-positive-text)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>
          <Icon name={state === 'error' ? 'circle-close-fill' : 'circle-check-fill'} size={15} aria-hidden="true" />
          <span>{state === 'error' ? errorMessage : successMessage}</span>
        </span>
      )}
    </div>
  );
}
