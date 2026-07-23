import * as React from 'react';

export type Step = string | { label: React.ReactNode };

export interface StepsProps extends React.OlHTMLAttributes<HTMLOListElement> {
  steps: Step[];
  /** 활성 단계 인덱스(0부터). @default 0 */
  current?: number;
}

/**
 * 가로 진행 단계 표시 — 완료(체크) · 현재(링) · 예정.
 * 순서 있는 리스트(`<ol>`/`<li>`)로 렌더되며, 현재 단계 `<li>`에는
 * `aria-current="step"`이 붙습니다. 각 단계 라벨 뒤에는 화면에 보이지 않는
 * 상태 텍스트(완료 · 현재 단계 · 예정)가 스크린 리더용으로 추가됩니다.
 */
export function Steps(props: StepsProps): React.JSX.Element;
