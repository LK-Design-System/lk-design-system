import * as React from 'react';

export interface TimelineItem {
  time?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  tone?: 'signal' | 'positive' | 'cautionary' | 'negative' | 'neutral';
}

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TimelineItem[];
}

/** 세로 이벤트 타임라인 — 헤어라인 레일 위의 톤 노드. */
export function Timeline(props: TimelineProps): JSX.Element;
