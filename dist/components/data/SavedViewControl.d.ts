import * as React from 'react';

export interface SavedViewOption {
  /** Stable product-owned identifier. */
  id: string;
  /** Plain text rendered by the native select option. */
  label: string;
  disabled?: boolean;
}

export interface SavedViewControlProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  views?: SavedViewOption[];
  /** Controlled selected view id. Use an empty string when no view is selected. */
  value?: string;
  /** Emits selection only; 생략하면 select는 read-only 의미로 disabled됩니다. */
  onChange?: (viewId: string, event: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: React.ReactNode;
  placeholder?: string;
  emptyLabel?: string;
  /** Shows a non-color unsaved-change status. */
  dirty?: boolean;
  dirtyLabel?: React.ReactNode;
  /** Shows an inline busy status and sets aria-busy on the group. */
  saving?: boolean;
  savingLabel?: React.ReactNode;
  /** Product-owned overwrite action. */
  saveAction?: React.ReactNode;
  /** Product-owned create-copy action. */
  saveAsAction?: React.ReactNode;
  /** Product-owned rename action. */
  renameAction?: React.ReactNode;
  /** Product-owned delete action. */
  deleteAction?: React.ReactNode;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  selectId?: string;
  name?: string;
}

/** Controlled named-view selector with dirty/saving status and product-owned action slots. */
export function SavedViewControl(props: SavedViewControlProps): React.JSX.Element;
