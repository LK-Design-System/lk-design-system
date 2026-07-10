import * as React from 'react';

export interface IconPickerOption {
  value: string;
  icon: React.ReactNode;
  label?: string;
  disabled?: boolean;
}

export interface IconPickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  options?: IconPickerOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** 열 수. @default 6 */
  columns?: number;
  /** 타일 크기. @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Radiogroup accessible name. @default "아이콘 선택" */
  label?: string;
  disabled?: boolean;
  emptyLabel?: React.ReactNode;
}

/** 선택 가능한 아이콘 타일 그리드(빌딩·마커·카테고리 아이콘 지정). */
export function IconPicker(props: IconPickerProps): JSX.Element;
