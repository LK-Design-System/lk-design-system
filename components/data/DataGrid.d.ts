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
  /** Controlled selected row indices. When set, the grid mirrors this value and clearing is driven by the parent. */
  selectedRows?: number[];
  /** Initially selected row indices for Storybook/demo and uncontrolled table states. @default [] */
  defaultSelectedRows?: number[];
  onSelectionChange?: (indices: number[]) => void;
  /** 선택 시 헤더 행을 대체하는 선택 밴드에 노출할 bulk action 슬롯. */
  bulkActions?: React.ReactNode;
  /** 선택 해제 콜백. 지정 시 선택 밴드에 "선택 해제" 버튼을 노출합니다. */
  onClearSelection?: () => void;
  /** @default "md" */
  size?: 'sm' | 'md';
}

/** 클릭 정렬 헤더 + 선택적 행 선택이 있는 표. 선택 시 헤더 행이 선택 밴드(카운트·해제·bulk action)로 바뀝니다. */
export function DataGrid<Row extends Record<string, unknown> = Record<string, unknown>>(props: DataGridProps<Row>): JSX.Element;
