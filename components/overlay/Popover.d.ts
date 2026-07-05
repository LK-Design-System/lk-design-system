import * as React from 'react';

export interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 패널을 토글하는 요소. */
  trigger: React.ReactNode;
  /** 패널 콘텐츠. */
  children: React.ReactNode;
  /** 앵커 방향. @default "left" */
  align?: 'left' | 'right';
  /** 패널 너비(px). @default 260 */
  width?: number;
}

/** 임의의 콘텐츠를 담는 앵커드 플로팅 패널; 바깥 클릭 시 닫힘. */
export function Popover(props: PopoverProps): JSX.Element;
