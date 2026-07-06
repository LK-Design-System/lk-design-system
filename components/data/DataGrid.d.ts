import * as React from 'react';

export interface DataGridColumn<Row extends Record<string, unknown> = Record<string, unknown>> {
  key: keyof Row & string;
  label: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (row: Row) => React.ReactNode;
}

export interface DataGridProps<Row extends Record<string, unknown> = Record<string, unknown>> extends React.HTMLAttributes<HTMLDivElement> {
  columns: DataGridColumn<Row>[];
  rows: Row[];
  /** 행 체크박스. @default false */
  selectable?: boolean;
  onSelectionChange?: (indices: number[]) => void;
  /** @default "md" */
  size?: 'sm' | 'md';
}

/** 클릭 정렬 헤더 + 선택적 행 선택이 있는 표. */
export function DataGrid<Row extends Record<string, unknown> = Record<string, unknown>>(props: DataGridProps<Row>): JSX.Element;
