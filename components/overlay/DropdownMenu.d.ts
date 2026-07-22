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
  /** 중첩 서브메뉴 항목. 있으면 이 항목은 서브메뉴를 여는 트리거가 되고(오른쪽 chevron·`aria-haspopup`), hover·클릭·오른쪽 화살표로 펼쳐집니다. */
  items?: DropdownMenuItem[];
}

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  align?: "left" | "right";
  /** menu variant axis. @default "normal" */
  variant?: "normal" | "radio" | "checkbox";
  /** 중첩 서브메뉴 표현 방식. `flyout`은 부모 옆으로 겹겹이 뜨고(데스크톱 표준), `drill`은 같은 패널이 하위 목록으로 전환되며 상단에 뒤로 컨트롤을 둡니다(폭 고정·터치 친화). @default "flyout" */
  submenuMode?: "flyout" | "drill";
  /** menu cell padding axis. @default "12px" */
  cellPadding?: 8 | 12 | "8px" | "12px" | "small" | "medium";
  /** menu vertical padding axis. Defaults to `cellPadding`. */
  verticalPadding?: 8 | 12 | "8px" | "12px" | "small" | "medium";
  /** Show generated action controls when `onApply` or `onCancel` is provided. @default false */
  menuActionArea?: boolean;
  /** Custom action region. Replaces generated apply/cancel controls. */
  action?: React.ReactNode;
  /** Apply callback. The generated control closes the menu and restores trigger focus. */
  onApply?: () => void;
  /** Cancel callback. The generated control closes the menu and restores trigger focus. */
  onCancel?: () => void;
  /** @default "적용" */
  applyLabel?: React.ReactNode;
  /** @default "취소" */
  cancelLabel?: React.ReactNode;
  /** menu width. @default 320 */
  width?: number | string;
  maxHeight?: number | string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** dropdown menu with normal, radio, checkbox, scroll, and action-area support. */
export function DropdownMenu(props: DropdownMenuProps): React.JSX.Element;
