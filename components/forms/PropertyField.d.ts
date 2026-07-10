import * as React from 'react';

export type PropertyFieldType = 'number' | 'text' | 'toggle';
export type PropertyFieldValue = string | number | boolean;

export interface PropertyFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label: React.ReactNode;
  hint?: React.ReactNode;
  /** 커밋된 현재 값. */
  value?: PropertyFieldValue;
  /** @default "text" */
  type?: PropertyFieldType;
  min?: number;
  max?: number;
  /** @default 1 */
  step?: number;
  unit?: React.ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  /** @default "적용" */
  applyLabel?: React.ReactNode;
  /** @default "변경됨" */
  dirtyLabel?: string;
  /** 값이 baseline과 달라진 뒤 Apply를 누르면 호출됩니다. */
  onApply?: (value: PropertyFieldValue) => void;
}

/** 파라미터 행: 라벨 + 컨트롤 + dirty일 때만 활성화되는 개별 Apply. */
export function PropertyField(props: PropertyFieldProps): JSX.Element;
