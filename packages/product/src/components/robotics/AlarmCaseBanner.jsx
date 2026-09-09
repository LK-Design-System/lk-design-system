import React from 'react';
import { StatusBadge } from '@lk-design-system/lds-core/components/content/StatusBadge';
import { Button } from '@lk-design-system/lds-core/components/buttons/Button';
import { statusToneStyle } from '@lk-design-system/lds-core/component-authoring';

/**
 * LK Product Extension — AlarmCaseBanner
 * One alarm case (a fire, a person down, a gas threshold) as the operator has
 * to act on it: what happened to which target, how old the truth is, where the
 * case sits in its lifecycle, who acknowledged it with what reason and
 * authority, and the acknowledgement action kept apart from any remote
 * command. Alarm truth, the lifecycle policy, persistence of the
 * acknowledgement record, sirens and remote transport stay with the product.
 */

const LIFECYCLES = {
  active: { label: '미확인', tone: 'negative' },
  acknowledged: { label: '확인됨', tone: 'cautionary' },
  shelved: { label: '보류됨', tone: 'neutral' },
  escalated: { label: '상위 보고됨', tone: 'negative' },
  cleared: { label: '해제됨', tone: 'positive' },
};

const SEVERITIES = {
  critical: 'negative',
  warning: 'cautionary',
  notice: 'signal',
};

const EVIDENCE_FIELDS = [
  ['actor', '처리자'],
  ['at', '시각'],
  ['reason', '사유'],
  ['authority', '권한'],
];

const visuallyHidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

const captionStyle = {
  fontSize: 'var(--caption1-size)',
  lineHeight: 'var(--caption1-line)',
  color: 'var(--color-semantic-label-neutral)',
};

function text(node) {
  return node == null ? '' : String(node);
}

