import React from 'react';
import { Button } from '../buttons/Button.jsx';
import { SourceDisclosure } from '../content/SourceDisclosure.jsx';

const ROLE_LABELS = {
  user: '사용자',
  assistant: 'AI 어시스턴트',
  'human-agent': '상담원',
  system: '시스템',
};

const LIFECYCLE_LABELS = {
  delivery: {
    queued: '전송 대기 중',
    sending: '전송 중',
    sent: '전송됨',
    failed: '전송 실패',
    cancelled: '전송 취소',
  },
  response: {
    pending: '응답 대기 중',
    streaming: '응답 생성 중',
    stopping: '중단 요청 중',
    complete: '응답 완료',
    cancelled: '응답 취소',
    failed: '응답 실패',
  },
};

const VISUALLY_HIDDEN_STYLE = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

function normalizeLifecycle(lifecycle) {
  if (lifecycle?.kind === 'delivery' && LIFECYCLE_LABELS.delivery[lifecycle.state]) {
    return lifecycle;
  }
  if (lifecycle?.kind === 'response' && LIFECYCLE_LABELS.response[lifecycle.state]) {
    return lifecycle;
  }
  return { kind: 'static' };
}

function surfaceRadius(groupPosition) {
  if (groupPosition === 'first') {
    return 'var(--radius-lg) var(--radius-lg) var(--radius-md) var(--radius-md)';
  }
  if (groupPosition === 'middle') return 'var(--radius-md)';
  if (groupPosition === 'last') {
    return 'var(--radius-md) var(--radius-md) var(--radius-lg) var(--radius-lg)';
  }
  return 'var(--radius-lg)';
}

function lifecycleTone(kind, state) {
  if (state === 'failed') return 'var(--color-semantic-status-negative)';
  if (kind === 'response' && ['pending', 'streaming', 'stopping'].includes(state)) {
    return 'var(--color-semantic-primary-normal)';
  }
  if (kind === 'delivery' && ['queued', 'sending'].includes(state)) {
    return 'var(--color-semantic-primary-normal)';
  }
  return 'var(--color-semantic-label-alternative)';
}

/**
 * A single product conversation entry. ConversationMessage renders message
 * identity, content, optional evidence and lifecycle actions, while a parent
 * MessageFeed owns log/live-region behavior and transport state updates.
 */
