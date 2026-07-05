import * as React from 'react';

export interface DropdownMenuItem {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
  divider?: boolean;
}

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 메뉴를 토글하는 요소. */
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  /** 앵커 방향. @default "left" */
  align?: 'left' | 'right';
}

/** 트리거 + 메뉴 팝오버; 바깥 클릭 / 선택 시 닫힘. */
export function DropdownMenu(props: DropdownMenuProps): JSX.Element;
