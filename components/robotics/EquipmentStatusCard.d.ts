import * as React from 'react';

export interface EquipmentStatusCardChip {
  label?: React.ReactNode;
  /** @default "neutral" */
  tone?: 'positive' | 'cautionary' | 'negative' | 'signal' | 'neutral';
}

export interface EquipmentStatusCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 헤더 아이콘(문·엘리베이터·계단리프트 등 — 앱이 주입). */
  icon?: React.ReactNode;
  /** 설비 이름/위치(예: "정문", "화물 엘리베이터 2호기"). */
  title?: React.ReactNode;
  /** 우측 헤드라인 상태 텍스트(예: "OPEN", "3F", "연결 끊김"). */
  ringLabel?: React.ReactNode;
  /** 상태 서브라인 텍스트(chips가 없을 때 표시, 예: "이동 중"). */
  ringCaption?: React.ReactNode;
  /** 상태 점 · 방향 화살표 · 기본 칩 색. @default "neutral" */
  tone?: 'positive' | 'cautionary' | 'negative' | 'signal' | 'neutral';
  /** 이동 중일 때 점 대신 dim 방향 화살표 표시. */
  direction?: 'up' | 'down';
  /** 통신성 상태(연결 끊김·재연결 등)일 때 점 대신 `ConnectionBadge` 시그널 바 표시. */
  connection?: 'online' | 'reconnecting' | 'weak' | 'offline';
  /** 하단 상태 칩 로우 — 항목별로 독립된 tone 지정 가능. */
  chips?: EquipmentStatusCardChip[];
}

/** 설비 상태 카드(문·엘리베이터·계단리프트) — 아이콘+타이틀 헤더, 우측 톤 점+잉크 상태 라벨, 이동 시 dim 방향 화살표, 통신 상태 시 ConnectionBadge 시그널 바, 하단 상태 칩. */
export function EquipmentStatusCard(props: EquipmentStatusCardProps): JSX.Element;
