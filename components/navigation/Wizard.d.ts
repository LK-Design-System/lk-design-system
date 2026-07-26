import * as React from 'react';

export type WizardStep = string | { label: React.ReactNode };

export interface WizardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  steps: WizardStep[];
  /** 제어되는 단계 인덱스. */
  current?: number;
  defaultCurrent?: number;
  onStepChange?: (index: number) => void;
  /**
   * 마지막 단계에서 완료 액션. 제공하면 마지막 단계의 다음 버튼이
   * `completeLabel`을 단 primary 완료 버튼이 되어 클릭 시 호출됩니다.
   * 제공하지 않으면 기존처럼 마지막 단계에서 다음 버튼이 비활성화됩니다.
   */
  onComplete?: () => void;
  /** 완료 버튼 라벨(`onComplete` 제공 시). @default '완료' */
  completeLabel?: React.ReactNode;
  /** 노드, 또는 렌더 함수 `(current) => ReactNode`. 콘텐츠 영역은 `aria-live="polite"`로 감싸져 단계 전환이 스크린 리더에 알림됩니다. */
  children?: React.ReactNode | ((current: number) => React.ReactNode);
  /**
   * 푸터 제어 — `null`: 내장 이전/다음 컨트롤 숨김 ·
   * 노드: 기본 컨트롤 대신 해당 노드를 렌더 ·
   * `undefined`(기본): 내장 이전/다음 컨트롤.
   */
  footer?: React.ReactNode | null;
}

/**
 * 다단계 플로우 — Steps 인디케이터 + 콘텐츠 + 뒤로/다음.
 * 인디케이터는 Steps 컴포넌트를 재사용해 ol/li 구조와
 * `aria-current="step"` 시맨틱을 그대로 제공합니다.
 */
export function Wizard(props: WizardProps): React.JSX.Element;
