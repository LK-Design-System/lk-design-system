import * as React from 'react';

export interface SourceTagProps extends React.HTMLAttributes<HTMLElement> {
  /** 출처 이름(링크되는 텍스트). */
  children?: React.ReactNode;
  /** 구분자 앞의 모노 키커. @default "SOURCE" */
  label?: string;
  /** 설정하면 외부 링크로 렌더(새 탭으로 열리고 ↗ 표시). */
  href?: string;
  /** 'default'(라이트 서피스) 또는 'onDark'(네이비 서피스). @default "default" */
  tone?: 'default' | 'onDark';
}

/** 출처 칩 — 모노 키커 · 출처 이름 · ↗. 콘텐츠를 출처에 연결. */
export function SourceTag(props: SourceTagProps): React.JSX.Element;
