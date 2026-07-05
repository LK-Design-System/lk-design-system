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

/** 다중 선택 드롭다운 — 트리거 안의 칩, 체크 가능한 옵션. */
export function Combobox(props: ComboboxProps): JSX.Element;
