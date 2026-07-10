import * as React from 'react';

export interface TreeSelectionPanelNode {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  searchText?: string;
  selectable?: boolean;
  disabled?: boolean;
  children?: TreeSelectionPanelNode[];
}

export interface TreeSelectionPanelProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultChecked'> {
  nodes?: TreeSelectionPanelNode[];
  /** 제어형 체크 id 배열. */
  checked?: string[];
  /** 비제어형 초기 체크 id 배열. */
  defaultChecked?: string[];
  onChange?: (checkedIds: string[]) => void;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  /** @default "검색" */
  placeholder?: string;
  /** Tree list accessible name. @default "트리 선택" */
  label?: string;
  defaultExpanded?: string[];
  /** Branch checkbox toggles selectable descendants. @default true */
  cascade?: boolean;
  height?: React.CSSProperties['maxHeight'];
  emptyLabel?: React.ReactNode;
  noResultsLabel?: React.ReactNode;
  disabled?: boolean;
}

/** 검색·체크 가능한 계층형 다중 선택 패널. */
export function TreeSelectionPanel(props: TreeSelectionPanelProps): JSX.Element;
