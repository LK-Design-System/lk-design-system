import * as React from 'react';

export interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 틴트 타일에 표시되는 인라인 SVG 글리프. */
  icon?: React.ReactNode;
  /** 제목. */
  title?: React.ReactNode;
  /** 보조 설명. */
  children?: React.ReactNode;
  /** 아이콘 타일 톤. @default "signal" */
  tone?: 'signal' | 'steel' | 'amber' | 'navy';
  /** 화이트 Card 서피스로 감싸기. @default false */
  boxed?: boolean;
}

/** 틴트 아이콘 타일 + 제목 + 설명 — 반복되는 기능 셀. */
export function FeatureCard(props: FeatureCardProps): JSX.Element;
