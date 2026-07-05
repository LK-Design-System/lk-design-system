import * as React from 'react';

export interface BottomNavItem {
  value: string;
  label: React.ReactNode;
  /** 아이콘 노드(예: <Icon name="home" />). */
  icon?: React.ReactNode;
}

export interface BottomNavProps extends React.HTMLAttributes<HTMLElement> {
  items: BottomNavItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

/** 모바일 하단 탭 바 — 아이콘 + 라벨, 시그널 잉크 활성 탭. */
export function BottomNav(props: BottomNavProps): JSX.Element;
