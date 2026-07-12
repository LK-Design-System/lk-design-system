import * as React from 'react';

export interface AnchorItem {
  href: string;
  label: React.ReactNode;
  /** 들여쓰기 레벨. @default 0 */
  level?: number;
}

export interface AnchorProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  items: AnchorItem[];
  /** 제어되는 활성 href. */
  active?: string;
  onChange?: (href: string) => void;
}

/** 시그널 잉크 활성 룰이 있는 페이지 내 목차 내비게이션. */
export function Anchor(props: AnchorProps): React.JSX.Element;
