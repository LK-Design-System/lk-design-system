import * as React from 'react';

export interface BottomNavItem {
  value: string;
  label: React.ReactNode;
  /** 복합 label의 접근 가능한 이름. */
  ariaLabel?: string;
  /** 아이콘 노드(예: <Icon name="home" />). */
  icon?: React.ReactNode;
  /** 제공하면 실제 anchor로 렌더링합니다. */
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export interface BottomNavProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  items: BottomNavItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** href 항목을 router link로 치환하는 렌더 훅. 기본은 native anchor입니다. */
  renderLink?: (item: BottomNavItem, props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => React.ReactElement;
}

/**
 * 모바일 하단 탭 바 — 아이콘 + 라벨, 시그널 잉크 활성 탭.
 * `nav`의 기본 `aria-label`은 `'주 탐색'`이며 소비자가 전달한 `aria-label`이 우선합니다.
 */
export function BottomNav(props: BottomNavProps): React.JSX.Element;
