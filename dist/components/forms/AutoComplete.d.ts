import * as React from 'react';

export type AutoCompleteOption = string | {
  value: string;
  label: React.ReactNode;
  inputValue?: string;
  disabled?: boolean;
};

export interface AutoCompleteProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'defaultValue' | 'onChange' | 'onSelect' | 'size' | 'style' | 'value'
> {
  options: AutoCompleteOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** 선택된 옵션의 값과 함께 호출. */
  onSelect?: (value: string) => void;
  label?: React.ReactNode;
  helper?: React.ReactNode;
  error?: React.ReactNode;
  invalid?: boolean;
  status?: 'normal' | 'positive' | 'negative';
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  emptyLabel?: React.ReactNode;
  /** @default "md" */
  size?: 'sm' | 'md' | 'small' | 'medium';
  /** 제어와 팝업을 감싸는 기존 컨테이너 스타일. */
  style?: React.CSSProperties;
  /** label/helper/error를 포함한 전체 필드 스타일. */
  fieldStyle?: React.CSSProperties;
}

/** 필터링된 제안 목록이 있는 editable single-value combobox. */
export function AutoComplete(props: AutoCompleteProps): React.JSX.Element;
