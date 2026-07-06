import * as React from 'react';

export interface TextButtonProps extends React.HTMLAttributes<HTMLElement> {
  /** 잉크. @default "signal" */
  tone?: 'signal' | 'neutral' | 'danger';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** @deprecated 더 이상 시각 요소를 렌더하지 않습니다. 호환성 유지를 위한 no-op입니다. */
  arrow?: boolean;
  /** 라벨에 밑줄. @default false */
  underline?: boolean;
  disabled?: boolean;
  /** 렌더 요소. @default "button" */
  as?: React.ElementType;
  children?: React.ReactNode;
}

/** 크롬 없는 텍스트 액션 — 시그널 잉크, 호버 시 흐려짐. */
export function TextButton(props: TextButtonProps): JSX.Element;
