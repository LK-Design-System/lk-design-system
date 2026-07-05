import * as React from 'react';

export interface SideNavChildItem {
  value: string;
  label: React.ReactNode;
  /** 우측 카운트/상태 배지. */
  badge?: React.ReactNode;
  disabled?: boolean;
}

export interface SideNavItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  /** 우측 카운트/상태 배지(접힌 상태에선 도트로 표시). */
  badge?: React.ReactNode;
  disabled?: boolean;
  /** 서브메뉴 — 항목이 펼침/접힘 디스클로저 그룹이 됩니다(자체 선택값 없음). */
  children?: SideNavChildItem[];
}

/** 섹션 구분용 헤딩 항목 — `items` 배열에 섞어 넣습니다. 접힌 상태에선 헤어라인으로 표시. */
export interface SideNavHeading {
  heading: React.ReactNode;
}

export interface SideNavProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** 내비 항목·서브메뉴·섹션 헤딩을 섞은 배열. */
  items: Array<SideNavItem | SideNavHeading>;
  /** 상단 브랜드 영역(예: `<Lockup variant="inline" height={24} />`). */
  header?: React.ReactNode;
  /** 접힌 상태의 브랜드(예: `<Lockup variant="mark" height={20} />`). 없으면 header를 그대로 사용. */
  headerCollapsed?: React.ReactNode;
  /** 하단에 고정되는 푸터. */
  footer?: React.ReactNode;
  /** 펼친 폭. @default 240 */
  width?: number | string;
  /** 헤더에 접기/펼치기 토글(패널 아이콘) 표시. @default false */
  collapsible?: boolean;
  /** 제어되는 접힘 상태. */
  collapsed?: boolean;
  /** 비제어 시 초기 접힘. @default false */
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** 접힌(아이콘 레일) 폭. @default 64 */
  collapsedWidth?: number;
  /** 오버레이 모드 — 레이아웃은 레일 폭 고정, 호버(피크)·클릭으로 펼치면 패널이 콘텐츠 위로 뜨고, 마우스 아웃·바깥 클릭·Esc로 접힘. 시작은 접힘. @default false */
  overlay?: boolean;
  /** 제어되는 활성 값. */
  value?: string;
  /** 비제어 시 초기 활성 값. */
  defaultValue?: string;
  onChange?: (value: string) => void;
}

/** 넓은 라벨형 대시보드 사이드바 — 브랜드 헤더 + 그룹 내비(서브메뉴·배지) + 접힘 레일 + 고정 푸터. 고정 아이콘 레일은 `NavRail`. */
export function SideNav(props: SideNavProps): JSX.Element;
