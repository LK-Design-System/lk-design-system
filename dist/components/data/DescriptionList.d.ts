import * as React from 'react';

export interface DescriptionItem {
  term: React.ReactNode;
  description: React.ReactNode;
}

export interface DescriptionListProps extends React.HTMLAttributes<HTMLDListElement> {
  items: DescriptionItem[];
  /** 쌍의 그리드 컬럼 수. @default 1 */
  columns?: number;
}

/** 키/값 쌍(사양) — 뮤트 용어, 굵은 설명, 헤어라인 행. */
export function DescriptionList(props: DescriptionListProps): React.JSX.Element;
