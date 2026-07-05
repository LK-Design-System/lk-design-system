import * as React from 'react';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** 잉크. @default "signal" */
  tone?: 'signal' | 'neutral' | 'inherit';
  /** 밑줄 동작. @default "hover" */
  underline?: 'none' | 'hover' | 'always';
  /** 새 탭 + 외부 링크 화살표 + 안전한 rel. @default false */
  external?: boolean;
  children?: React.ReactNode;
}

/** 스타일된 인라인 앵커 — 시그널 잉크, 호버 밑줄, 선택적 외부 화살표. */
export function Link(props: LinkProps): JSX.Element;
