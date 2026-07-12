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
}

/** 세로 아이콘+라벨 내비게이션 레일(데스크톱 사이드 내비). */
export function NavRail(props: NavRailProps): React.JSX.Element;
