import * as React from 'react';

export interface TreeNodeData {
  id?: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: TreeNodeData[];
}

export interface TreeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  nodes: TreeNodeData[];
  /** 마운트 시 펼쳐진 키(id 또는 label). */
  defaultExpanded?: string[];
  /** Controlled ID of the single selected node. */
  selectedId?: string | null;
  /** Initial ID of the single selected node when uncontrolled. */
  defaultSelectedId?: string | null;
  /** Called when a node is activated by click, Enter, or Space. */
  onSelectedIdChange?: (selectedId: string) => void;
  /** Opens branch children while the branch is hovered or keyboard-focused. */
  openOnHover?: boolean;
  /** Accessible name for the tree widget. @default "Hierarchy" */
  ariaLabel?: string;
  onSelect?: (node: TreeNodeData) => void;
}

export interface TreeHandle {
  /** Focuses a node. With `reveal`, collapsed ancestors are expanded first. */
  focusItem(id: string, options?: { reveal?: boolean }): void;
}

/** 펼칠 수 있는 계층 — 회전 캐럿 + 레벨별 들여쓰기. */
export const Tree: React.ForwardRefExoticComponent<TreeProps & React.RefAttributes<TreeHandle>>;
