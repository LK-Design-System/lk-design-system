import * as React from 'react';

export interface BlockquoteProps extends React.HTMLAttributes<HTMLElement> {
  /** 출처 표기 줄. */
  cite?: React.ReactNode;
  children?: React.ReactNode;
}

/** 시그널 잉크 좌측 룰 + 선택적 출처가 있는 인용. */
export function Blockquote(props: BlockquoteProps): JSX.Element;
