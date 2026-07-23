import * as React from 'react';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** 잉크. @default "signal" */
  tone?: 'signal' | 'neutral' | 'inherit';
  /** 밑줄 동작. @default "hover" */
  underline?: 'none' | 'hover' | 'always';
  /** 새 탭 + 외부 링크 화살표 + 안전한 rel + 접근 이름에 붙는 새 창 안내. @default false */
  external?: boolean;
  /** `external`일 때 접근 이름에 덧붙는 시각적 숨김 문구. @default "새 창에서 열림" */
  externalLabel?: string;
  children?: React.ReactNode;
}

/** 스타일된 인라인 앵커 — 시그널 잉크, 호버 밑줄, 선택적 외부 화살표와 새 창 안내. */
export function Link(props: LinkProps): React.JSX.Element;
