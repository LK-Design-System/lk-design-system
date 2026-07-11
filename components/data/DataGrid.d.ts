import * as React from 'react';

export interface DataGridColumn<Row extends Record<string, unknown> = Record<string, unknown>> {
  key: keyof Row & string;
  label: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (row: Row, rowId: React.Key) => React.ReactNode;
}

export interface DataGridSort {
  key: string | null;
  dir: 'asc' | 'desc';
}

export interface DataGridProps<Row extends Record<string, unknown> = Record<string, unknown>> extends React.HTMLAttributes<HTMLDivElement> {
  columns: DataGridColumn<Row>[];
  rows: Row[];
  /** 행 체크박스. @default false */
  selectable?: boolean;
  /** Controlled selected row IDs. IDs are indices when getRowId is omitted. */
  selectedRows?: React.Key[];
  /** Initially selected row IDs. @default [] */
  defaultSelectedRows?: React.Key[];
  onSelectionChange?: (rowIds: React.Key[]) => void;
  /** Stable row identity for sorting, paging, and selection. Defaults to the source index. */
  getRowId?: (row: Row, index: number) => React.Key;
  /** Controlled sort state. */
  sort?: DataGridSort;
  /** Initial uncontrolled sort state. */
  defaultSort?: DataGridSort;
  onSortChange?: (sort: DataGridSort) => void;
  /** client sorts rows locally; manual preserves server order and emits changes only. @default "client" */
  sortingMode?: 'client' | 'manual';
  /** Keyboard and pointer row activation. */
  onRowActivate?: (row: Row, rowId: React.Key, event: React.SyntheticEvent) => void;
  /** 선택 시 헤더 행을 대체하는 선택 밴드에 노출할 bulk action 슬롯. */
  bulkActions?: React.ReactNode;
  /** 선택 해제 콜백. 지정 시 선택 밴드에 "선택 해제" 버튼을 노출합니다. */
  onClearSelection?: () => void;
  loading?: boolean;
  loadingLabel?: React.ReactNode;
  error?: React.ReactNode;
  emptyLabel?: React.ReactNode;
  stateActions?: React.ReactNode;
  /** @default "md" */
  size?: 'sm' | 'md';
}

/** Controlled sort, stable row IDs, selection, activation, and resource states in a data table. */
export function DataGrid<Row extends Record<string, unknown> = Record<string, unknown>>(props: DataGridProps<Row>): JSX.Element;
