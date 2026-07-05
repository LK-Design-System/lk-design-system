import * as React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 모양. text = 한 개 이상의 바; rect/circle = 단일 블록. @default "rect" */
  variant?: 'rect' | 'text' | 'circle';
  /** 너비(숫자 = px, 또는 CSS 길이 / %) — 예: "25%". @default "100%" */
  width?: number | string;
  /** 높이(숫자 = px). text 기본 14, rect 16, circle은 width. */
  height?: number | string;
  /** rect의 모서리 반경(숫자/CSS 길이). 기본값 --radius-lg. */
  radius?: number | string;
  /** 텍스트 바 개수(text 변형); 1개 초과 시 마지막이 짧아짐. @default 1 */
  lines?: number;
  /** 텍스트 바의 가로 정렬. @default "leading" */
  align?: 'leading' | 'center' | 'trailing';
  /** 셔머 톤: normal(쿨 그레이) 또는 light(화이트, 다크 서피스용). @default "normal" */
  tone?: 'normal' | 'light';
}

/** 반짝이는 로딩 플레이스홀더 — rect / text / circle. */
export function Skeleton(props: SkeletonProps): JSX.Element;
