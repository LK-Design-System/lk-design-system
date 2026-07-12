import * as React from "react";

export interface DropdownMenuItem {
  label?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
  /** disabled alias. */
  disable?: boolean;
  /** active item state. */
  active?: boolean;
  divider?: boolean;
  checked?: boolean;
  /** caption axis; use `description` or `captionContent` for visible caption text. */
  caption?: boolean;
  captionContent?: React.ReactNode;
  variant?: "normal" | "radio" | "checkbox";
}

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  align?: "left" | "right";
  /** menu variant axis. @default "normal" */
  variant?: "normal" | "radio" | "checkbox";
  /** menu cell padding axis. @default "12px" */
  cellPadding?: 8 | 12 | "8px" | "12px" | "small" | "medium";
  /** menu vertical padding axis. Defaults to `cellPadding`. */
  verticalPadding?: 8 | 12 | "8px" | "12px" | "small" | "medium";
  /** menuActionArea axis. @default false */
  menuActionArea?: boolean;
  action?: React.ReactNode;
  /** menu width. @default 320 */
  width?: number | string;
  maxHeight?: number | string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** dropdown menu with normal, radio, checkbox, scroll, and action-area support. */
export function DropdownMenu(props: DropdownMenuProps): React.JSX.Element;
