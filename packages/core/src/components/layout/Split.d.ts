import * as React from 'react';

export interface SplitProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 브레이크포인트 위에서 적용되는 grid-template-columns. @default "1fr 1fr" */
  template?: string;
  /** 두 패널이 나뉘는 브레이크포인트; 그 아래에서는 쌓임. @default "md" */
  at?: 'md' | 'lg';
  /** 패널 사이 갭(숫자 = px). 기본값 `--gap-lg`(24). */
  gap?: number | string;
  children?: React.ReactNode;
}

/** 두 패널 스플릿 레이아웃 — 모바일에서 쌓이고 `at`에서 나뉨. */
export function Split(props: SplitProps): React.JSX.Element;
