import * as React from 'react';

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 큰 숫자 / 값(예: "2024", "5억원"). */
  value?: React.ReactNode;
  /** 값과 분리해 전달하는 단위. %, ‰, °는 붙이고 나머지는 공백을 둡니다. */
  unit?: React.ReactNode;
  /** 값 옆이나 아래의 캡션. */
  label?: React.ReactNode;
  /** 값 색상. @default "ink" */
  accent?: 'ink' | 'signal' | 'steel';
  /** 다크 서피스에 렌더. @default false */
  dark?: boolean;
  /** 캡션을 인라인 대신 값 아래로 쌓기. @default false */
  stacked?: boolean;
}

/** 큰 ExtraBold 숫자 + 캡션 — 마일스톤, KPI. */
export function Stat(props: StatProps): React.JSX.Element;
