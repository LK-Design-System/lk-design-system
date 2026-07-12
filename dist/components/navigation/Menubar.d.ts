import * as React from "react";

export interface MenubarMenuItem {
  label?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  onClick?: () => void;
  divider?: boolean;
  disabled?: boolean;
  /** Disabled alias retained for compatibility with WDS menu evidence. */
  disable?: boolean;
  danger?: boolean;
  checked?: boolean;
  variant?: "normal" | "radio" | "checkbox";
}

export interface MenubarMenu {
  label: React.ReactNode;
  items: MenubarMenuItem[];
  variant?: "normal" | "radio" | "checkbox";
  menuActionArea?: boolean;
  action?: React.ReactNode;
  /** Per-menu apply callback used by the generated action region. */
  onApply?: () => void;
  /** Per-menu cancel callback used by the generated action region. */
  onCancel?: () => void;
  applyLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  maxHeight?: number | string;
}

export interface MenubarProps extends React.HTMLAttributes<HTMLDivElement> {
  menus: MenubarMenu[];
  /** menu variant axis. @default "normal" */
  variant?: "normal" | "radio" | "checkbox";
  /** Show generated action controls for menus with apply/cancel callbacks. @default false */
  menuActionArea?: boolean;
  /** Fallback apply callback for menus without a per-menu callback. */
  onApply?: (menu: MenubarMenu, index: number) => void;
  /** Fallback cancel callback for menus without a per-menu callback. */
  onCancel?: (menu: MenubarMenu, index: number) => void;
  /** @default "적용" */
  applyLabel?: React.ReactNode;
  /** @default "취소" */
  cancelLabel?: React.ReactNode;
  maxHeight?: number | string;
  /** menubar의 접근 가능한 이름. @default "명령 메뉴" */
  ariaLabel?: string;
}

/** horizontal menu bar with normal, radio, checkbox, scroll, and action-area support. */
export function Menubar(props: MenubarProps): React.JSX.Element;
