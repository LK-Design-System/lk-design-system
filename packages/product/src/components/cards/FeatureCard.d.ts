import * as React from 'react';

export interface FeatureCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
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
  /**
   * `title`의 heading 레벨. 카드가 놓인 문서의 제목 계층에 맞춰 `1`–`6`을 주고,
   * 제목이 이미 카드 바깥에 있으면 `false`로 heading 의미를 끕니다. 레벨은
   * 건너뛰지 않습니다. @default 4
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6 | false;
}

/** 틴트 아이콘 타일 + 제목 + 설명 — 반복되는 기능 셀. */
export function FeatureCard(props: FeatureCardProps): React.JSX.Element;
