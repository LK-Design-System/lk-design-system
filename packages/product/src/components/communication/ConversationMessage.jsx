import React from 'react';
import { IconButton } from '@lk-robotics/lds-core/components/buttons/IconButton';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';

const ROLE_LABELS = {
  user: '사용자',
  assistant: 'AI 어시스턴트',
  'human-agent': '상담원',
  system: '시스템',
};

// Visible identity badges stay short; ROLE_LABELS keeps the full accessible name.
const ROLE_BADGE_LABELS = {
  assistant: 'AI',
  'human-agent': '상담원',
};

const ROLE_PRESENTATIONS = {
  user: 'bubble',
  assistant: 'document',
  'human-agent': 'bubble',
};

const ROLE_DIRECTIONS = {
  user: 'outbound',
  assistant: 'inbound',
  'human-agent': 'inbound',
  system: 'system',
};

const LIFECYCLE_LABELS = {
  delivery: {
    queued: '전송 대기 중',
    sending: '전송 중',
    sent: '전송됨',
    read: '읽음',
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

// The tight corner sits on the speaker's side so placement stays readable even
// when color alone cannot carry it. Grouped runs flatten the corners between
// consecutive bubbles on that same side.
function bubbleRadius(groupPosition, outbound) {
  const xl = 'var(--radius-xl)';
  const sm = 'var(--radius-sm)';
  if (outbound) {
    if (groupPosition === 'middle') return `${xl} ${sm} ${sm} ${xl}`;
    if (groupPosition === 'last') return `${xl} ${sm} ${xl} ${xl}`;
    return `${xl} ${xl} ${sm} ${xl}`;
  }
  if (groupPosition === 'middle') return `${sm} ${xl} ${xl} ${sm}`;
  if (groupPosition === 'last') return `${sm} ${xl} ${xl} ${xl}`;
  return `${xl} ${xl} ${xl} ${sm}`;
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
 * LK Product Extension for general conversations. ConversationMessage owns a
 * participant turn's semantic reading order and reusable document/bubble
 * presentations without taking visual authority from any product surface.
 * MessageFeed owns ordered log behavior; products own transport and content.
 */
export function ConversationMessage({
  direction,
  authorRole = 'assistant',
  presentation,
  groupPosition = 'single',
  lifecycle = { kind: 'static' },
  author,
  authorLabel,
  roleBadgeLabel,
  avatar,
  timestamp,
  dateTime,
  statusLabel,
  attachments,
  sources,
  inlineSources = false,
  actions,
  messageActions,
  error,
  onRetry,
  retryLabel = '메시지 다시 보내기',
  children,
  className,
  style,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  ...rest
}) {
  const authorId = React.useId();
  const roleId = React.useId();
  const systemMessage = authorRole === 'system';
  const resolvedPresentation = systemMessage
    ? 'system'
    : presentation === 'document' || presentation === 'bubble'
      ? presentation
      : ROLE_PRESENTATIONS[authorRole] ?? 'document';
  const defaultDirection = ROLE_DIRECTIONS[authorRole] ?? 'inbound';
  const resolvedDirection = systemMessage
    ? 'system'
    : direction === 'outbound' || direction === 'inbound'
      ? direction
      : defaultDirection;
  const outbound = resolvedDirection === 'outbound';
  const documentPresentation = resolvedPresentation === 'document';
  const resolvedLifecycle = normalizeLifecycle(lifecycle);
  const lifecycleKind = resolvedLifecycle.kind;
  const lifecycleState = lifecycleKind === 'static' ? undefined : resolvedLifecycle.state;
  const identityVisible = !systemMessage && (groupPosition === 'single' || groupPosition === 'first');
  // A grouped run keeps one stable content column even when consumers only
  // provide the avatar on the first item. Standalone messages without an
  // avatar do not pay for an empty identity column.
  const reserveAvatarSlot = !systemMessage && (avatar != null || groupPosition !== 'single');
  const showAvatar = identityVisible && avatar != null;
  const gridTemplateColumns = systemMessage || !reserveAvatarSlot
    ? 'minmax(0, 1fr)'
    : outbound
      ? 'minmax(0, 1fr) var(--space-8)'
      : 'var(--space-8) minmax(0, 1fr)';
  const contentColumn = systemMessage || !reserveAvatarSlot ? '1' : outbound ? '1' : '2';
  const busy = lifecycleKind === 'response'
    && ['pending', 'streaming', 'stopping'].includes(lifecycleState);
  const canRetry = lifecycleState === 'failed'
    && (lifecycleKind === 'delivery' || lifecycleKind === 'response')
    && typeof onRetry === 'function';
  // 'read' surfaces as an explicit receipt in the outbound meta line, so the
  // generic status label stays silent for it the same way 'sent' does.
  const defaultStatusLabel = lifecycleKind === 'static'
    || (lifecycleKind === 'response' && lifecycleState === 'complete')
    || (lifecycleKind === 'delivery' && (lifecycleState === 'sent' || lifecycleState === 'read'))
    ? null
    : LIFECYCLE_LABELS[lifecycleKind][lifecycleState];
  const resolvedStatusLabel = statusLabel !== undefined
    ? statusLabel
    : error != null
      ? null
      : defaultStatusLabel;
  const hasMessageActions = Array.isArray(messageActions) && messageActions.length > 0;
  const hasActions = actions != null || canRetry || hasMessageActions;
  // inlineSources drops the (typically collapsed) provenance onto the same
  // footer row as the action icons — ChatGPT-style — but keeps it a sibling of,
  // not a member of, the "메시지 동작" group so it still announces as provenance
  // rather than another action. Its own expanded panel spans the full width.
  const inlineFooter = inlineSources && sources != null;
  const lifecycleColor = lifecycleTone(lifecycleKind, lifecycleState);
  const resolvedAriaLabelledby = ariaLabel || ariaLabelledby
    ? ariaLabelledby
    : `${authorId} ${roleId}`;
  // The visible badge is decorative next to the hidden full role name; null
  // suppresses it the same way statusLabel={null} silences lifecycle copy.
  const resolvedRoleBadge = roleBadgeLabel !== undefined
    ? roleBadgeLabel
    : ROLE_BADGE_LABELS[authorRole] ?? null;

  // The content column always fills its grid track so a grouped run keeps one
  // stable column even when only the first item carries the avatar. The
  // document/bubble inside shrink-wraps and aligns to the speaker's side via
  // justifyItems; reading width is capped on the body, not the column.
  const clusterStyle = {
    gridColumn: contentColumn,
    display: 'grid',
    gap: 'var(--space-2)',
    justifyItems: systemMessage ? 'stretch' : outbound ? 'end' : 'start',
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
  };

  const bodyStyle = systemMessage
    ? {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        minWidth: 0,
        fontSize: 'var(--caption1-size)',
        lineHeight: 'var(--caption1-line)',
        textAlign: 'center',
      }
    : documentPresentation
      ? {
          width: '100%',
          maxWidth: 'min(48rem, 100%)',
          minWidth: 0,
          paddingBlock: 'var(--space-1)',
          boxSizing: 'border-box',
          overflowWrap: 'anywhere',
          wordBreak: 'break-word',
          color: 'var(--color-semantic-label-normal)',
          background: 'transparent',
          border: 0,
          borderRadius: 0,
          boxShadow: 'none',
          fontSize: 'var(--body1-size)',
          lineHeight: 'var(--body1-line)',
        }
      : outbound
        ? {
            // The speaker's own words use the same solid pair as the primary
            // button, so "my message" reads instantly in both themes.
            width: 'fit-content',
            maxWidth: 'min(34rem, 100%)',
            minWidth: 0,
            padding: 'var(--space-3) var(--space-4)',
            boxSizing: 'border-box',
            whiteSpace: 'pre-wrap',
            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
            color: 'var(--color-semantic-static-white)',
            // primary-heavy (not -normal) keeps white text at AA in both themes;
            // -normal drops to 3.39:1 on the lighter dark-mode blue.
            background: 'var(--color-semantic-primary-heavy)',
            border: 0,
            borderRadius: bubbleRadius(groupPosition, true),
            boxShadow: 'none',
            fontSize: 'var(--body2-size)',
            lineHeight: 'var(--body2-line)',
          }
        : {
            width: 'fit-content',
            maxWidth: 'min(34rem, 100%)',
            minWidth: 0,
            padding: 'var(--space-3) var(--space-4)',
            boxSizing: 'border-box',
            whiteSpace: 'pre-wrap',
            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
            color: 'var(--color-semantic-label-normal)',
            // A translucent neutral fill (not white elevated) so the incoming
            // bubble stays visibly separated from the page in light mode too,
            // and reads as distinct from the solid-primary outbound bubble.
            background: 'var(--color-semantic-fill-strong)',
            border: 0,
            borderRadius: bubbleRadius(groupPosition, false),
            boxShadow: 'none',
            fontSize: 'var(--body2-size)',
            lineHeight: 'var(--body2-line)',
          };

  const statusPart = resolvedStatusLabel != null ? (
    <p
      data-message-part="status"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: systemMessage ? 'center' : outbound ? 'flex-end' : 'flex-start',
        gap: 'var(--space-1)',
        width: '100%',
        minWidth: 0,
        margin: 0,
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
          width: 'var(--space-1)',
          height: 'var(--space-1)',
          flexShrink: 0,
          borderRadius: 'var(--radius-pill)',
          background: lifecycleColor,
        }}
      />
      {resolvedStatusLabel}
    </p>
  ) : null;

  // The speaker's own bubble carries its send state at its foot: an in-flight or
  // error label, a read receipt, and the send time — right-aligned under the
  // bubble so grouped items each keep their own time. Products own the truth of
  // when a message is read; the component only renders the state it is given.
  const readReceiptLabel = lifecycleKind === 'delivery' && lifecycleState === 'read'
    ? LIFECYCLE_LABELS.delivery.read
    : null;
  // Gate on outbound (not outbound-bubble) so an outbound document turn still
  // carries its send time and read receipt in the foot meta.
  const outboundMeta = outbound
    && (resolvedStatusLabel != null || readReceiptLabel != null || timestamp != null) ? (
    <p
      data-message-part="meta"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 'var(--space-1)',
        width: '100%',
        minWidth: 0,
        margin: 0,
        color: lifecycleState === 'failed'
          ? 'var(--color-semantic-label-normal)'
          : 'var(--color-semantic-label-alternative)',
        fontSize: 'var(--caption2-size)',
        lineHeight: 'var(--caption2-line)',
      }}
    >
      {resolvedStatusLabel != null && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', minWidth: 0 }}>
          <span
            aria-hidden="true"
            style={{
              width: 'var(--space-1)',
              height: 'var(--space-1)',
              flexShrink: 0,
              borderRadius: 'var(--radius-pill)',
              background: lifecycleColor,
            }}
          />
          {resolvedStatusLabel}
        </span>
      )}
      {/* Always render the receipt slot so a sent→read update is a text
          mutation, not a node insertion — the feed log is additions-only, so
          this keeps '읽음' from being announced bare without message context. */}
      <span data-message-read-receipt style={{ fontWeight: 'var(--fw-medium)' }}>{readReceiptLabel}</span>
      {timestamp != null && (
        <time dateTime={dateTime} style={{ flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
          {timestamp}
        </time>
      )}
    </p>
  ) : null;

  // Shared by the standard bottom action bar and the inlineSources footer so
  // the icon controls render identically in either layout.
  const actionButtons = hasActions ? (
    <>
      {canRetry && (
        <IconButton
          size="small"
          round={false}
          variant="plain"
          label={retryLabel}
          data-message-retry
          onClick={() => onRetry()}
        >
          <Icon name="refresh" size={16} aria-hidden="true" />
        </IconButton>
      )}
      {hasMessageActions && messageActions.map((action) => (
        <IconButton
          key={action.key}
          size="small"
          round={false}
          variant="plain"
          label={action.label}
          disabled={action.disabled}
          aria-pressed={action.pressed}
          data-selected={typeof action.pressed === 'boolean' ? String(action.pressed) : undefined}
          data-message-action={action.key}
          onClick={action.onClick}
          style={action.pressed ? {
            color: 'var(--color-semantic-primary-normal)',
            background: 'var(--color-semantic-primary-surface-strong)',
            border: 'var(--border-thin) solid var(--color-semantic-primary-normal)',
          } : undefined}
        >
          {action.icon}
        </IconButton>
      ))}
      {actions}
    </>
  ) : null;

  return (
    <article
      {...rest}
      aria-label={ariaLabel}
      aria-labelledby={resolvedAriaLabelledby}
      aria-busy={busy || undefined}
      className={['lk-conversation-message', className].filter(Boolean).join(' ')}
      data-direction={resolvedDirection}
      data-author-role={authorRole}
      data-message-presentation={resolvedPresentation}
      data-group-position={groupPosition}
      data-lifecycle-kind={lifecycleKind}
      data-lifecycle-state={lifecycleState}
      style={{
        display: 'grid',
        gridTemplateColumns,
        columnGap: systemMessage ? 0 : 'var(--space-2)',
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
              width: 'var(--space-8)',
              height: 'var(--space-8)',
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
                gridColumn: contentColumn,
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
          {/* Outbound time moves to the bubble-foot meta so every grouped item
              can carry its own send time; inbound keeps time in the identity row. */}
          {resolvedRoleBadge != null && (
            <span
              aria-hidden="true"
              data-message-role-badge
              style={{
                flexShrink: 0,
                padding: '0 var(--space-2)',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--color-semantic-primary-surface-normal)',
                color: 'var(--color-semantic-accent-blue-text)',
                fontSize: 'var(--caption2-size)',
                lineHeight: 'var(--caption2-line)',
                fontWeight: 'var(--fw-semibold)',
                whiteSpace: 'nowrap',
              }}
            >
              {resolvedRoleBadge}
            </span>
          )}
          {timestamp != null && !outbound && (
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

      <div data-message-part="content" style={clusterStyle}>
        {systemMessage ? (
          <div data-message-part="body" data-message-presentation="system" style={bodyStyle}>
            <div
              style={{
                minWidth: 0,
                maxWidth: 'min(42rem, 100%)',
                padding: 'var(--space-1) var(--space-4)',
                boxSizing: 'border-box',
                borderRadius: 'var(--radius-pill)',
                // Neutral fill (not the blue tint) so an impersonal system event
                // is not mistaken for a participant role tag, which owns the
                // blue pill.
                background: 'var(--color-semantic-fill-normal)',
                color: 'var(--color-semantic-label-neutral)',
                fontWeight: 'var(--fw-medium)',
                overflowWrap: 'anywhere',
              }}
            >
              {children}
            </div>
          </div>
        ) : (
          <div data-message-part="body" data-message-presentation={resolvedPresentation} style={bodyStyle}>
            {error != null && (
              <span
                data-message-error
                style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}
              >
                <Icon
                  name="triangle-exclamation"
                  size={18}
                  aria-hidden="true"
                  style={{ flexShrink: 0, marginTop: '0.1em', color: 'var(--color-semantic-label-alternative)' }}
                />
                <span>{error}</span>
              </span>
            )}
            {children}
          </div>
        )}

        {lifecycleKind === 'response' && !outbound && statusPart}

        {attachments != null && (
          <div
            data-message-part="attachments"
            style={outbound
              ? { display: 'flex', justifyContent: 'flex-end', width: '100%', minWidth: 0 }
              : { width: '100%', minWidth: 0 }}
          >
            {attachments}
          </div>
        )}

        {sources != null && !inlineFooter && (
          <div
            data-message-part="sources"
            style={outbound
              ? { display: 'flex', justifyContent: 'flex-end', width: '100%', minWidth: 0 }
              : { width: '100%', minWidth: 0 }}
          >
            {sources}
          </div>
        )}

        {outbound ? outboundMeta : (lifecycleKind !== 'response' && statusPart)}

        {inlineFooter ? (
          // ChatGPT-style footer: the action bar and the (typically collapsed)
          // provenance share one wrapping row. The sources node keeps its own
          // data-message-part and accessible name — display:contents makes the
          // collapsible SourceDisclosure the flex item so it sits beside the
          // action group when closed and spans the row when open — and stays a
          // sibling of, not a member of, the 메시지 동작 group.
          <div
            data-message-part="footer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: systemMessage ? 'center' : outbound ? 'flex-end' : 'flex-start',
              gap: 'var(--space-2)',
              width: '100%',
              minWidth: 0,
              flexWrap: 'wrap',
            }}
          >
            {hasActions && (
              <div
                data-message-part="actions"
                role="group"
                aria-label="메시지 동작"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  minWidth: 0,
                  flexWrap: 'wrap',
                }}
              >
                {actionButtons}
              </div>
            )}
            <div data-message-part="sources" style={{ display: 'contents' }}>
              {sources}
            </div>
          </div>
        ) : hasActions ? (
          <div
            data-message-part="actions"
            role="group"
            aria-label="메시지 동작"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: systemMessage ? 'center' : outbound ? 'flex-end' : 'flex-start',
              gap: 'var(--space-2)',
              width: '100%',
              minWidth: 0,
              flexWrap: 'wrap',
            }}
          >
            {actionButtons}
          </div>
        ) : null}
      </div>
    </article>
  );
}
