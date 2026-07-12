import * as React from 'react';

export interface SpacerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 고정 크기(px/CSS). 생략하면 유연한 스페이서(flex:1). */
  size?: number | string;
  /** 고정 크기의 축. @default "vertical" */
  axis?: 'vertical' | 'horizontal';
}

/** 유연한(flex:1) 또는 고정 스페이서. */
export function Spacer(props: SpacerProps): React.JSX.Element;
