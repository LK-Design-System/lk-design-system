import * as React from 'react';

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @default "signal" */
  tone?: 'signal' | 'positive' | 'cautionary' | 'negative' | 'navy';
  title?: React.ReactNode;
  /** tone별 기본 아이콘을 교체합니다. 생략하거나 null을 전달해도 기본 아이콘은 유지됩니다. */
  icon?: React.ReactElement | null;
  children?: React.ReactNode;
}

/** tone별 아이콘과 얇은 전체 테두리를 항상 제공하는 강조 노트 블록 — 안내 / 팁. */
export function Callout(props: CalloutProps): JSX.Element;
