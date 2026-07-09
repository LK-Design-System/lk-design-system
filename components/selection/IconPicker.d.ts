import * as React from 'react';

export interface IconPickerOption {
  value: string;
  icon: React.ReactNode;
  label?: string;
}

export interface IconPickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  options?: IconPickerOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** 열 수. @default 6 */
  columns?: number;
}

/** 선택 가능한 아이콘 타일 그리드(빌딩·마커·카테고리 아이콘 지정). */
export function IconPicker(props: IconPickerProps): JSX.Element;
