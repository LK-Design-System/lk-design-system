import * as React from 'react';

export interface OverlineProps extends React.HTMLAttributes<HTMLElement> {
  /** 렌더할 요소. @default "div" */
  as?: React.ElementType;
  /** 색상 역할 — 'muted'(그레이) · 'signal'(브랜드 시안) · 'ink'(최대 대비). @default "muted" */
  tone?: 'signal' | 'ink' | 'muted';
  /** 다크 서피스용 색상 사용(라이트 테마 안에서). @default false */
  onDark?: boolean;
  children?: React.ReactNode;
}

/** 제목 위의 아주 작은 대문자·자간 이브로우/키커(기본 뮤트 그레이). */
export function Overline(props: OverlineProps): JSX.Element;
