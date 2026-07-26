import * as React from 'react';

export interface CollapsibleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  defaultOpen?: boolean;
  density?: 'default' | 'compact';
  align?: 'start' | 'end' | 'stretch';
  children?: React.ReactNode;
}

/** 단일 디스클로저 — 굵은 헤더가 본문을 토글. */
export function Collapsible(props: CollapsibleProps): React.JSX.Element;
