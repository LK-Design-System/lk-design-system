import * as React from 'react';

export interface ChipProps extends React.HTMLAttributes<HTMLElement> {
  /** 렌더 요소 — "span"(기본) 또는 링크 칩은 "a". @default "span" */
  as?: React.ElementType;
  /** 고정/선택 상태(시그널 잉크 보더 + 틴트). @default false */
  selected?: boolean;
  href?: string;
  children?: React.ReactNode;
}

/** 혼합 케이스 키워드 칩 — 화이트 박스, 헤어라인 보더; 호버/선택 시 시그널 잉크로 올라감. */
export function Chip(props: ChipProps): JSX.Element;
