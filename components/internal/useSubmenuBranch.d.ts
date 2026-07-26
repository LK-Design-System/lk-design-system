import * as React from 'react';

export interface UseSubmenuBranchOptions {
  /** true면 hover 인텐트와 클릭 열기를 모두 비활성화한다. @default false */
  disabled?: boolean;
}

export interface SubmenuTriggerAria {
  'aria-haspopup': 'menu';
  'aria-expanded': boolean;
  'aria-controls': string | undefined;
}

export interface UseSubmenuBranchResult {
  /** 서브메뉴 열림 상태. 엔진이 소유한다. */
  open: boolean;
  /** 포탈된 패널의 `role="menu"` 노드에 부여할 안정된 id. */
  menuId: string;
  /** 서브메뉴 트리거에 spread할 ARIA 배선(haspopup/expanded/controls). */
  triggerAria: SubmenuTriggerAria;
  /** 서브메뉴를 여는 부모 메뉴 항목에 연결하는 ref. */
  triggerRef: React.RefObject<HTMLElement | null>;
  /** 포탈된 서브메뉴의 `role="menu"` 컨테이너에 연결하는 ref. */
  menuRef: React.RefObject<HTMLElement | null>;
  /** 트리거·패널을 감싸는 컨테이너에 spread하는 hover 인텐트 핸들러. */
  containerHandlers: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
  /** 트리거 항목에 spread하는 클릭·키보드(ArrowRight/Enter/Space) 핸들러. */
  triggerHandlers: {
    onClick: () => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
  };
  /** 서브메뉴 `role="menu"` 노드의 onKeyDown. ArrowLeft 닫기 후 공용 메뉴 키보드로 위임한다. */
  menuKeyDown: (event: React.KeyboardEvent) => void;
  /** 부모 패널 옆에 위치한 포탈 패널을 렌더한다. 시각 chrome은 소비자가 소유한다. */
  renderPanel: (children: React.ReactNode, panelStyle?: React.CSSProperties) => React.ReactPortal | null;
}

/**
 * 메뉴 표면 공용 서브메뉴(드릴) 브랜치 엔진. useMenuKeyboard 위에서 동작한다.
 * 소비자: DropdownMenu, Menubar.
 */
export function useSubmenuBranch(options?: UseSubmenuBranchOptions): UseSubmenuBranchResult;
