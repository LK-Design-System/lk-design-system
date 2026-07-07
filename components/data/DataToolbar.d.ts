import * as React from 'react';

export interface DataToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 테이블/그리드 제목. */
  title?: React.ReactNode;
  /** 제목 아래 설명. */
  description?: React.ReactNode;
  /** 전체 결과 수. */
  count?: number;
  /** 제어 검색어. */
  searchValue?: string;
  /** 비제어 검색어 초기값. @default "" */
  defaultSearchValue?: string;
  /** 검색어 변경 콜백. */
  onSearchChange?: (value: string) => void;
  /** 검색 input placeholder와 accessible name. @default "검색" */
  searchPlaceholder?: string;
  /** 필터 chip/menu 슬롯. */
  filters?: React.ReactNode;
  /** 우측 일반 액션 슬롯. */
  actions?: React.ReactNode;
  /** 선택된 행 수. @default 0 */
  selectedCount?: number;
  /** 선택 상태에서 노출할 bulk action 슬롯. */
  bulkActions?: React.ReactNode;
  /** 밀도. @default "md" */
  size?: 'sm' | 'md';
}

/** DataGrid/Table 상단의 검색, 필터, 결과 수, bulk action을 정렬하는 툴바. */
export function DataToolbar(props: DataToolbarProps): JSX.Element;
