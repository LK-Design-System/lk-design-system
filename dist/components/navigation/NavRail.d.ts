import * as React from 'react';

export interface NavRailItem {
  value: string;
  label: React.ReactNode;
  /** 복합 label의 접근 가능한 이름. */
  ariaLabel?: string;
  icon?: React.ReactNode;
  /** 제공하면 실제 anchor로 렌더링합니다. */
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export interface NavRailProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  items: NavRailItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** href 항목을 router link로 치환하는 렌더 훅. 기본은 native anchor입니다. */
  renderLink?: (item: NavRailItem, props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => React.ReactElement;
  /**
   * 배치 표면. `floating`(기본)은 기존 68×60 항목의 카드형 레일입니다. `docked`는
   * `DashboardShell topology="rail-panel"`의 전체 높이 영역 레일(폭 64, 항목 56×56, 캡션 상시,
   * 끝 구분선, 카드 chrome 없음)이며 `header`·`footer` 슬롯을 받습니다. `drawer`는 같은 항목을
   * rail-panel 좁은 화면 드로어의 가로 행으로 그립니다. @default "floating"
   */
  surface?: 'floating' | 'docked' | 'drawer';
  /** 색 역할. `neutral`은 SideNav neutral과 같은 무채색 선택(채움 + label-normal + 굵기)입니다. @default "default" */
  appearance?: 'default' | 'neutral';
  /** docked 레일 맨 위의 로고 슬롯(예: `Lockup variant="mark"` 홈 링크). 메뉴 토글을 두지 않습니다. */
  header?: React.ReactNode;
  /** docked 레일 맨 아래의 계정 슬롯(예: `UserMenu collapsed`). */
  footer?: React.ReactNode;
  /**
   * 항목의 `aria-current` 값을 제품 라우트로 정합니다. 영역 첫 화면은 `'page'`, 영역 안 다른 화면은
   * `'true'`를 반환합니다. 생략하면 선택 항목이 `'page'`입니다.
   */
  getItemCurrent?: (item: NavRailItem, state: { active: boolean }) => 'page' | 'true' | undefined;
}

/**
 * 세로 아이콘+라벨 내비게이션 레일(데스크톱 사이드 내비).
 * `nav`의 기본 `aria-label`은 `'주 탐색'`이며 소비자가 전달한 `aria-label`이 우선합니다.
 */
export function NavRail(props: NavRailProps): React.JSX.Element;