export const AlarmCaseBanner = React.forwardRef(function AlarmCaseBanner({
  lifecycle = 'active',
  severity = 'critical',
  title,
  target,
  location,
  occurredAt,
  occurredLabel,
  reference,
  stale = false,
  staleLabel = '정보 오래됨',
  link = 'online',
  offlineLabel = '연결 끊김',
  authority = 'granted',
  viewOnlyLabel = '확인 권한 없음',
  relatedCount = 0,
  evidence,
  evidenceLabel = '확인 기록',
  missingEvidenceLabel = '기록 없음',
  onAcknowledge,
  acknowledgeLabel = '확인',
  acknowledgePending = false,
  acknowledgeBlockedReason,
  actions,
  remoteAction,
  remoteActionLabel = '원격 명령',
  announce = true,
  headingLevel = 3,
  style,
  ...rest
}, ref) {
  const headingId = React.useId();
  const Heading = `h${Math.min(6, Math.max(2, headingLevel))}`;
  const resolvedLifecycle = LIFECYCLES[lifecycle] ? lifecycle : 'active';
  const lifecycleMeta = LIFECYCLES[resolvedLifecycle];
  const resolvedSeverity = SEVERITIES[severity] ? severity : 'critical';
  const resting = resolvedLifecycle === 'cleared' || resolvedLifecycle === 'shelved';
  const palette = statusToneStyle(resting ? 'offline' : SEVERITIES[resolvedSeverity]);
  const isActive = resolvedLifecycle === 'active';
  const viewOnly = authority === 'view-only';
  const offline = link === 'offline';
  const blockedReason = acknowledgeBlockedReason ?? (viewOnly ? '확인 권한이 없습니다' : undefined);
  const canAcknowledge = isActive && typeof onAcknowledge === 'function';
  const acknowledgeDisabled = viewOnly || blockedReason != null;
  const blockedReasonId = `${headingId}-blocked`;

  const evidenceRows = EVIDENCE_FIELDS.map(([key, label]) => ({ key, label, value: evidence?.[key] }));
  const evidencePresent = evidenceRows.some((row) => row.value != null && text(row.value).trim() !== '');
  const evidenceComplete = evidenceRows.every((row) => row.value != null && text(row.value).trim() !== '');
  const evidenceState = !evidencePresent ? 'missing' : evidenceComplete ? 'recorded' : 'partial';

  const axes = [];
  if (stale) axes.push({ key: 'stale', tone: 'cautionary', label: staleLabel });
  if (offline) axes.push({ key: 'offline', tone: 'offline', label: offlineLabel });
  if (viewOnly) axes.push({ key: 'authority', tone: 'neutral', label: viewOnlyLabel });
  if (relatedCount > 0) axes.push({ key: 'related', tone: 'signal', label: `같은 유형 +${relatedCount}건` });

  const announcement = isActive
    ? `${text(title)} · ${text(target)}${stale ? ` · ${staleLabel}` : ''}`
    : `${text(title)} · ${text(target)} · ${lifecycleMeta.label}${evidence?.actor ? ` · ${text(evidence.actor)}` : ''}`;

  return (
    <section
      ref={ref}
      aria-labelledby={headingId}
      data-alarm-case=""
      data-lifecycle={resolvedLifecycle}
      data-severity={resolvedSeverity}
      data-link={link}
      data-authority={authority}
      data-stale={stale || undefined}
      data-evidence={isActive ? undefined : evidenceState}
      style={{
        position: 'relative',
        display: 'grid',
        gap: 'var(--space-3)',
        boxSizing: 'border-box',
        width: '100%',
        minWidth: 0,
        padding: 'var(--space-3) var(--space-4)',
        background: palette.surface,
        borderLeft: `4px solid ${palette.foreground}`,
        borderRadius: 'var(--radius-lg)',
        fontFamily: 'var(--font-sans)',
        color: 'var(--color-semantic-label-normal)',
        ...style,
      }}
      {...rest}
    >
      {announce && (
        <p role={isActive ? 'alert' : 'status'} data-slot="announcement" style={{ ...visuallyHidden, margin: 0 }}>
          {announcement}
        </p>
      )}

      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-2) var(--space-3)', flexWrap: 'wrap', minWidth: 0 }}>
        <div style={{ display: 'grid', gap: 'var(--space-1)', flex: '1 1 14rem', minWidth: 0 }}>
          <Heading
            id={headingId}
            style={{
              margin: 0,
              fontSize: 'var(--body1-size)',
              lineHeight: 'var(--body1-line)',
              fontWeight: 'var(--fw-bold)',
              color: 'var(--color-semantic-label-strong)',
              overflowWrap: 'anywhere',
            }}
          >
            {title}
          </Heading>
          <div data-slot="target" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1) var(--space-2)', fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)', color: 'var(--color-semantic-label-neutral)', minWidth: 0, overflowWrap: 'anywhere' }}>
            <span style={{ fontWeight: 'var(--fw-semibold)', color: 'var(--color-semantic-label-normal)' }}>{target}</span>
            {location != null && <span>{location}</span>}
            {occurredAt != null && (
              <time dateTime={occurredAt} style={{ fontVariantNumeric: 'tabular-nums' }}>
                {occurredLabel ?? occurredAt}
              </time>
            )}
            {reference != null && (
              <span data-slot="reference" style={{ fontFamily: 'var(--font-mono)', ...captionStyle }}>{reference}</span>
            )}
          </div>
        </div>
        <div data-slot="axes" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', justifyContent: 'flex-end', flexShrink: 0, maxWidth: '100%' }}>
          <StatusBadge data-slot="lifecycle" tone={lifecycleMeta.tone}>{lifecycleMeta.label}</StatusBadge>
          {axes.map((axis) => (
            <StatusBadge key={axis.key} data-axis={axis.key} tone={axis.tone}>{axis.label}</StatusBadge>
          ))}
        </div>
      </header>

      {!isActive && (
        <dl
          data-slot="evidence"
          aria-label={evidenceLabel}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(9rem, 100%), 1fr))',
            gap: 'var(--space-1) var(--space-3)',
            margin: 0,
            paddingTop: 'var(--space-2)',
            borderTop: '1px solid var(--color-semantic-line-normal-normal)',
            minWidth: 0,
          }}
        >
          {evidenceRows.map((row) => {
            const missing = row.value == null || text(row.value).trim() === '';
            return (
              <div key={row.key} data-evidence-field={row.key} data-missing={missing || undefined} style={{ display: 'grid', gap: 2, minWidth: 0 }}>
                <dt style={{ ...captionStyle, fontWeight: 'var(--fw-semibold)' }}>{row.label}</dt>
                <dd
                  style={{
                    margin: 0,
                    fontSize: 'var(--label1-size)',
                    lineHeight: 'var(--label1-line)',
                    color: missing ? 'var(--color-semantic-label-neutral)' : 'var(--color-semantic-label-normal)',
                    fontStyle: missing ? 'italic' : 'normal',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {missing ? missingEvidenceLabel : row.value}
                </dd>
              </div>
            );
          })}
        </dl>
      )}

      {(canAcknowledge || actions != null || remoteAction != null) && (
        <div data-slot="actions" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2) var(--space-3)', minWidth: 0 }}>
          {canAcknowledge && (
            <>
              <Button
                type="button"
                size="sm"
                variant={resolvedSeverity === 'critical' ? 'danger' : 'primary'}
                data-alarm-action="acknowledge"
                disabled={acknowledgeDisabled}
                loading={acknowledgePending}
                aria-describedby={acknowledgeDisabled && blockedReason ? blockedReasonId : undefined}
                onClick={onAcknowledge}
              >
                {acknowledgeLabel}
              </Button>
              {acknowledgeDisabled && blockedReason && (
                <span id={blockedReasonId} data-slot="blocked-reason" style={captionStyle}>{blockedReason}</span>
              )}
            </>
          )}
          {actions != null && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>{actions}</div>}
          {remoteAction != null && (
            <div
              data-slot="remote"
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 'var(--space-2)',
                marginInlineStart: 'auto',
                paddingInlineStart: 'var(--space-3)',
                borderInlineStart: '1px solid var(--color-semantic-line-normal-normal)',
              }}
            >
              <span style={{ ...captionStyle, fontWeight: 'var(--fw-semibold)' }}>{remoteActionLabel}</span>
              {remoteAction}
            </div>
          )}
        </div>
      )}
    </section>
  );
});
