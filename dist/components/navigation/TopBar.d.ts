import * as React from 'react';

export interface TopBarProps extends React.HTMLAttributes<HTMLElement> {
  /** 왼쪽 브랜드 슬롯(예: <Lockup />). */
  brand?: React.ReactNode;
  /** 내비 영역 — 링크 / 탭 / 버튼. */
  children?: React.ReactNode;
  /** 오른쪽 정렬 액션(버튼, 아이콘 버튼, 아바타). */
  actions?: React.ReactNode;
  /** 내비 정렬. @default "start" */
  navAlign?: 'start' | 'center';
  /** 프로스티드 블러로 상단 고정. @default false */
  sticky?: boolean;
  /** 하단 헤어라인 룰 표시. @default true */
  bordered?: boolean;
  /** 네이비 마스트헤드 변형. @default false */
  dark?: boolean;
  /** 바 높이(px). @default 64 */
  height?: number;
}

/** 상단 앱 바 — 브랜드 · 내비 · 액션, 헤어라인 베이스의 카드 서피스 위. */
export function TopBar(props: TopBarProps): React.JSX.Element;

export interface TopBarNavItemMenuItem {
  label: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export interface TopBarNavItemProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 내비 라벨. */
  children?: React.ReactNode;
  /** 활성 상태. */
  active?: boolean;
  /** 링크로 렌더링할 때의 href. 없으면 button으로 렌더링. */
  href?: string;
  /** hover/focus 시 표시되는 드롭다운 항목. */
  menuItems?: TopBarNavItemMenuItem[];
  /** 드롭다운 메뉴의 명시 테마. @default "light" */
  menuTheme?: 'light' | 'dark';
  onClick?: React.MouseEventHandler<HTMLElement>;
}

/** TopBar 전용 내비 항목 — active underline과 선택적 드롭다운 메뉴 포함. */
export function TopBarNavItem(props: TopBarNavItemProps): React.JSX.Element;
