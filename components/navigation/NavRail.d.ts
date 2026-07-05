import * as React from 'react';

export interface NavRailItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

export interface NavRailProps extends React.HTMLAttributes<HTMLElement> {
  items: NavRailItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

/** 세로 아이콘+라벨 내비게이션 레일(데스크톱 사이드 내비). */
export function NavRail(props: NavRailProps): JSX.Element;
