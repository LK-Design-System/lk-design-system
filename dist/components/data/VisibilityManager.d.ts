import * as React from 'react';
import type { ReorderMeta } from '../content/ReorderList';

export interface VisibilityManagerItem {
  id: string;
  label: React.ReactNode;
  /** Required when label is not plain text. */
  accessibleLabel?: string;
  description?: React.ReactNode;
  /** Controlled visible state. */
  visible: boolean;
  /** Prevents visibility changes but does not prevent reordering. */
  locked?: boolean;
}

export interface VisibilityManagerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  items?: VisibilityManagerItem[];
  /** Emits a controlled visibility change. 생략하면 visibility checkbox만 비활성화됩니다. */
  onVisibilityChange?: (itemId: string, visible: boolean) => void;
  /** Emits ordered ids from button, keyboard, or drag movement. 생략하면 reorder 조작만 비활성화됩니다. */
  onOrderChange?: (nextIds: string[], meta: ReorderMeta) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Product-owned reset action slot. */
  resetAction?: React.ReactNode;
  density?: 'comfortable' | 'compact';
  disabled?: boolean;
  emptyLabel?: React.ReactNode;
  /** Accessible name for the reorderable list. */
  listLabel?: string;
}

/** Controlled visibility and keyboard-accessible ordering for columns or dashboard widgets. */
export function VisibilityManager(props: VisibilityManagerProps): React.JSX.Element;
