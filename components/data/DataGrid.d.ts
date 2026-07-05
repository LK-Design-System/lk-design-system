import * as React from 'react';

export interface DataGridColumn {
  key: string;
  label: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (row: any) => React.ReactNode;
}

export interface DataGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns: DataGridColumn[];
  rows: any[];
  /** 행 체크박스. @default false */
  selectable?: boolean;
  onSelectionChange?: (indices: number[]) => void;
  /** @default "md" */
  size?: 'sm' | 'md';
}

/** 클릭 정렬 헤더 + 선택적 행 선택이 있는 표. */
export function DataGrid(props: DataGridProps): JSX.Element;
