import * as React from 'react';

export interface SearchFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'size'> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Enter 시 현재 값과 함께 발생. */
  onSearch?: (value: string) => void;
  placeholder?: string;
  /** @default "md" */
  size?: 'sm' | 'md';
  disabled?: boolean;
}

/** 앞에 돋보기 + 지우기 어포던스가 있는 검색 입력. */
export function SearchField(props: SearchFieldProps): JSX.Element;
