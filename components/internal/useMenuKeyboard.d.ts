import * as React from 'react';

export interface UseMenuKeyboardOptions {
  /** 메뉴 표면이 열려 있는지 여부. 엔진은 열림 상태를 소유하지 않고 관찰만 한다. */
  open: boolean;
  /** 엔진이 닫기를 결정했을 때 호출된다(Escape, Tab). 소비자가 열림 상태를 갱신한다. */
  onClose?: () => void;
  /** Escape 시 초점을 복원할 트리거 요소를 반환한다. */
  getTrigger?: () => HTMLElement | null | undefined;
  /** 드릴 레벨 등 같은 메뉴 노드에서 항목 집합이 교체될 때 증가시키는 키. entry focus와 typeahead를 재시작한다. @default 0 */
  menuKey?: number | string;
  /** Whether opening the menu without an explicit request should focus its first item. @default true */
  focusOnOpen?: boolean;
}

export interface UseMenuKeyboardResult {
  /** `role="menu"` 컨테이너에 연결하는 ref. 항목 탐색의 스코프가 된다. */
  menuRef: React.RefObject<HTMLElement | null>;
  /** 다음 entry focus가 앉을 위치를 예약한다. 기본은 'first'(뒤로 가기 항목 제외). */
  requestItemFocus: (position?: 'first' | 'last') => void;
  /** 메뉴를 닫는다. `restoreFocus`가 true면 트리거로 초점을 복원한다. */
  closeMenu: (options?: { restoreFocus?: boolean }) => void;
  /** `role="menu"` 컨테이너의 onKeyDown에 연결하는 핸들러. 화살표·Home/End·typeahead·Escape·Tab을 소유한다. */
  handleMenuKeyDown: (event: React.KeyboardEvent) => void;
}

/**
 * LDS 메뉴 표면 공용 roving focus·typeahead·dismiss 엔진.
 * 소비자: DropdownMenu, Menubar, SplitButton, UserMenu, useSubmenuBranch.
 */
export function useMenuKeyboard(options: UseMenuKeyboardOptions): UseMenuKeyboardResult;
