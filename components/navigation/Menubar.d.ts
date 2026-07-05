import * as React from 'react';

export interface MenubarMenuItem {
  label?: React.ReactNode;
  shortcut?: React.ReactNode;
  onClick?: () => void;
  divider?: boolean;
}

export interface MenubarMenu {
  label: React.ReactNode;
  items: MenubarMenuItem[];
}

export interface MenubarProps extends React.HTMLAttributes<HTMLDivElement> {
  menus: MenubarMenu[];
}

/** 메뉴들의 가로 바 — 한 번에 하나 열림, 열린 상태에서 호버로 전환. */
export function Menubar(props: MenubarProps): JSX.Element;
