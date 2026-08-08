import React from 'react';
import { Button } from '@lk-design-system/lds-core/components/buttons/Button';
import { IconButton } from '@lk-design-system/lds-core/components/buttons/IconButton';
import { StatusBadge } from '@lk-design-system/lds-core/components/content/StatusBadge';
import { Icon } from '@lk-design-system/lds-core/components/icon/Icon';
import { VisuallyHidden } from '@lk-design-system/lds-core/components/layout/VisuallyHidden';
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

/**
 * Per-file display of upload/conversion items. Selection always stays in
 * FileUpload — this component never opens a picker.
 *
 * The name comes from the processing queue, but `layout` covers two surfaces
 * that differ in WHERE they sit, not just how they look:
 *   - `list` — a bordered status panel for documents, watched on its own.
 *   - `grid` — a chromeless media strip that is part of a form field.
 * The status vocabulary, progress, retry/cancel/remove semantics and accessible
 * names are identical in both.
 *
 * `trigger` (grid only) is a PLACEMENT slot, not selection logic: the picker
 * control the product passes must still be wired to FileUpload. It exists
 * because the trigger and the thumbnails have to wrap as one row, which is
 * impossible if the trigger lives outside this component.
 */
export function FileUploadQueue({
  items = [],
  title = '파일 처리',
  emptyLabel = '처리할 파일이 없습니다.',
  layout = 'list',
  trigger,
  onRetry,
  onCancel,
  onRemove,
  onOpen,
  className,
  style,
  ...rest
}) {
  const isGrid = layout === 'grid';
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
        containerType: 'inline-size',
        color: 'var(--color-semantic-label-normal)',
        fontFamily: 'var(--font-sans)',
        // The media strip is an input that sits inline in a form, so it carries
        // no panel chrome. The document queue stays a bordered status panel, and
        // it keeps `overflow: hidden` — which the strip must not have, or the
        // corner controls that straddle each tile would be clipped.
        ...(isGrid ? null : {
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid var(--color-semantic-line-normal-normal)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--color-semantic-background-elevated-normal)',
        }),
        ...style,
      }}
      {...rest}
    >
      <style>
        {`@container (max-width: 360px) {
          .lk-file-upload-queue__item--list {
            grid-template-columns: 36px minmax(0, 1fr) !important;
            padding: var(--space-3) !important;
          }
          .lk-file-upload-queue__item--list .lk-file-upload-queue__actions {
            grid-column: 2;
            justify-self: end !important;
            justify-content: flex-end !important;
            margin-top: var(--space-1);
          }
        }`}
      </style>

      {/*
        One live region for both layouts, mounted unconditionally. A live region has to
        exist before the announcement it carries, so putting a copy inside each layout
        branch would drop whatever changed in the same render that switched layouts.
        A live announcement is built from the region's text content, so an aria-label
        here would only be a second, silently ignored copy of the same sentence.
      */}
      <VisuallyHidden
        className="lk-file-upload-queue__live-summary"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {summaryLabel}
      </VisuallyHidden>

      {/* Frameless strip: the section keeps its accessible name but shows no title bar. */}
      {isGrid ? null : (
        <header style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-semantic-line-normal-normal)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '36px minmax(0, 1fr)', gap: 'var(--space-3)', alignItems: 'center' }}>
            <Icon name="document" size={22} color="var(--color-semantic-label-neutral)" aria-hidden="true" />
            <div style={{ minWidth: 0 }}>
              <strong style={{ color: 'var(--color-semantic-label-strong)', fontSize: 'var(--body1-size)', lineHeight: 'var(--body1-line)', fontWeight: 'var(--fw-bold)' }}>{title}</strong>
            </div>
          </div>
        </header>
      )}

      {items.length === 0 && !(isGrid && trigger != null) ? (
        <div className="lk-file-upload-queue__empty" role="status" style={{ flex: '1 1 auto', display: 'grid', placeItems: 'center', minHeight: 'var(--space-16)', boxSizing: 'border-box', padding: 'var(--space-6) var(--space-4)', color: 'var(--color-semantic-label-neutral)', textAlign: 'center', fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)' }}>
          <span>{emptyLabel}</span>
        </div>
      ) : (
        <ul
          style={isGrid
            ? { margin: 0, padding: 'var(--space-2)', listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }
            : { margin: 0, padding: 0, listStyle: 'none' }}
        >
          {/* The picker leads the strip. It is a control, not an attachment, so
              it is presentational here and the real selection stays in FileUpload. */}
          {isGrid && trigger != null && (
            <li role="presentation" style={{ width: 88, flexShrink: 0 }}>{trigger}</li>
          )}
          {items.map((item, index) => {
            const meta = STATUS_META[item.status] || STATUS_META.queued;
            const busy = item.status === 'uploading' || item.status === 'processing';
            const canRemove = !busy && typeof onRemove === 'function';
            const hasActions = (item.status === 'failed' && onRetry)
              || (item.status === 'succeeded' && onOpen)
              || (busy && onCancel)
              || canRemove;

            // Both layouts offer the same actions with the same accessible
            // names; only their placement differs.
            const actionsNode = hasActions ? (
              <div className="lk-file-upload-queue__actions" style={{ alignSelf: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', justifySelf: 'end', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
                {item.status === 'failed' && onRetry && <Button variant="ghost" size="sm" aria-label={`${item.name} 다시 시도`} onClick={() => onRetry(item)}>다시 시도</Button>}
                {item.status === 'succeeded' && onOpen && <Button variant="ghost" size="sm" aria-label={`${item.name} 열기`} onClick={() => onOpen(item)}>열기</Button>}
                {busy && onCancel && <Button variant="ghost" size="sm" aria-label={`${item.name} 처리 취소`} onClick={() => onCancel(item)}>취소</Button>}
                {canRemove && <Button variant="flat" size="sm" aria-label={`${item.name} ${item.status === 'succeeded' ? '목록에서 제거' : '제거'}`} onClick={() => onRemove(item)}>제거</Button>}
              </div>
            ) : null;

            if (isGrid) {
              // A media tile is identified by its picture, so the filename and
              // status stay out of the visual strip and are carried for screen
              // readers instead. Controls sit ON the tile: the corner control
              // cancels while busy and removes otherwise, and a failed tile
              // offers retry over an error scrim.
              const cornerAction = busy && onCancel
                ? { label: `${item.name} 처리 취소`, onClick: () => onCancel(item) }
                : canRemove
                  ? { label: `${item.name} ${item.status === 'succeeded' ? '목록에서 제거' : '제거'}`, onClick: () => onRemove(item) }
                  : null;

              // An attachment is shown by whatever identifies it: a photo is its
              // own label, so it becomes a bare square; a document is known by
              // its name, so it becomes a chip carrying name and size.
              const isMedia = item.thumbnailSrc != null;

              if (!isMedia) {
                return (
                  <li
                    key={item.id}
                    className="lk-file-upload-queue__item lk-file-upload-queue__item--grid lk-file-upload-queue__item--file"
                    style={{ position: 'relative', minWidth: 0, maxWidth: 260 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', height: 88, boxSizing: 'border-box', padding: 'var(--space-3)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-background-elevated-normal)', minWidth: 0 }}>
                      <span aria-hidden="true" style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-fill-normal)', color: 'var(--color-semantic-label-neutral)', display: 'grid', placeItems: 'center' }}>
                        <Icon name="document" size={22} aria-hidden="true" />
                      </span>
                      <div style={{ minWidth: 0, display: 'grid', gap: 'var(--space-1)' }}>
                        <strong style={{ minWidth: 0, color: 'var(--color-semantic-label-normal)', fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden', wordBreak: 'break-all' }}>
                          {item.name}
                        </strong>
                        {busy ? (
                          <ProgressBar
                            aria-label={`${item.name} ${meta.label}`}
                            value={item.progress}
                            indeterminate={item.progress == null}
                            size="sm"
                            tone="signal"
                          />
                        ) : (item.message != null || item.sizeLabel != null) && (
                          <span style={{ color: item.status === 'failed' ? 'var(--color-semantic-status-negative-text)' : 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>
                            {item.message ?? item.sizeLabel}
                          </span>
                        )}
                      </div>
                      {/* `plain`: this action sits inside the row, and the row is
                          already a bounded card with its own border and elevated
                          background. A hairline box here is a box inside a box.
                          The corner actions below keep `ghost` because they float
                          over the thumbnail and have no surface backing them. */}
                      {item.status === 'failed' && onRetry && (
                        <IconButton variant="plain" round size="sm" label={`${item.name} 다시 시도`} onClick={() => onRetry(item)} style={{ flexShrink: 0 }}>
                          <Icon name="refresh" size={16} aria-hidden="true" />
                        </IconButton>
                      )}
                    </div>
                    {cornerAction && (
                      <span style={{ position: 'absolute', top: 'calc(-1 * var(--space-2))', right: 'calc(-1 * var(--space-2))' }}>
                        <IconButton variant="ghost" round size="sm" label={cornerAction.label} onClick={cornerAction.onClick} style={{ boxShadow: 'var(--shadow-md)' }}>
                          <Icon name="close" size={14} aria-hidden="true" />
                        </IconButton>
                      </span>
                    )}
                    {/* Name and size are visible on a chip; only the status word is not. */}
                    <VisuallyHidden>{item.label ?? meta.label}</VisuallyHidden>
                  </li>
                );
              }

              return (
                <li
                  key={item.id}
                  className="lk-file-upload-queue__item lk-file-upload-queue__item--grid lk-file-upload-queue__item--media"
                  style={{ position: 'relative', width: 88, minWidth: 0 }}
                >
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--color-semantic-fill-normal)', display: 'grid', placeItems: 'center', color: 'var(--color-semantic-label-neutral)' }}>
                    <img src={item.thumbnailSrc} alt="" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {busy && (
                      <div style={{ position: 'absolute', inset: 0, display: 'grid', alignContent: 'center', gap: 'var(--space-1)', padding: 'var(--space-3)', background: 'var(--scrim-dark)' }}>
                        <ProgressBar
                          aria-label={`${item.name} ${meta.label}`}
                          value={item.progress}
                          indeterminate={item.progress == null}
                          size="sm"
                          tone="signal"
                          style={{ width: '100%' }}
                        />
                      </div>
                    )}
                    {item.status === 'failed' && (
                      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'var(--scrim-dark)' }}>
                        {onRetry && (
                          <IconButton variant="on-dark" round size="sm" label={`${item.name} 다시 시도`} onClick={() => onRetry(item)}>
                            <Icon name="refresh" size={16} aria-hidden="true" />
                          </IconButton>
                        )}
                      </div>
                    )}
                    {item.primary && (
                      <span style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 'var(--space-1)', background: 'var(--scrim-dark)', color: 'var(--color-semantic-static-white)', fontSize: 'var(--caption1-size)', fontWeight: 'var(--fw-bold)', textAlign: 'center' }}>
                        {item.primaryLabel ?? '대표'}
                      </span>
                    )}
                  </div>
                  {/* The remove/cancel control straddles the corner so it never
                      covers the picture it belongs to. */}
                  {cornerAction && (
                    <span style={{ position: 'absolute', top: 'calc(-1 * var(--space-2))', right: 'calc(-1 * var(--space-2))' }}>
                      <IconButton variant="ghost" round size="sm" label={cornerAction.label} onClick={cornerAction.onClick} style={{ boxShadow: 'var(--shadow-md)' }}>
                        <Icon name="close" size={14} aria-hidden="true" />
                      </IconButton>
                    </span>
                  )}
                  <VisuallyHidden>
                    {`${item.name}, ${item.label ?? meta.label}${item.message != null ? `, ${item.message}` : ''}`}
                  </VisuallyHidden>
                </li>
              );
            }

            return (
              <li
                key={item.id}
                className="lk-file-upload-queue__item lk-file-upload-queue__item--list"
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
                    {!busy && (item.sizeLabel != null || item.message != null) && (
                      <span style={{ color: item.status === 'failed' ? 'var(--color-semantic-status-negative-text)' : 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>
                        {item.message ?? item.sizeLabel}
                      </span>
                    )}
                  </div>
                  {busy && (
                    <ProgressBar
                      className="lk-file-upload-queue__progress"
                      aria-label={`${item.name} ${meta.label}`}
                      label={item.message ?? meta.label}
                      showValue={item.progress != null}
                      value={item.progress}
                      indeterminate={item.progress == null}
                      size="md"
                      tone="signal"
                      style={{ minWidth: 0 }}
                    />
                  )}
                </div>
                {actionsNode}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
