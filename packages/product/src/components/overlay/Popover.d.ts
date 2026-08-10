import * as React from 'react';
import type { LdsClassNames, LdsStyles, LdsVars } from '@lk-design-system/lds-core/components/internal/surface';
import type { FloatingCollisionBoundary } from '@lk-design-system/lds-core/components/overlay/anchored-overlay';

export type PopoverPart = 'root' | 'trigger' | 'panel';
export type PopoverVariable = '--lds-popover-width' | '--lds-popover-max-height';

export interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 패널을 토글하는 요소. */
  trigger: React.ReactNode;
  /** 패널 콘텐츠. */
  children: React.ReactNode;
  /** 앵커 방향. @default "left" */
  align?: 'left' | 'right';
  /** Preferred side; flips when space is insufficient. @default "bottom" */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Trigger-to-panel gap in pixels. @default 8 */
  offset?: number;
  /** 패널 너비(px). @default 260 */
  width?: number | string;
  /** 제어된 열림 상태. */
  open?: boolean;
  /** 비제어 초기 열림 상태. @default false */
  defaultOpen?: boolean;
  /** 열림 상태 변경 알림. */
  onOpenChange?: (open: boolean) => void;
  /** 비모달 dialog 표면의 접근 가능한 이름. @default "팝오버" */
  ariaLabel?: string;
  /** Render in the owner-document Portal so clipping ancestors cannot cut the panel. @default true */
  withinPortal?: boolean;
  /** Explicit Portal target; defaults to provider target or owner-document body. */
  portalTarget?: HTMLElement | null;
  /** Element/ref whose visible viewport intersection constrains flip, shift, and available size. Defaults to the viewport. */
  collisionBoundary?: FloatingCollisionBoundary;
  /** Inset from every collision-boundary edge in CSS pixels. @default 16 */
  collisionPadding?: number;
  /** Explicit overlay layer override. */
  zIndex?: number;
  classNames?: LdsClassNames<PopoverPart>;
  styles?: LdsStyles<PopoverPart>;
  vars?: LdsVars<PopoverVariable>;
}

/** 임의의 콘텐츠를 담는 앵커드 플로팅 패널; 바깥 클릭/Escape 시 닫힘. */
export const Popover: React.ForwardRefExoticComponent<PopoverProps & React.RefAttributes<HTMLDivElement>>;
