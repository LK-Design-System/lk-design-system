import * as React from 'react';

export interface SideNavChildItem {
  value: string;
  label: React.ReactNode;
  /** 복합 label의 명시적 접근 가능한 이름. */
  ariaLabel?: string;
  /** 우측 카운트/상태 배지. */
  badge?: React.ReactNode;
  /** 제공하면 실제 anchor로 렌더링합니다. */
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export interface SideNavItem {
  value: string;
  label: React.ReactNode;
  /** 복합 label 또는 접힌 레일에서 사용할 접근 가능한 이름. */
  ariaLabel?: string;
  icon?: React.ReactNode;
  /** 우측 카운트/상태 배지(접힌 상태에선 도트로 표시). */
  badge?: React.ReactNode;
  /** 자식이 없는 leaf 항목에 제공하면 실제 anchor로 렌더링합니다. */
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** 서브메뉴 — 항목이 펼침/접힘 디스클로저 그룹이 됩니다(자체 선택값 없음). */
  children?: SideNavChildItem[];
}

/** 섹션 구분용 헤딩 항목 — `items` 배열에 섞어 넣습니다. 접힌 상태에선 헤어라인으로 표시. */
export interface SideNavHeading {
  heading: React.ReactNode;
}

export interface SideNavProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** 내비 항목·서브메뉴·섹션 헤딩을 섞은 배열. 항목은 native `ul`/`li` 리스트로 렌더되고 그룹의 자식은 중첩 리스트가 됩니다. */
  items: Array<SideNavItem | SideNavHeading>;
  /** `nav` landmark의 접근 가능한 이름. @default '사이드 탐색' */
  'aria-label'?: string;
  /** 상단 브랜드 영역(예: `<Lockup variant="inline" height={24} />`). */
  header?: React.ReactNode;
  /** 접힌 상태의 브랜드(예: `<Lockup variant="mark" height={20} />`). 없으면 header를 그대로 사용. */
  headerCollapsed?: React.ReactNode;
  /** 하단에 고정되는 푸터. */
  footer?: React.ReactNode;
  /** 펼친 폭. @default 240 */
  width?: number | string;
  /** 외곽 표면. floating은 전체 outline과 radius를, docked는 논리적 끝 divider만 사용합니다. @default 'floating' */
  surface?: 'floating' | 'docked';
  /** 제어되는 접힘 상태. 접기 토글은 셸의 상단 바에 두고 이 프롭으로 패널을 구동합니다. 상태 영속화는 SideNav가 아니라 소비 제품이 소유합니다. */
  collapsed?: boolean;
  /** 비제어 시 초기 접힘. @default false */
  defaultCollapsed?: boolean;
  /** 다음 접힘 상태 요청. controlled 사용 시 부모가 collapsed를 갱신하기 전에는 시각 상태가 바뀌지 않습니다. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** 접힌 아이콘 레일 폭. 기본 64px에서도 브랜드 마크와 경계 토글을 유지합니다. @default 64 */
  collapsedWidth?: number;
  /** 오버레이 모드 — 레이아웃은 레일 폭 고정, 호버(피크)·키보드 초점·클릭으로 펼치면 패널이 콘텐츠 위로 뜨고, 마우스 아웃과 초점 이탈·바깥 클릭·Esc로 접힘. 시작은 접힘. @default false */
  overlay?: boolean;
  /** 제어되는 활성 값. */
  value?: string;
  /** 비제어 시 초기 활성 값. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** href leaf를 router link로 치환하는 렌더 훅. 그룹 disclosure는 항상 button입니다. */
  renderLink?: (item: SideNavItem | SideNavChildItem, props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => React.ReactElement;
}

/** 넓은 라벨형 대시보드 사이드바 — 브랜드 헤더 + 그룹 내비(서브메뉴·배지) + 접힘 레일 + 고정 푸터. 고정 아이콘 레일은 `NavRail`. */
export function SideNav(props: SideNavProps): React.JSX.Element;
