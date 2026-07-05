import * as React from 'react';

export interface TopBarProps extends React.HTMLAttributes<HTMLElement> {
  /** 왼쪽 브랜드 슬롯(예: <Lockup />). */
  brand?: React.ReactNode;
  /** 내비 영역 — 링크 / 탭 / 버튼. */
  children?: React.ReactNode;
  /** 오른쪽 정렬 액션(버튼, 아이콘 버튼, 아바타). */
  actions?: React.ReactNode;
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
export function TopBar(props: TopBarProps): JSX.Element;