export function ConversationMessage({
  direction = 'inbound',
  authorRole = 'assistant',
  groupPosition = 'single',
  lifecycle = { kind: 'static' },
  author,
  authorLabel,
  avatar,
  timestamp,
  dateTime,
  statusLabel,
  attachments,
  sources,
  actions,
  onRetry,
  onStop,
  retryLabel = '메시지 다시 보내기',
  stopLabel = '응답 생성 중단',
  children,
  className,
  style,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  ...rest
}) {
  const authorId = React.useId();
  const roleId = React.useId();
  const resolvedLifecycle = normalizeLifecycle(lifecycle);
  const lifecycleKind = resolvedLifecycle.kind;
  const lifecycleState = lifecycleKind === 'static' ? undefined : resolvedLifecycle.state;
  const systemDirection = direction === 'system';
  const outbound = direction === 'outbound';
  const identityVisible = !systemDirection && (groupPosition === 'single' || groupPosition === 'first');
  const showAvatar = identityVisible && avatar != null;
  const contentColumn = systemDirection ? '1' : outbound ? '1' : '2';
  const gridTemplateColumns = systemDirection
    ? 'minmax(0, 1fr)'
    : outbound
      ? 'minmax(0, 1fr) 32px'
      : '32px minmax(0, 1fr)';
  const busy = lifecycleKind === 'response'
    && ['pending', 'streaming', 'stopping'].includes(lifecycleState);
  const canRetry = lifecycleState === 'failed'
    && (lifecycleKind === 'delivery' || lifecycleKind === 'response')
    && typeof onRetry === 'function';
  const canStop = lifecycleKind === 'response'
    && ['pending', 'streaming'].includes(lifecycleState)
    && typeof onStop === 'function';
  const resolvedStatusLabel = statusLabel
    ?? (lifecycleKind === 'static' ? null : LIFECYCLE_LABELS[lifecycleKind][lifecycleState]);
  const hasActions = actions != null || canRetry || canStop;
  const lifecycleColor = lifecycleTone(lifecycleKind, lifecycleState);
  const resolvedAriaLabelledby = ariaLabel || ariaLabelledby
    ? ariaLabelledby
    : `${authorId} ${roleId}`;

  const commonPartStyle = {
    gridColumn: contentColumn,
    minWidth: 0,
    width: '100%',
    maxWidth: 'min(42rem, 100%)',
    justifySelf: systemDirection ? 'stretch' : outbound ? 'end' : 'start',
    boxSizing: 'border-box',
  };

  const bodySurfaceStyle = systemDirection
    ? {
        ...commonPartStyle,
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        maxWidth: '100%',
        color: 'var(--color-semantic-label-neutral)',
        fontSize: 'var(--caption1-size)',
        lineHeight: 'var(--caption1-line)',
        textAlign: 'center',
      }
    : {
        ...commonPartStyle,
        padding: 'var(--space-3) var(--space-4)',
        overflowWrap: 'anywhere',
        wordBreak: 'break-word',
        color: 'var(--color-semantic-label-normal)',
        background: outbound
          ? 'var(--color-semantic-primary-surface-normal)'
          : 'var(--color-semantic-background-elevated-normal)',
        border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: surfaceRadius(groupPosition),
        boxShadow: outbound ? 'none' : 'var(--shadow-xs)',
        fontSize: 'var(--body2-size)',
        lineHeight: 'var(--body2-line)',
      };

  return (
    <article
      {...rest}
      aria-label={ariaLabel}
      aria-labelledby={resolvedAriaLabelledby}
      aria-busy={busy || undefined}
      className={['lk-conversation-message', className].filter(Boolean).join(' ')}
      data-direction={direction}
      data-author-role={authorRole}
      data-group-position={groupPosition}
      data-lifecycle-kind={lifecycleKind}
      data-lifecycle-state={lifecycleState}
      style={{
        display: 'grid',
        gridTemplateColumns,
        columnGap: systemDirection ? 0 : 'var(--space-2)',
        rowGap: 'var(--space-2)',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        color: 'var(--color-semantic-label-normal)',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
    >
      <div
        data-message-part="identity"
        data-visually-hidden={identityVisible ? undefined : 'true'}
        style={identityVisible
          ? {
              gridColumn: '1 / -1',
              display: 'grid',
              gridTemplateColumns,
              columnGap: 'var(--space-2)',
              alignItems: 'center',
              minWidth: 0,
            }
          : VISUALLY_HIDDEN_STYLE}
      >
        {showAvatar && (
          <span
            aria-hidden="true"
            data-message-avatar
            style={{
              gridColumn: outbound ? '2' : '1',
              gridRow: 1,
              display: 'grid',
              placeItems: 'center',
              width: 32,
              height: 32,
              overflow: 'hidden',
              borderRadius: 'var(--radius-pill)',
            }}
          >
            {avatar}
          </span>
        )}
        <span
          style={identityVisible
            ? {
                gridColumn: outbound ? '1' : '2',
                gridRow: 1,
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: outbound ? 'flex-end' : 'flex-start',
                gap: 'var(--space-2)',
                minWidth: 0,
                textAlign: outbound ? 'right' : 'left',
              }
            : undefined}
        >
          <strong
            id={authorId}
            aria-label={authorLabel}
            style={{
              color: 'var(--color-semantic-label-strong)',
              fontSize: 'var(--label1-size)',
              lineHeight: 'var(--label1-line)',
              fontWeight: 'var(--fw-semibold)',
              overflowWrap: 'anywhere',
            }}
          >
            {author}
          </strong>
          <span id={roleId} style={VISUALLY_HIDDEN_STYLE}>
            {ROLE_LABELS[authorRole] ?? authorRole}
          </span>
          {timestamp != null && (
            <time
              dateTime={dateTime}
              style={{
                flexShrink: 0,
                color: 'var(--color-semantic-label-alternative)',
                fontSize: 'var(--caption2-size)',
                lineHeight: 'var(--caption2-line)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {timestamp}
            </time>
          )}
        </span>
      </div>

      {systemDirection ? (
        <div data-message-part="body" data-message-surface style={bodySurfaceStyle}>
          <span aria-hidden="true" style={{ flex: '1 1 0', minWidth: 'var(--space-4)', height: 1, background: 'var(--color-semantic-line-normal-alternative)' }} />
          <div style={{ minWidth: 0, maxWidth: 'min(42rem, calc(100% - 64px))', overflowWrap: 'anywhere' }}>
            {children}
          </div>
          <span aria-hidden="true" style={{ flex: '1 1 0', minWidth: 'var(--space-4)', height: 1, background: 'var(--color-semantic-line-normal-alternative)' }} />
        </div>
      ) : (
        <div data-message-part="body" data-message-surface style={bodySurfaceStyle}>
          {children}
        </div>
      )}

      {attachments != null && (
        <div data-message-part="attachments" style={commonPartStyle}>
          {attachments}
        </div>
      )}

      {Array.isArray(sources) && sources.length > 0 && (
        <div data-message-part="sources" style={commonPartStyle}>
          <SourceDisclosure headingLevel={3} sources={sources} />
        </div>
      )}

      {resolvedStatusLabel != null && (
        <p
          data-message-part="status"
          style={{
            ...commonPartStyle,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: systemDirection ? 'center' : outbound ? 'flex-end' : 'flex-start',
            gap: 'var(--space-1)',
            margin: 0,
            // Keep the failure signal on the graphic dot (3:1 non-text contrast is met)
            // and give the small status text a readable label color: status-negative on
            // white is only 3.44:1, below the 4.5:1 required for 11px text.
            color: lifecycleState === 'failed'
              ? 'var(--color-semantic-label-normal)'
              : 'var(--color-semantic-label-alternative)',
            fontSize: 'var(--caption2-size)',
            lineHeight: 'var(--caption2-line)',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 6,
              height: 6,
              flexShrink: 0,
              borderRadius: 'var(--radius-pill)',
              background: lifecycleColor,
            }}
          />
          {resolvedStatusLabel}
        </p>
      )}

      {hasActions && (
        <div
          data-message-part="actions"
          role="group"
          aria-label="메시지 동작"
          style={{
            ...commonPartStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: systemDirection ? 'center' : outbound ? 'flex-end' : 'flex-start',
            gap: 'var(--space-2)',
            flexWrap: 'wrap',
          }}
        >
          {actions}
          {canRetry && (
            <Button size="sm" variant="ghost" onClick={() => onRetry()}>
              {retryLabel}
            </Button>
          )}
          {canStop && (
            <Button size="sm" variant="ghost" onClick={() => onStop()}>
              {stopLabel}
            </Button>
          )}
        </div>
      )}
    </article>
  );
}
