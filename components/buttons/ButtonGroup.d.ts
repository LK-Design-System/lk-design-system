import * as React from 'react';

export type ButtonGroupOption = string | { value: string; label: React.ReactNode };

export interface ButtonGroupProps {
  options: ButtonGroupOption[];
  /** 제어 값(문자열, `multiple`일 때 string[]). */
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  /** @default "md" */
  size?: 'sm' | 'md';
  /** 여러 개 활성 허용. @default false */
  multiple?: boolean;
  style?: React.CSSProperties;
}

/** 연결된 보더형 토글 그룹(단일 또는 다중 선택). */
export function ButtonGroup(props: ButtonGroupProps): JSX.Element;
