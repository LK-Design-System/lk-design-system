import * as React from 'react';

export interface TelemetryValueProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 수치 라벨. */
  label?: React.ReactNode;
  /** 표시할 값. */
  value: React.ReactNode;
  /** 단위. */
  unit?: React.ReactNode;
  /** 값의 의미 색. @default "neutral" */
  tone?: 'neutral' | 'signal' | 'positive' | 'cautionary' | 'negative';
  /** 갱신 시각. */
  timestamp?: React.ReactNode;
  /** stale 상태. @default false */
  stale?: boolean;
  /** stale 상태 badge 라벨. @default "지연" */
  staleLabel?: React.ReactNode;
  /** stale badge 표시 여부. 테이블에서는 상태 컬럼과 중복되지 않게 끌 수 있습니다. @default true */
  showStaleBadge?: boolean;
  /** timestamp 대신 표시할 보조 문구. */
  helper?: React.ReactNode;
  /** 정렬. @default "start" */
  align?: 'start' | 'end';
  /** 밀도. @default "md" */
  size?: 'sm' | 'md';
}

/** 값, 단위, 임계 톤, freshness/timestamp를 함께 표시하는 compact telemetry readout. */
export function TelemetryValue(props: TelemetryValueProps): JSX.Element;
