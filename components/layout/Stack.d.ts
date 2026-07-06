import * as React from 'react';

export interface StackProps extends React.HTMLAttributes<HTMLElement> {
  /** @default "column" */
  direction?: 'row' | 'column';
  /** 갭(px 또는 CSS 길이). @default 16 */
  gap?: number | string;
  align?: React.CSSProperties['alignItems'];
  justify?: React.CSSProperties['justifyContent'];
  wrap?: boolean;
  as?: React.ElementType;
  children?: React.ReactNode;
}

/** 플렉스박스 레이아웃 프리미티브 — direction · gap · align · justify · wrap. */
export function Stack(props: StackProps): JSX.Element;
