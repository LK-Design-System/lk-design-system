import * as React from 'react';

export interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  defaultOpen?: boolean;
  children?: React.ReactNode;
}

/** 단일 디스클로저 — 굵은 헤더가 본문을 토글. */
export function Collapsible(props: CollapsibleProps): JSX.Element;
