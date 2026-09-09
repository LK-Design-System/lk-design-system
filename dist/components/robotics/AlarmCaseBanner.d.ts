import * as React from 'react';

export type AlarmLifecycle = 'active' | 'acknowledged' | 'shelved' | 'escalated' | 'cleared';
export type AlarmSeverity = 'critical' | 'warning' | 'notice';

/** The persisted record of the last lifecycle transition, supplied by the product. Missing fields render as "기록 없음". */
export interface AlarmEvidence {
  /** Who performed the transition (operator name or account). */
  actor?: React.ReactNode;
  /** When it was recorded, already formatted for display. */
  at?: React.ReactNode;
  /** The reason the operator entered. */
  reason?: React.ReactNode;
  /** The authority or role under which the transition was accepted. */
  authority?: React.ReactNode;
}

export interface AlarmCaseBannerProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Where the case sits in its lifecycle. The product owns the transitions. @default "active" */
  lifecycle?: AlarmLifecycle;
  /** Urgency of the case; colours the surface and picks alert vs status announcement. @default "critical" */
  severity?: AlarmSeverity;
  /** What happened, e.g. "화재 감지로 정지". Becomes the heading and the start of the announcement. */
  title: React.ReactNode;
  /** The affected target, e.g. the robot or equipment name. */
  target: React.ReactNode;
  /** Optional place or zone. */
  location?: React.ReactNode;
  /** Machine-readable occurrence time (ISO 8601) for `<time dateTime>`. */
  occurredAt?: string;
  /** Visible occurrence time or age; falls back to `occurredAt`. */
  occurredLabel?: React.ReactNode;
  /** Product case identifier shown in monospace for audit follow-up. */
  reference?: React.ReactNode;
  /** The displayed truth is older than the product's freshness window. Sets `data-stale` and shows `staleLabel`. @default false */
  stale?: boolean;
  /** @default "정보 오래됨" */
  staleLabel?: React.ReactNode;
  /** Transport state to the target; offline is shown as a separate chip and never as a lifecycle change. @default "online" */
  link?: 'online' | 'offline';
  /** @default "연결 끊김" */
  offlineLabel?: React.ReactNode;
  /** Whether the current user may acknowledge. `view-only` disables the acknowledge action with a visible reason. @default "granted" */
  authority?: 'granted' | 'view-only';
  /** @default "확인 권한 없음" */
  viewOnlyLabel?: React.ReactNode;
  /** Number of further cases of the same type collapsed into this one (alarm flood). @default 0 */
  relatedCount?: number;
  /** Persisted acknowledgement/transition record. Rendered for every non-active lifecycle; absent fields are marked missing. */
  evidence?: AlarmEvidence;
  /** Accessible name of the evidence list. @default "확인 기록" */
  evidenceLabel?: string;
  /** Text for a missing evidence field. @default "기록 없음" */
  missingEvidenceLabel?: React.ReactNode;
  /** Acknowledge handler. Rendered only while `lifecycle` is `active`. The product records actor, time, reason and authority. */
  onAcknowledge?: React.MouseEventHandler<HTMLButtonElement>;
  /** @default "확인" */
  acknowledgeLabel?: React.ReactNode;
  /** Acknowledgement request in flight; the button shows loading and blocks repeats. @default false */
  acknowledgePending?: boolean;
  /** Visible reason why acknowledging is blocked; disables the action. Defaults to the view-only message when `authority` is `view-only`. */
  acknowledgeBlockedReason?: React.ReactNode;
  /** Product-owned secondary actions (open detail, shelve, escalate). */
  actions?: React.ReactNode;
  /** A remote command such as resume, kept in its own labelled group apart from acknowledgement. Its eligibility and lifecycle follow WF-03. */
  remoteAction?: React.ReactNode;
  /** @default "원격 명령" */
  remoteActionLabel?: React.ReactNode;
  /** Render the visually hidden live announcement (`alert` while active, `status` otherwise). @default true */
  announce?: boolean;
  /** Heading level of the title. @default 3 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

/** One alarm case with separate severity, lifecycle, freshness, link and authority axes, persisted acknowledgement evidence, and acknowledge kept apart from remote commands. */
export const AlarmCaseBanner: React.ForwardRefExoticComponent<AlarmCaseBannerProps & React.RefAttributes<HTMLElement>>;
