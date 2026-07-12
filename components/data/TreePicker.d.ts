import * as React from 'react';

export interface TreePickerNode {
  id: string;
  /** Visible row label. Provide `searchText` when it is not plain text. */
  label: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  searchText?: string;
  /** Makes a branch independently selectable when `selectionBehavior="independent"`. */
  selectable?: boolean;
  /** Disables this node and all descendants. */
  disabled?: boolean;
  children?: TreePickerNode[];
}

export interface TreePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  nodes?: TreePickerNode[];
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectedIdsChange?: (selectedIds: string[]) => void;
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedIdsChange?: (expandedIds: string[]) => void;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  /** Descendant aggregation or explicit per-node selection. @default "descendants" */
  selectionBehavior?: 'descendants' | 'independent';
  searchLabel?: React.ReactNode;
  searchPlaceholder?: string;
  /** Accessible name for the tree. */
  label?: string;
  emptyMessage?: React.ReactNode;
  noResultsMessage?: React.ReactNode;
  maxHeight?: React.CSSProperties['maxHeight'];
  disabled?: boolean;
}

/** Hierarchical multi-select input with explicit controlled selection and expansion state. */
export function TreePicker(props: TreePickerProps): React.JSX.Element;
