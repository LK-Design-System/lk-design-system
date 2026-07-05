import * as React from 'react';

export interface TreeNodeData {
  id?: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: TreeNodeData[];
}

export interface TreeProps extends React.HTMLAttributes<HTMLDivElement> {
  nodes: TreeNodeData[];
  /** 마운트 시 펼쳐진 키(id 또는 label). */
  defaultExpanded?: string[];
  onSelect?: (node: TreeNodeData) => void;
}

/** 펼칠 수 있는 계층 — 회전 캐럿 + 레벨별 들여쓰기. */
export function Tree(props: TreeProps): JSX.Element;
