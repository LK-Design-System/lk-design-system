import * as React from 'react';

export interface UseControllableOpenOptions {
  /** 제어된 열림 상태. 전달하면 controlled 모드가 된다. */
  open?: boolean;
  /** 비제어 초기 열림 상태. @default false */
  defaultOpen?: boolean;
  /** 열림 상태 변경 알림. 값이 실제로 바뀔 때만 호출된다. */
  onOpenChange?: (open: boolean) => void;
}

/** 앵커드 오버레이 공용 controlled/uncontrolled 열림 상태. */
export function useControllableOpen(
  options: UseControllableOpenOptions,
): [boolean, (next: boolean | ((current: boolean) => boolean)) => void];

export type LightDismissReason = 'escape' | 'outside-press';

export interface UseLightDismissOptions {
  /** 오버레이가 열려 있는지 여부. */
  open: boolean;
  /** 트리거와 떠 있는 콘텐츠를 모두 포함하는 앵커 루트 ref. */
  rootRef: React.RefObject<HTMLElement | null>;
  /** Escape 시 초점을 복원할 트리거 요소를 반환한다. */
  getTrigger?: () => HTMLElement | null | undefined;
  /** 닫힘 결정 콜백. 소비자가 열림 상태를 갱신한다. */
  onDismiss?: (reason: LightDismissReason) => void;
  /** 바깥 pointerdown으로 닫을지 여부. @default true */
  outsidePress?: boolean;
}

/**
 * 초점을 가두지 않는 light-dismiss 엔진: 바깥 클릭 + 최상단 Escape + Escape 재오픈 래치.
 * 소비자: Tooltip, HoverCard, Popover, DropdownMenu, Menubar, SplitButton, UserMenu.
 */
export function useLightDismiss(options: UseLightDismissOptions): void;

export type FloatingPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface UseFloatingPositionOptions {
  /** 패널이 열려 있는지 여부. 닫히면 위치가 초기화된다. */
  open: boolean;
  /** 기준 앵커 요소 ref. */
  anchorRef: React.RefObject<HTMLElement | null>;
  /** 측정할 떠 있는 패널 요소 ref. */
  panelRef: React.RefObject<HTMLElement | null>;
  /** 요청 배치. 공간이 부족하면 반대편으로 flip한다. @default "bottom" */
  placement?: FloatingPlacement;
  /** 앵커와 패널 사이 간격(px). @default 8 */
  offset?: number;
  /** 뷰포트 가장자리 여백(px). @default 16 */
  viewportPadding?: number;
}

export interface FloatingPosition {
  /** flip이 반영된 실제 배치. */
  placement: FloatingPlacement;
  /** 뷰포트 안으로 되밀기 위한 X 이동량(px). */
  shiftX: number;
  /** 뷰포트 안으로 되밀기 위한 Y 이동량(px). */
  shiftY: number;
  /** 배치 방향에서 사용 가능한 최대 높이(px). 닫힘 상태에서는 null. */
  maxHeight: number | null;
}

/** 앵커드 패널 측정·flip·뷰포트 클램프 엔진. 시각 chrome과 정렬은 소비자가 소유한다. */
export function useFloatingPosition(options: UseFloatingPositionOptions): FloatingPosition;

/** 기존 ARIA 참조 문자열에 id를 중복 없이 덧붙인다. */
export function appendAriaReference(existing: string | null | undefined, id: string): string;

/** 앵커 루트에서 오버레이 트리거로 쓸 요소를 찾는다(`data-anchored-overlay-trigger` 우선). */
export function findOverlayTrigger(root: HTMLElement | null | undefined): HTMLElement | null;
