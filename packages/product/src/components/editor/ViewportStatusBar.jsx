import React from 'react';
import { StatusBadge } from '@lk-design-system/lds-core/components/content/StatusBadge';
import { VisuallyHidden } from '@lk-design-system/lds-core/components/layout/VisuallyHidden';
import { normalizeStatusTone } from '@lk-design-system/lds-core/components/status/status-presentation';
import {
  getUnitSeparator,
  isAttachedUnit,
  normalizeUnit,
  normalizeValueText,
} from '@lk-design-system/lds-core/components/internal/unit-format';

const STATUS_LABEL = {
  negative: '위험',
  cautionary: '주의',
  positive: '정상',
  signal: '활성',
  offline: '상태',
};

const PRIORITY_ORDER = { high: 0, normal: 1, low: 2 };

function numericStyle(mono) {
  return {
    fontVariantNumeric: 'tabular-nums',
    fontFamily: mono ? 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace)' : 'inherit',
  };
}

function StatusValue({ item }) {
  const renderedValue = normalizeValueText(item.value);
  const normalizedUnit = normalizeUnit(item.unit);
  const unitSeparator = getUnitSeparator(normalizedUnit);
  const attachedUnit = isAttachedUnit(normalizedUnit);
  const lockup = (
    <span
      data-viewport-status-value=""
      data-unit-attachment={normalizedUnit === '' ? 'none' : attachedUnit ? 'attached' : 'spaced'}
      style={{ display: 'inline-flex', alignItems: 'center', minWidth: 0, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', ...numericStyle(item.mono) }}
    >
      <span>{renderedValue}</span>
      {normalizedUnit !== '' && <span>{unitSeparator}{normalizedUnit}</span>}
    </span>
  );

  const tone = item.tone != null && item.tone !== 'default'
    ? normalizeStatusTone(item.tone)
    : null;

  return (
    <>
      <strong
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          minWidth: 0,
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: 'var(--color-semantic-label-strong)',
          fontWeight: 'var(--fw-bold)',
        }}
      >
        {lockup}
      </strong>
      {tone && (
        <StatusBadge
          data-viewport-status-tone=""
          tone={tone}
          style={{ minWidth: 0, maxWidth: '100%', overflow: 'hidden', flexShrink: 1 }}
        >
          {item.toneLabel ?? STATUS_LABEL[tone]}
        </StatusBadge>
      )}
    </>
  );
}

function PersistentItem({ item }) {
  const priority = item.priority ?? 'normal';
  const shrink = priority === 'high' ? 0 : priority === 'low' ? 2 : 1;

  return (
    <span
      data-viewport-status-item=""
      title={item.title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        flex: `0 ${shrink} auto`,
        minWidth: priority === 'high' ? 'max-content' : 0,
        maxWidth: '100%',
        overflow: 'hidden',
        color: 'var(--color-semantic-label-neutral)',
        fontSize: 'var(--caption1-size)',
        lineHeight: 'var(--caption1-line)',
        fontWeight: 'var(--fw-medium)',
        letterSpacing: 0,
      }}
    >
      <span style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>{item.label}</span>
      <StatusValue item={item} />
    </span>
  );
}

/**
 * LK ROBOTICS — ViewportStatusBar
 * One-line passive readouts for a specific 2D/3D viewport. Persistent values
 * are not a live region; an optional transient message receives polite status
 * semantics so high-frequency cursor/camera updates are not announced.
 */
export function ViewportStatusBar({
  label = '뷰포트 상태',
  items = [],
  message,
  messageTone = 'default',
  messageToneLabel,
  children,
  style,
  'aria-label': ariaLabel,
  ...rest
}) {
  const orderedItems = items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const priorityDifference = (PRIORITY_ORDER[a.item.priority ?? 'normal'] ?? 1)
        - (PRIORITY_ORDER[b.item.priority ?? 'normal'] ?? 1);
      return priorityDifference || a.index - b.index;
    });
  const resolvedMessageTone = messageTone === 'default'
    ? null
    : normalizeStatusTone(messageTone);

  return (
    <div
      {...rest}
      role="group"
      aria-label={ariaLabel ?? label}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        minWidth: 0,
        width: '100%',
        overflow: 'hidden',
        flexWrap: 'nowrap',
        whiteSpace: 'nowrap',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
    >
      {/* Mounted for the bar's whole lifetime with only its text replaced. A
          status node inserted into the DOM together with its message is not a
          mutation of an existing live region, so the first message would never
          be announced. VisuallyHidden is absolutely positioned, so the region
          costs no layout while the bar has nothing to say — the visible chip
          below stays conditional and is left out of the announcement. */}
      <VisuallyHidden
        as="span"
        data-viewport-status-live=""
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {message != null
          ? [message, resolvedMessageTone ? (messageToneLabel ?? STATUS_LABEL[resolvedMessageTone]) : null]
            .filter(Boolean).join(', ')
          : ''}
      </VisuallyHidden>

      {message != null && (
        <span
          aria-hidden="true"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', minWidth: 0, maxWidth: 'min(46%, 420px)', overflow: 'hidden', flex: '0 1 auto' }}
        >
          <span
            data-viewport-status-message=""
            style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--color-semantic-label-strong)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', fontWeight: 'var(--fw-semibold)' }}
          >
            {message}
          </span>
          {resolvedMessageTone && (
            <StatusBadge
              data-viewport-message-tone=""
              tone={resolvedMessageTone}
              style={{ minWidth: 0, maxWidth: '100%', overflow: 'hidden', flexShrink: 0 }}
            >
              {messageToneLabel ?? STATUS_LABEL[resolvedMessageTone]}
            </StatusBadge>
          )}
        </span>
      )}

      {orderedItems.map(({ item, index }) => (
        <PersistentItem key={item.key ?? `${String(item.label)}-${index}`} item={item} />
      ))}

      {children != null && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0, overflow: 'hidden', marginLeft: 'auto', flex: '0 1 auto' }}>
          {children}
        </span>
      )}
    </div>
  );
}
