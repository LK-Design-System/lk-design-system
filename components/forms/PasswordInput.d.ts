import * as React from 'react';

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'size'> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** @default "md" */
  size?: 'sm' | 'md';
  disabled?: boolean;
}

/** 표시/숨김 토글이 있는 비밀번호 필드. */
export function PasswordInput(props: PasswordInputProps): JSX.Element;
