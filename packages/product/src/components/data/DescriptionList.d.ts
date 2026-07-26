import * as React from 'react';

export interface DescriptionItem {
  term: React.ReactNode;
  description: React.ReactNode;
}

export interface DescriptionListProps extends React.HTMLAttributes<HTMLDListElement> {
  items: DescriptionItem[];
  /** 쌍의 그리드 컬럼 수. @default 1 */
  columns?: number;
  /** `stacked`는 좁은 패널·카드용으로 용어를 값 위에 쌓고 값을 regular 굵기로 표시합니다. @default "default" */
  variant?: 'default' | 'stacked';
}

/** 키/값 쌍(사양) — 뮤트 용어, 굵은 설명, 헤어라인 행. */
export function DescriptionList(props: DescriptionListProps): React.JSX.Element;
