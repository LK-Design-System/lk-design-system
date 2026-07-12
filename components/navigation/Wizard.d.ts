import * as React from 'react';

export type WizardStep = string | { label: React.ReactNode };

export interface WizardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  steps: WizardStep[];
  /** 제어되는 단계 인덱스. */
  current?: number;
  defaultCurrent?: number;
  onStepChange?: (index: number) => void;
  /** 노드, 또는 렌더 함수 `(current) => ReactNode`. */
  children?: React.ReactNode | ((current: number) => React.ReactNode);
  /** 기본 뒤로/다음 푸터를 숨기려면 `null` 전달. */
  footer?: React.ReactNode | null;
}

/** 다단계 플로우 — Steps 인디케이터 + 콘텐츠 + 뒤로/다음. */
export function Wizard(props: WizardProps): React.JSX.Element;
