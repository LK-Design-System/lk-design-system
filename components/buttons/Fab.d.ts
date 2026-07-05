import * as React from 'react';

export interface FabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** @default "signal" */
  variant?: 'signal' | 'dark' | 'primary' | 'secondary' | 'white';
  /** 지름: sm 48 · md 56 · lg 64. @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** 접근성 이름(필수 — 아이콘 전용). */
  label: string;
  children?: React.ReactNode;
}

/** 둥글고 떠 있는 플로팅 액션 버튼. */
export function Fab(props: FabProps): JSX.Element;
