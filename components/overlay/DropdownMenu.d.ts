import * as React from "react";
import type { LdsClassNames, LdsStyles, LdsVars } from '../internal/surface.js';
import type { FloatingCollisionBoundary } from './anchored-overlay.js';

export type DropdownMenuPart = 'root' | 'trigger' | 'panel' | 'menu' | 'item' | 'divider' | 'actionArea';
export type DropdownMenuVariable =
  | '--lds-dropdown-menu-width'
  | '--lds-dropdown-menu-min-width'
  | '--lds-dropdown-menu-max-height';

export interface DropdownMenuItem {
  label?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  /** Logical placement for a custom item icon. @default "start" */
  iconPosition?: "start" | "end";
  shortcut?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
  /** @deprecated Use `disabled`. */
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
  /** Per-item class composed after the shared `item` part class. */
  className?: string;
  /** Per-item style composed after the shared `item` part style. */
  style?: React.CSSProperties;
}

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  align?: "left" | "right";
  /** Preferred side; flips when space is insufficient. @default "bottom" */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Trigger-to-panel gap in pixels. @default 8 */
  offset?: number;
  /** menu variant axis. @default "normal" */
  variant?: "normal" | "radio" | "checkbox";
  /** 중첩 서브메뉴 표현 방식. `flyout`은 부모 옆으로 겹겹이 뜨고(데스크톱 표준), `drill`은 같은 패널이 하위 목록으로 전환되며 상단에 뒤로 컨트롤을 둡니다(폭 고정·터치 친화). @default "flyout" */
  submenuMode?: "flyout" | "drill";
  /** Semantic menu row density. @default "default" */
  density?: "compact" | "default" | "comfortable";
  /** Legacy WDS cell-padding compatibility axis. Prefer `density`. */
  cellPadding?: 8 | 12 | "8px" | "12px" | "small" | "medium";
  /** Legacy vertical-padding compatibility axis. Prefer `density`. */
  verticalPadding?: 8 | 12 | "8px" | "12px" | "small" | "medium";
  /** Show generated action controls for staged selection when `onApply` or `onCancel` is provided. @default false */
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
  /**
   * Explicit menu width. Omit for the adaptive 176–320px content-width policy.
   */
  width?: number | string;
  /** Minimum menu width override. Adaptive menus default to 176px within the viewport. */
  minWidth?: number | string;
  maxHeight?: number | string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Escape clipping ancestors through the owner-document Portal. @default true */
  withinPortal?: boolean;
  portalTarget?: HTMLElement | null;
  /** Element/ref whose visible viewport intersection constrains the root panel. Defaults to the viewport. */
  collisionBoundary?: FloatingCollisionBoundary;
  /** Inset from every collision-boundary edge in CSS pixels. @default 16 */
  collisionPadding?: number;
  zIndex?: number;
  classNames?: LdsClassNames<DropdownMenuPart>;
  styles?: LdsStyles<DropdownMenuPart>;
  vars?: LdsVars<DropdownMenuVariable>;
}

/** dropdown menu with normal, radio, checkbox, scroll, and action-area support. */
export const DropdownMenu: React.ForwardRefExoticComponent<DropdownMenuProps & React.RefAttributes<HTMLDivElement>>;
