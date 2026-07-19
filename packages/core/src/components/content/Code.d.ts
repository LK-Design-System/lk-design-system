import * as React from 'react';

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  /** 여러 줄 네이비 블록으로 렌더. @default false */
  block?: boolean;
  children?: React.ReactNode;
}

/** 모노스페이스 코드 — 인라인 칩 또는 네이비 블록. */
export function Code(props: CodeProps): React.JSX.Element;
