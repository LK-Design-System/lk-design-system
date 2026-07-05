import * as React from 'react';

export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  /** 가로 룰 대신 세로 인라인 구분선으로 렌더. @default false */
  vertical?: boolean;
  /** 텍스트 구분선용 가운데 라벨("또는", "AND"). */
  label?: React.ReactNode;
  /** 양 끝의 가로 인셋(px). @default 0 */
  inset?: number;
}

/** 쿨 그레이 라인 토큰의 헤어라인 룰 — 가로, 세로, 또는 라벨형. */
export function Divider(props: DividerProps): JSX.Element;
