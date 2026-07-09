import * as React from 'react';

export interface PropertyFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label: React.ReactNode;
  hint?: React.ReactNode;
  /** 커밋된(적용된) 현재 값. */
  value?: string | number | boolean;
  /** @default "text" */
  type?: 'number' | 'text' | 'toggle';
  min?: number;
  max?: number;
  /** @default 1 */
  step?: number;
  unit?: React.ReactNode;
  /** 값이 baseline과 달라진 뒤 Apply를 눌렀을 때 커밋. */
  onApply?: (value: string | number | boolean) => void;
}

/** 파라미터 행: 라벨 + 컨트롤 + dirty일 때만 활성화되는 개별 Apply(설정·튜닝 패널). */
export function PropertyField(props: PropertyFieldProps): JSX.Element;
