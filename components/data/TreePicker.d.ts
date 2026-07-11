import * as React from 'react';

export interface TreePickerNode {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  searchText?: string;
  selectable?: boolean;
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
  selectionBehavior?: 'descendants' | 'independent';
  searchLabel?: React.ReactNode;
  searchPlaceholder?: string;
  label?: string;
  emptyMessage?: React.ReactNode;
  noResultsMessage?: React.ReactNode;
  maxHeight?: React.CSSProperties['maxHeight'];
  disabled?: boolean;
}

/** Hierarchical multi-select input with explicit controlled selection and expansion state. */
export function TreePicker(props: TreePickerProps): JSX.Element;
