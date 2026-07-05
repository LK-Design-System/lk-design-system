import * as React from 'react';

export interface BubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 채움. @default "navy" */
  tone?: 'navy' | 'light';
  /** 꼬리 방향. @default "bottom" */
  tail?: 'top' | 'bottom' | 'left' | 'right';
  children?: React.ReactNode;
}

/** 꼬리가 있는 콜아웃 / 말풍선 — 코치 마크, 주석, 채팅. */
export function Bubble(props: BubbleProps): JSX.Element;
