import * as React from 'react';

export type Step = string | { label: React.ReactNode };

export interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Step[];
  /** 활성 단계 인덱스(0부터). @default 0 */
  current?: number;
}

/** 가로 진행 단계 표시 — 완료(체크) · 현재(링) · 예정. */
export function Steps(props: StepsProps): React.JSX.Element;
