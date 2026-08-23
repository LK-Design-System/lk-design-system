import * as React from 'react';

export interface TelemetryValueProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 수치 라벨. */
  label?: React.ReactNode;
  /** 표시할 scalar 값. 주변 공백은 정규화합니다. 값이 없을 때 쓰는 dash placeholder(`"—"`/`"-"`)는 display weight·strong ink 없이 렌더링됩니다. */
  value: string | number;
  /** 문자열 단위. `%`/`‰`/평면각 `°`는 붙고, SI·복합 단위는 한 칸 띄웁니다. */
  unit?: string;
  /** 값의 의미 상태. 값 자체의 전경색은 바꾸지 않습니다. @default "neutral" */
  tone?: 'neutral' | 'signal' | 'positive' | 'cautionary' | 'negative';
  /** tone과 함께 보이는 상태 문구. 미지정 시 tone의 기본 한국어 문구를 사용합니다. */
  statusLabel?: React.ReactNode;
  /** 갱신 시각. helper가 있어도 함께 표시됩니다. */
  timestamp?: React.ReactNode;
  /** stale 상태. @default false */
  stale?: boolean;
  /** stale 상태 badge 라벨. @default "지연" */
  staleLabel?: React.ReactNode;
  /** stale badge 표시 여부. 외부에 동등한 텍스트 상태가 있을 때만 끄세요. @default true */
  showStaleBadge?: boolean;
  /** timestamp와 함께 표시할 보조 문구. */
  helper?: React.ReactNode;
  /** 정렬. @default "start" */
  align?: 'start' | 'end';
  /** 배치. "vertical"은 라벨 위·값 아래의 KPI 타일, "horizontal"은 라벨과 값을 한 줄에 두고 값 타이포를 supporting-text 단계로 낮춘 요약 띠용 변형입니다. 값·단위·tone·stale 의미 계약은 동일합니다. @default "vertical" */
  orientation?: 'vertical' | 'horizontal';
  /** 밀도. @default "md" */
  size?: 'sm' | 'md';
}

/** 값, 단위, 보이는 상태, freshness/timestamp를 함께 표시하는 compact telemetry readout. */
export function TelemetryValue(props: TelemetryValueProps): React.JSX.Element;
