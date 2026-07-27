import * as React from 'react';

export interface TreeNodeData {
  /** Stable unique ID required by selection state and `focusItem`. */
  id?: string | number;
  label: React.ReactNode;
  icon?: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  /** Optional row-end control or status. Keep nested controls out of the Tab sequence. */
  end?: React.ReactNode;
  disabled?: boolean;
  /** Custom accessible row name when visible content is not sufficient. */
  ariaLabel?: string;
  children?: TreeNodeData[];
}

export interface TreeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  nodes: TreeNodeData[];
  /** Controlled IDs of expanded branches. */
  expandedIds?: Array<string | number>;
  /** Node IDs, or primitive labels for legacy nodes without an ID, expanded initially. */
  defaultExpanded?: Array<string | number>;
  /** Called with normalized IDs/legacy primitive labels after expansion changes. */
  onExpandedIdsChange?: (expandedIds: string[]) => void;
  /** Controlled ID of the single selected node. IDs are normalized to strings. */
  selectedId?: string | number | null;
  /** Initial ID of the single selected node when uncontrolled. IDs are normalized to strings. */
  defaultSelectedId?: string | number | null;
  /** Called with the normalized ID when a node with an ID is activated. */
  onSelectedIdChange?: (selectedId: string) => void;
  /** Opens branch children while the branch is hovered or keyboard-focused. */
  openOnHover?: boolean;
  /** Accessible name for the tree widget. @default "Hierarchy" */
  ariaLabel?: string;
  onSelect?: (node: TreeNodeData) => void;
}

export interface TreeHandle {
  /** Focuses the node with this unique ID. With `reveal`, collapsed ancestors are expanded first. */
  focusItem(id: string | number, options?: { reveal?: boolean }): void;
}

/** Expandable hierarchy with roving keyboard focus and optional single selection. */
export const Tree: React.ForwardRefExoticComponent<TreeProps & React.RefAttributes<TreeHandle>>;
