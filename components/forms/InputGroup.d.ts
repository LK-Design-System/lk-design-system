import * as React from 'react';

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 리딩 애드온(단위 / 프로토콜 / 아이콘). */
  prefix?: React.ReactNode;
  /** 트레일링 애드온. */
  suffix?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** @default "md" */
  size?: 'sm' | 'md';
  disabled?: boolean;
  /** 내부 입력에 스프레드되는 추가 props. */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

/** 접두 / 접미 애드온이 양옆에 붙는 입력. */
export function InputGroup(props: InputGroupProps): JSX.Element;
