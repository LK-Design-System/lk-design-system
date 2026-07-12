import * as React from 'react';

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 대문자 라벨. */
  label?: React.ReactNode;
  /** 큰 값. */
  value?: React.ReactNode;
  /** 값 뒤의 단위. */
  unit?: React.ReactNode;
  /** 증감: 숫자 → 자동 상/하 화살표와 함께 "+N%", 또는 노드. */
  delta?: number | React.ReactNode;
  /** 기존 방향+색상 결합 API. 새 코드에서는 changeDirection/changeTone을 분리하세요. @default "auto" */
  deltaTone?: 'auto' | 'up' | 'down' | 'flat';
  /** 수치 변화 방향. auto에서 숫자 0은 flat으로 처리합니다. @default "auto" */
  changeDirection?: 'auto' | 'up' | 'down' | 'flat';
  /** 변화가 지표 관점에서 좋은지, 나쁜지, 주의인지 나타내는 의미 tone. */
  changeTone?: 'positive' | 'negative' | 'cautionary' | 'neutral';
  /** 명시적 changeTone 옆의 비색상 의미 라벨. 기본값은 개선/악화/주의/중립. */
  changeToneLabel?: React.ReactNode;
  /** 측정 기간 또는 시간 범위. */
  period?: React.ReactNode;
  /** 비교 기준. */
  baseline?: React.ReactNode;
  caption?: React.ReactNode;
  /** 데이터 갱신 시각 또는 freshness 문구. */
  lastUpdated?: React.ReactNode;
  /** 카드 하단의 링크형 액션 또는 상태 복구 액션. */
  action?: React.ReactNode;
  icon?: React.ReactNode;
  loading?: boolean;
  loadingLabel?: React.ReactNode;
  empty?: boolean;
  emptyLabel?: React.ReactNode;
  error?: React.ReactNode;
  stale?: boolean;
  staleLabel?: React.ReactNode;
}

/** KPI 타일 — 값·단위·기간·기준·변화 의미·resource/freshness 상태·액션. */
export function MetricCard(props: MetricCardProps): React.JSX.Element;
