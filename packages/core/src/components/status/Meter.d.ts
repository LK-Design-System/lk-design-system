import * as React from 'react';

export interface MeterThresholdLabels {
  /** ≤low 구간 문구. @default "위험" */
  negative?: string;
  /** ≤high 구간 문구. @default "주의" */
  cautionary?: string;
  /** 그 외 구간 문구. @default "양호" */
  positive?: string;
}

export interface MeterProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  label?: React.ReactNode;
  /** 퍼센트 임계값: ≤low 레드, ≤high 앰버, 그 외 그린. */
  thresholds?: { low: number; high: number };
  /** 임계 구간을 색 대신 전달하는 문구를 재정의합니다(WCAG 1.4.1). */
  thresholdLabels?: MeterThresholdLabels;
  /** @default "md" */
  size?: 'sm' | 'md';
  /** "value/max" 표시. @default true */
  showValue?: boolean;
}

/**
 * 레드→앰버→그린 임계값(옵션)이 있는 라벨 값 바.
 * `role="meter"`로 노출되고 `aria-valuenow/min/max`는 caller의 value/max 단위를 그대로 씁니다.
 */
export function Meter(props: MeterProps): React.JSX.Element;
