import * as React from 'react';

export type AutoCompleteOption = string | { value: string; label: React.ReactNode };

export interface AutoCompleteProps {
  options: AutoCompleteOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** 선택된 옵션의 값과 함께 호출. */
  onSelect?: (value: string) => void;
  placeholder?: string;
  /** @default "md" */
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

/** 필터링된 제안 목록이 있는 텍스트 입력. */
export function AutoComplete(props: AutoCompleteProps): JSX.Element;
