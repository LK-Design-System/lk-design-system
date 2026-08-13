import * as React from 'react';
import type { StepsLabelPolicy } from './Steps.jsx';

export type WizardStep = string | { label: React.ReactNode };

/** `footer` 렌더 함수가 받는 내비게이션 컨텍스트. */
export interface WizardFooterContext {
  /** 현재 단계 인덱스(0부터). */
  current: number;
  /** 전체 단계 수. */
  count: number;
  isFirst: boolean;
  isLast: boolean;
  /** 비동기 guard 또는 비동기 `onComplete`가 진행 중인지. 진행 중에는 back/next/complete가 무시됩니다. */
  pending: boolean;
  /** 마지막 단계에서 `onComplete`가 제공되어 다음 액션이 완료 액션인지. */
  nextIsComplete: boolean;
  /** guard를 거쳐 이전 단계로 이동합니다. 첫 단계·pending에서는 무시됩니다. */
  back: () => void;
  /** guard를 거쳐 다음 단계로 이동하고, `nextIsComplete`면 `complete()`를 호출합니다. */
  next: () => void;
  /** `onComplete`를 호출합니다. pending이거나 `onComplete`가 없으면 무시됩니다. */
  complete: () => void;
}

export interface WizardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  steps: WizardStep[];
  /** 제어되는 단계 인덱스. */
  current?: number;
  defaultCurrent?: number;
  onStepChange?: (index: number) => void;
  /**
   * 단계 전환 guard. 전환이 확정되기 전에 `(nextIndex, currentIndex)`로 호출되며,
   * `false`를 반환하거나 promise가 `false`로 resolve되거나 reject되면 현재 단계와
   * 입력값을 유지합니다. promise를 반환하면 settle될 때까지 `pending`이 되어
   * 이전/다음/완료가 중복 실행되지 않습니다. guard 통과 후에만 `onStepChange`가 호출됩니다.
   */
  onBeforeStepChange?: (nextIndex: number, currentIndex: number) => boolean | void | Promise<boolean | void>;
  /**
   * 마지막 단계에서 완료 액션. 제공하면 마지막 단계의 다음 버튼이
   * `completeLabel`을 단 primary 완료 버튼이 되어 클릭 시 호출됩니다.
   * promise를 반환하면 settle될 때까지 `pending`으로 중복 실행이 차단됩니다.
   * 제공하지 않으면 기존처럼 마지막 단계에서 다음 버튼이 비활성화됩니다.
   */
  onComplete?: () => void | Promise<unknown>;
  /** 완료 버튼 라벨(`onComplete` 제공 시). @default '완료' */
  completeLabel?: React.ReactNode;
  /** 인디케이터(`Steps`)로 전달되는 좁은 화면 라벨 정책. @default 'always' */
  labelPolicy?: StepsLabelPolicy;
  /** 노드, 또는 렌더 함수 `(current) => ReactNode`. 콘텐츠 영역은 `aria-live="polite"`로 감싸져 단계 전환이 스크린 리더에 알림되고, 위저드가 시작한 전환 후에는 이 영역으로 focus가 이동합니다. */
  children?: React.ReactNode | ((current: number) => React.ReactNode);
  /**
   * 푸터 제어 — `null`: 내장 이전/다음 컨트롤 숨김 ·
   * 노드: 기본 컨트롤 대신 해당 노드를 렌더 ·
   * 함수: `WizardFooterContext`를 받아 커스텀 푸터를 렌더(기본 이전/다음/완료
   * 의미와 guard·pending 계약을 유지한 채 표현만 교체) ·
   * `undefined`(기본): 내장 이전/다음 컨트롤.
   */
  footer?: React.ReactNode | null | ((context: WizardFooterContext) => React.ReactNode);
}

/**
 * 다단계 플로우 — Steps 인디케이터 + 콘텐츠 + 뒤로/다음.
 * 인디케이터는 Steps 컴포넌트를 재사용해 ol/li 구조와
 * `aria-current="step"` 시맨틱을 그대로 제공합니다.
 */
export function Wizard(props: WizardProps): React.JSX.Element;
