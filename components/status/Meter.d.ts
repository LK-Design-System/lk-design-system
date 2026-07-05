import * as React from 'react';

export interface MeterProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  label?: React.ReactNode;
  /** 퍼센트 임계값: ≤low 레드, ≤high 앰버, 그 외 그린. */
  thresholds?: { low: number; high: number };
  /** @default "md" */
  size?: 'sm' | 'md';
  /** "value/max" 표시. @default true */
  showValue?: boolean;
}

/** 레드→앰버→그린 임계값(옵션)이 있는 라벨 값 바. */
export function Meter(props: MeterProps): JSX.Element;
