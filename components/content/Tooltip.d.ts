import * as React from 'react';

export interface TooltipProps {
  /** 툴팁 텍스트(한 줄로 유지). */
  content: React.ReactNode;
  /** 나타나는 방향. @default "top" */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  style?: React.CSSProperties;
  /** 트리거 요소. */
  children: React.ReactNode;
}

/** 네이비 호버/포커스 툴팁 말풍선. */
export function Tooltip(props: TooltipProps): JSX.Element;
