import * as React from 'react';

export interface SplitButtonMenuItem {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface SplitButtonProps {
  children?: React.ReactNode;
  /** 메인 액션. */
  onClick?: () => void;
  /** 드롭다운 액션. */
  items: SplitButtonMenuItem[];
  /** @default "primary" */
  variant?: 'primary' | 'secondary' | 'signal' | 'dark';
  /** @default "md" */
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

/** 기본 액션에 관련 액션 캐럿 메뉴가 붙은 버튼. */
export function SplitButton(props: SplitButtonProps): JSX.Element;
