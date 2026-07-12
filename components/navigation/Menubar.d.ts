import * as React from "react";

export interface MenubarMenuItem {
  label?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  onClick?: () => void;
  divider?: boolean;
  disabled?: boolean;
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
  maxHeight?: number | string;
}

export interface MenubarProps extends React.HTMLAttributes<HTMLDivElement> {
  menus: MenubarMenu[];
  /** menu variant axis. @default "normal" */
  variant?: "normal" | "radio" | "checkbox";
  /** menuActionArea axis. @default false */
  menuActionArea?: boolean;
  maxHeight?: number | string;
  /** menubar의 접근 가능한 이름. @default "명령 메뉴" */
  ariaLabel?: string;
}

/** horizontal menu bar with normal, radio, checkbox, scroll, and action-area support. */
export function Menubar(props: MenubarProps): React.JSX.Element;
