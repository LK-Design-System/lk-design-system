import * as React from 'react';

export interface BatteryGaugeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 배터리 잔량(0–100). @default 0 */
  value?: number;
  /**
   * 제품이 결정한 의미 상태. 생략하면 호환성을 위해 기존 20/50 잔량
   * 임계값을 적용합니다.
   */
  tone?: 'neutral' | 'signal' | 'positive' | 'cautionary' | 'negative';
  /** % 라벨 표시. @default true */
  showLabel?: boolean;
  /** @default "md" */
  size?: 'sm' | 'md';
}

/** 배터리 잔량 인디케이터(셸 + 레벨색 fill + % 표기). */
export function BatteryGauge(props: BatteryGaugeProps): React.JSX.Element;
