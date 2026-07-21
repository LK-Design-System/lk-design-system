import React from 'react';
import { Button } from '@lk-robotics/lds-core/components/buttons/Button';
import { StatusBadge } from '@lk-robotics/lds-core/components/content/StatusBadge';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';
import { VisuallyHidden } from '@lk-robotics/lds-core/components/layout/VisuallyHidden';
import { ProgressBar } from '../status/ProgressBar.jsx';

const STATUS_META = {
  queued: { label: '대기', tone: 'offline' },
  uploading: { label: '업로드 중', tone: 'signal' },
  processing: { label: '처리 중', tone: 'signal' },
  succeeded: { label: '완료', tone: 'positive' },
  failed: { label: '실패', tone: 'negative' },
};

function queueSummary(items) {
  const groups = [
    { key: 'queued', label: '대기', tone: 'offline', count: items.filter((item) => item.status === 'queued').length },
    { key: 'active', label: '진행', tone: 'signal', count: items.filter((item) => item.status === 'uploading' || item.status === 'processing').length },
    { key: 'succeeded', label: '완료', tone: 'positive', count: items.filter((item) => item.status === 'succeeded').length },
    { key: 'failed', label: '실패', tone: 'negative', count: items.filter((item) => item.status === 'failed').length },
  ];
  return groups.filter((group) => group.count > 0);
}

/** Per-file upload and conversion queue. File selection remains in FileUpload. */
export function FileUploadQueue({
  items = [],
  title = '파일 처리',
  emptyLabel = '처리할 파일이 없습니다.',
  onRetry,
  onCancel,
  onRemove,
  onOpen,
  className,
  style,
  ...rest
}) {
  const summary = queueSummary(items);
  const summaryLabel = summary.length > 0
    ? summary.map((group) => `${group.label} ${group.count}개`).join(', ')
    : '파일 없음';

  return (
    <section
      aria-label={typeof title === 'string' ? title : '파일 처리'}
      className={['lk-file-upload-queue', className].filter(Boolean).join(' ')}
      style={{
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
        containerType: 'inline-size',
        border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-semantic-background-elevated-normal)',
        color: 'var(--color-semantic-label-normal)',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      <style>
        {`@container (max-width: 520px) {
          .lk-file-upload-queue__item {
            grid-template-columns: 36px minmax(0, 1fr) !important;
            padding: var(--space-3) !important;
          }
          .lk-file-upload-queue__actions {
            grid-column: 2;
            justify-self: end !important;
            justify-content: flex-end !important;
            margin-top: var(--space-1);
          }
        }`}
      </style>

      <header style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-semantic-line-normal-normal)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '36px minmax(0, 1fr)', gap: 'var(--space-3)', alignItems: 'center' }}>
          <Icon name="document" size={22} color="var(--color-semantic-label-neutral)" aria-hidden="true" />
          <div style={{ minWidth: 0 }}>
            <strong style={{ color: 'var(--color-semantic-label-strong)', fontSize: 'var(--body1-size)', lineHeight: 'var(--body1-line)', fontWeight: 'var(--fw-bold)' }}>{title}</strong>
            <VisuallyHidden
              className="lk-file-upload-queue__live-summary"
              role="status"
              aria-live="polite"
              aria-atomic="true"
              aria-label={summaryLabel}
            >
              {summaryLabel}
            </VisuallyHidden>
          </div>
        </div>
      </header>

      {items.length === 0 ? (
        <div role="status" style={{ padding: 'var(--space-6) var(--space-4)', color: 'var(--color-semantic-label-neutral)', textAlign: 'center', fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)' }}>
          {emptyLabel}
        </div>
      ) : (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {items.map((item, index) => {
            const meta = STATUS_META[item.status] || STATUS_META.queued;
            const busy = item.status === 'uploading' || item.status === 'processing';
            const progressPercent = item.progress != null
              ? Math.max(0, Math.min(100, Math.round(item.progress)))
              : null;
            const canRemove = !busy && typeof onRemove === 'function';
            const hasActions = (item.status === 'failed' && onRetry)
              || (item.status === 'succeeded' && onOpen)
              || (busy && onCancel)
              || canRemove;

            return (
              <li
                key={item.id}
                className="lk-file-upload-queue__item"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '36px minmax(0, 1fr) auto',
                  columnGap: 'var(--space-3)',
                  rowGap: 'var(--space-2)',
                  alignItems: 'center',
                  minHeight: 64,
                  padding: 'var(--space-3) var(--space-4)',
                  boxSizing: 'border-box',
                  borderTop: index > 0 ? '1px solid var(--color-semantic-line-normal-alternative)' : 'none',
                }}
              >
                <span className="lk-file-upload-queue__file-icon" aria-hidden="true" style={{ alignSelf: 'start', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 'var(--radius-md)', color: 'var(--color-semantic-label-neutral)', background: 'var(--color-semantic-fill-normal)' }}>
                  <Icon name="document" size={18} aria-hidden="true" />
                </span>
                <div style={{ display: 'grid', gap: 'var(--space-1)', minWidth: 0 }}>
                  <div style={{ display: 'grid', gap: 'var(--space-1)', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0, flexWrap: 'wrap' }}>
                      <strong style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-semantic-label-normal)', fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)' }}>{item.name}</strong>
                      <StatusBadge tone={meta.tone} style={{ flexShrink: 0 }}>{item.label ?? meta.label}</StatusBadge>
                    </div>
                    {(item.sizeLabel != null || item.message != null) && (
                      <span style={{ color: item.status === 'failed' ? 'var(--color-semantic-status-negative-text)' : 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>
                        {item.message ?? item.sizeLabel}
                      </span>
                    )}
                  </div>
                  {busy && (
                    <div style={{ display: 'grid', gridTemplateColumns: item.progress != null ? 'minmax(96px, 1fr) auto' : 'minmax(96px, 1fr)', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0 }}>
                      <ProgressBar
                        aria-label={`${item.name} ${meta.label}`}
                        value={item.progress}
                        indeterminate={item.progress == null}
                        size="md"
                        tone="signal"
                        style={{ minWidth: 0 }}
                      />
                      {item.progress != null && (
                        <span aria-hidden="true" style={{ minWidth: 'var(--space-8)', textAlign: 'right', color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', fontWeight: 'var(--fw-semibold)', fontVariantNumeric: 'tabular-nums' }}>
                          {progressPercent}%
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {hasActions && (
                  <div className="lk-file-upload-queue__actions" style={{ alignSelf: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', justifySelf: 'end', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
                    {item.status === 'failed' && onRetry && <Button variant="ghost" size="sm" aria-label={`${item.name} 다시 시도`} onClick={() => onRetry(item)}>다시 시도</Button>}
                    {item.status === 'succeeded' && onOpen && <Button variant="ghost" size="sm" aria-label={`${item.name} 열기`} onClick={() => onOpen(item)}>열기</Button>}
                    {busy && onCancel && <Button variant="ghost" size="sm" aria-label={`${item.name} 처리 취소`} onClick={() => onCancel(item)}>취소</Button>}
                    {canRemove && <Button variant="flat" size="sm" aria-label={`${item.name} ${item.status === 'succeeded' ? '목록에서 제거' : '제거'}`} onClick={() => onRemove(item)}>제거</Button>}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
