import * as React from "react";
import type { LdsClassNames, LdsStyles, LdsVars } from '../internal/surface.js';

export type TooltipPart = 'root' | 'bubble' | 'surface' | 'content' | 'shortcut';
export type TooltipVariable = '--lds-tooltip-padding' | '--lds-tooltip-max-width';

export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'content'> {
  content: React.ReactNode;
  /** position axis. @default "top" */
  position?: "top" | "bottom" | "left" | "right";
  /** @deprecated Use `position`. */
  placement?: "top" | "bottom" | "left" | "right";
  /** size axis. @default "medium" */
  size?: "small" | "sm" | "medium" | "md";
  /** arrow alignment axis. @default "center" */
  align?:
    "leading" | "center" | "trailing" | "left" | "right" | "top" | "bottom";
  /** shortcut axis. */
  shortcut?: React.ReactNode;
  /** Show arrow. @default true */
  arrow?: boolean;
  /**
   * 포인터 hover 로 열고 닫을 때의 지연(ms). 숫자를 주면 enter 지연으로,
   * 객체를 주면 `{ open, close }` 로 적용합니다. 키보드 focus 는 항상 즉시
   * 열립니다(APG).
   * @default { open: 250, close: 0 }
   */
  delay?: number | { open?: number; close?: number };
  /** 제어된 열림 상태. */
  open?: boolean;
  /** 비제어 초기 열림 상태. @default false */
  defaultOpen?: boolean;
  /** 열림 상태 변경 알림. */
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  /** Escape clipping ancestors through the owner-document Portal. @default true */
  withinPortal?: boolean;
  portalTarget?: HTMLElement | null;
  zIndex?: number;
  classNames?: LdsClassNames<TooltipPart>;
  styles?: LdsStyles<TooltipPart>;
  vars?: LdsVars<TooltipVariable>;
}

/** tooltip with position, size, arrow alignment, and shortcut support. */
export const Tooltip: React.ForwardRefExoticComponent<TooltipProps & React.RefAttributes<HTMLSpanElement>>;
