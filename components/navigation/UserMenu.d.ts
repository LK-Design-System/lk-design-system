import * as React from 'react';

export interface UserMenuItem {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  /** 위험 액션(로그아웃 등) — danger 잉크. */
  danger?: boolean;
  disabled?: boolean;
  /** true면 구분선 행. */
  divider?: boolean;
}

export interface UserMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 사용자 이름 — 접힌 상태에선 툴팁, 아바타 이니셜 폴백에도 사용. */
  name: React.ReactNode;
  /** 이름 아래 보조 줄(역할·이메일). */
  detail?: React.ReactNode;
  /** 아바타 이미지 URL. 생략하면 이니셜 폴백. */
  src?: string;
  /** 아바타 상태 점. */
  status?: 'online' | 'busy' | 'offline';
  /** 위로 열리는 계정 메뉴 항목. */
  items?: UserMenuItem[];
  /** SideNav 접힘 상태와 동기화 — 아바타만 표시. @default false */
  collapsed?: boolean;
  /** Viewport inset in pixels used to clamp the upward menu. @default 12 */
  viewportPadding?: number;
}

/** 사이드바 푸터용 계정 행 — 아바타 + 이름/역할 + 위로 열리는 계정 메뉴. SideNav `footer` 슬롯에 배치. */
export function UserMenu(props: UserMenuProps): React.JSX.Element;
