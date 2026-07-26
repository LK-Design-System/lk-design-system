import * as React from 'react';

export interface AppliedFilter {
  id: string;
  label: React.ReactNode;
  value?: React.ReactNode;
  /** 제거 chip의 accessible name. label/value가 문자열이 아닐 때 제공해야 합니다. */
  removeLabel?: string;
}

export interface FilterBarProps extends React.HTMLAttributes<HTMLElement> {
  /** facet trigger, date range 등 필터 control 슬롯. */
  controls?: React.ReactNode;
  /** 현재 적용된 controlled filter 요약. */
  activeFilters?: AppliedFilter[];
  /** 제공하면 applied filter가 제거 버튼이 됩니다. 생략하면 읽기 전용 요약으로 렌더링됩니다. */
  onRemoveFilter?: (id: string) => void;
  onClearFilters?: () => void;
  clearLabel?: React.ReactNode;
  summaryLabel?: string;
  resultCount?: number;
  resultCountLabel?: React.ReactNode;
  /** saved view selector처럼 query 전체를 전환하는 control 슬롯. */
  viewControl?: React.ReactNode;
  /** 보기 저장, 고급 필터 등 trailing action 슬롯. */
  actions?: React.ReactNode;
  /** 독립 표면 또는 부모 데이터 표면 결합. @default "standalone" */
  variant?: 'standalone' | 'embedded';
  /** 밀도. @default "md" */
  size?: 'sm' | 'md';
}

/** 필터 control, 적용 요약, 제거/초기화, 결과 수와 saved-view 슬롯을 정렬하는 LDS Product 패턴입니다. */
export function FilterBar(props: FilterBarProps): React.JSX.Element;
