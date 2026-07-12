import * as React from 'react';

export interface TagInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** 선택된 태그. */
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

/** 입력한 항목을 제거 가능한 칩으로; 값은 string[]. */
export function TagInput(props: TagInputProps): React.JSX.Element;
