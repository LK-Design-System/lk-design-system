import * as React from 'react';

export interface ToastStackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 모서리 / 가장자리. @default "bottom-right" */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'bottom-center';
  gap?: number;
  children?: React.ReactNode;
}

/** Toast 자식을 쌓는 고정 뷰포트. */
export function ToastStack(props: ToastStackProps): React.JSX.Element;
