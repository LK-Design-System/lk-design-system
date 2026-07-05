import * as React from 'react';

export interface TelemetryGaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  min?: number;
  max?: number;
  /** 중앙 숫자 아래 단위(예: "%", "km/h"). */
  unit?: string;
  /** 하단 라벨. */
  label?: React.ReactNode;
  /** 지름(px). @default 120 */
  size?: number;
  /** 링 두께(px). @default 10 */
  thickness?: number;
  /** 퍼센트 임계값 색상: ≤low 레드, ≤high 앰버, 그 외 그린. */
  thresholds?: { low: number; high: number };
  /** 고정 톤(thresholds보다 우선). */
  tone?: 'signal' | 'positive' | 'cautionary' | 'negative';
}

/** 270° 라디얼 게이지 — 배터리·속도 등 텔레메트리. 값·단위를 중앙에 표시. */
export function TelemetryGauge(props: TelemetryGaugeProps): JSX.Element;
