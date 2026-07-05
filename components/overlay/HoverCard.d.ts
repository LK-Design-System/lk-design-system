import * as React from 'react';

export interface HoverCardProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 호버 시 카드를 드러내는 요소. */
  trigger: React.ReactNode;
  children: React.ReactNode;
  /** 앵커 방향. @default "left" */
  align?: 'left' | 'right';
  /** 너비(px). @default 280 */
  width?: number;
}

/** 호버로 열리는 팝오버(프로필 / 스펙 미리보기). */
export function HoverCard(props: HoverCardProps): JSX.Element;
