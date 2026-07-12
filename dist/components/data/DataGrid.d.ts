import * as React from 'react';

export interface DataGridColumn<Row extends Record<string, unknown> = Record<string, unknown>> {
  key: keyof Row & string;
  label: React.ReactNode;
  /** Plain accessible name when label is not text. Defaults to key. */
  accessibleLabel?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  width?: React.CSSProperties['width'];
  minWidth?: React.CSSProperties['minWidth'];
  /** Pinned columns are grouped at the logical table edge. Pixel widths are recommended. */
  pinned?: 'start' | 'end' | 'left' | 'right';
  render?: (row: Row, rowId: React.Key) => React.ReactNode;
  /** Controlled inline editor slot, used only when editingCell matches this cell. */
  editor?: (row: Row, rowId: React.Key) => React.ReactNode;
}

export interface DataGridSort {
  key: string | null;
  dir: 'asc' | 'desc';
}

export interface DataGridSortEntry {
  key: string;
  dir: 'asc' | 'desc';
}

export interface DataGridEditingCell {
  rowId: React.Key;
  columnKey: string;
}

/** A finite set of selected row IDs. This is the model represented by the legacy selectedRows API. */
export interface DataGridExplicitSelection {
  mode: 'explicit';
  selectedIds: React.Key[];
}

/** Every row matching the current server query, minus explicit exclusions. */
export interface DataGridAllMatchingSelection {
  mode: 'allMatching';
  excludedIds: React.Key[];
}

export type DataGridSelectionModel = DataGridExplicitSelection | DataGridAllMatchingSelection;

export interface DataGridBulkActionContext {
  /** Lossless selection passed to the server action. */
  selectionModel: DataGridSelectionModel;
  /** Explicit selection size, or totalCount minus excludedIds for allMatching. */
  selectedCount: number;
  /** Total rows matching the current query. */
  totalCount: number;
  /** Selected rows present in the current rows page. */
  pageSelectedCount: number;
  /** Requests an empty explicit selection and invokes onClearSelection. */
  clearSelection: () => void;
}

export interface DataGridProps<Row extends Record<string, unknown> = Record<string, unknown>> extends React.HTMLAttributes<HTMLDivElement> {
  columns: DataGridColumn<Row>[];
  rows: Row[];
  /** Controlled set of visible data-column keys. Product settings own mutation and persistence. */
  visibleColumnKeys?: string[];
  /** Controlled data-column order. Unknown keys are ignored and omitted keys append in source order. */
  columnOrder?: string[];
  /** Accessible name applied to the native table element. */
  tableLabel?: string;
  /** 행 체크박스. @default false */
  selectable?: boolean;
  /** Controlled selected row IDs. IDs are indices when getRowId is omitted. */
  selectedRows?: React.Key[];
  /** Initially selected row IDs. @default [] */
  defaultSelectedRows?: React.Key[];
  /** Legacy explicit-ID callback. It is not emitted for allMatching models. */
  onSelectionChange?: (rowIds: React.Key[]) => void;
  /** Lossless controlled selection. Takes precedence over selectedRows when both are provided. */
  selectionModel?: DataGridSelectionModel;
  /** Initial uncontrolled lossless selection. Takes precedence over defaultSelectedRows. */
  defaultSelectionModel?: DataGridSelectionModel;
  onSelectionModelChange?: (selectionModel: DataGridSelectionModel) => void;
  /** Header checkbox target. Use allMatching with selectionModel and totalCount. @default "page" */
  selectAllScope?: 'page' | 'allMatching';
  /** Total rows matching the active query; drives allMatching selection count. Defaults to rows.length. */
  totalCount?: number;
  /** Entity noun used in select-all, bulk-band, and fallback row labels. @default "항목" */
  selectionEntityLabel?: string;
  /** Returns the full entity name used by the row checkbox, e.g. "사용자 USR-104". */
  getRowSelectionLabel?: (row: Row, rowId: React.Key) => string;
  /** False disables and names the row checkbox and excludes the visible row from selection operations. */
  getRowCanSelect?: (row: Row, rowId: React.Key) => boolean;
  /** Stable row identity for sorting, paging, and selection. Defaults to the source index. */
  getRowId?: (row: Row, index: number) => React.Key;
  /** Controlled sort state. */
  sort?: DataGridSort;
  /** Initial uncontrolled sort state. */
  defaultSort?: DataGridSort;
  onSortChange?: (sort: DataGridSort) => void;
  /** Lossless controlled multi-sort model. Takes precedence over sort. */
  sortModel?: DataGridSortEntry[];
  /** Initial uncontrolled multi-sort model. */
  defaultSortModel?: DataGridSortEntry[];
  onSortModelChange?: (sortModel: DataGridSortEntry[]) => void;
  /** Each activation cycles unsorted → ascending → descending → removed without modifier keys. @default false */
  multiSort?: boolean;
  /** client sorts rows locally; manual preserves server order and emits changes only. @default "client" */
  sortingMode?: 'client' | 'manual';
  /** Controlled expanded row IDs. */
  expandedRowIds?: React.Key[];
  /** Initially expanded row IDs. @default [] */
  defaultExpandedRowIds?: React.Key[];
  onExpandedRowIdsChange?: (rowIds: React.Key[]) => void;
  getRowCanExpand?: (row: Row, rowId: React.Key) => boolean;
  /** One-level supplementary row detail. Supplying this enables the expansion column. */
  renderExpandedRow?: (row: Row, rowId: React.Key) => React.ReactNode;
  /** Product-controlled cell that renders its column editor slot. */
  editingCell?: DataGridEditingCell | null;
  /** Keyboard and pointer row activation. */
  onRowActivate?: (row: Row, rowId: React.Key, event: React.SyntheticEvent) => void;
  /** Selection-band action slot, or a render function receiving the lossless selection/count contract. */
  bulkActions?: React.ReactNode | ((context: DataGridBulkActionContext) => React.ReactNode);
  /** Called after the built-in selection-band clear action requests an empty selection. */
  onClearSelection?: () => void;
  /** Keep visible header cells at the top of the DataGrid scroll container. @default false */
  stickyHeader?: boolean;
  /** Sticky header inset. @default 0 */
  stickyHeaderOffset?: React.CSSProperties['top'];
  loading?: boolean;
  loadingLabel?: React.ReactNode;
  error?: React.ReactNode;
  emptyLabel?: React.ReactNode;
  stateActions?: React.ReactNode;
  /** @default "md" */
  size?: 'sm' | 'md';
}

/** Controlled sort, stable row IDs, selection, activation, and resource states in a data table. */
export function DataGrid<Row extends Record<string, unknown> = Record<string, unknown>>(props: DataGridProps<Row>): React.JSX.Element;
