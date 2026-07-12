import * as React from 'react';

export interface SplitButtonMenuItem {
  value?: React.Key;
  label?: React.ReactNode;
  /** Accessible name when the visible label is absent. */
  ariaLabel?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  /** Disabled alias retained for compatibility. */
  disable?: boolean;
  danger?: boolean;
}

export interface SplitButtonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onClick'> {
  children?: React.ReactNode;
  /** 메인 액션. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** 드롭다운 액션. */
  items: SplitButtonMenuItem[];
  /** @default "primary" */
  variant?: 'primary' | 'secondary' | 'signal' | 'dark';
  /** Button family height scale: 32 / 40 / 48. @default "md" */
  size?: 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';
  disabled?: boolean;
  /** Disabled alias retained for compatibility. */
  disable?: boolean;
  /** Disable both segments and show an inline spinner without changing width. */
  loading?: boolean;
  /** Accessible label used while loading. @default "Loading" */
  loadingLabel?: string;
  /** Accessible name for the menu segment. @default "관련 작업 열기" */
  menuLabel?: string;
}

/** 기본 액션에 관련 액션 캐럿 메뉴가 붙은 LK Product Extension. */
export function SplitButton(props: SplitButtonProps): React.JSX.Element;
