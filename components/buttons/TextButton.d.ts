import * as React from 'react';

export interface TextButtonProps extends React.HTMLAttributes<HTMLElement> {
  /** 잉크. @default "signal" */
  tone?: 'signal' | 'neutral' | 'danger';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** 호버 시 움직이는 끝 화살표. @default false */
  arrow?: boolean;
  /** 라벨에 밑줄. @default false */
  underline?: boolean;
  disabled?: boolean;
  /** 렌더 요소. @default "button" */
  as?: any;
  children?: React.ReactNode;
}

/** 크롬 없는 텍스트 액션 — 시그널 잉크, 호버 시 흐려짐, 선택적 화살표. */
export function TextButton(props: TextButtonProps): JSX.Element;
