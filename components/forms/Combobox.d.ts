import * as React from 'react';

export type ComboboxOption = string | { value: string; label: React.ReactNode };

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  /** @default "md" */
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

/** 검색이 필요 없는 소규모 목록용 호환 다중 선택. 검색/비동기 목록에는 SearchableMultiSelect를 권장합니다. */
export function Combobox(props: ComboboxProps): JSX.Element;
