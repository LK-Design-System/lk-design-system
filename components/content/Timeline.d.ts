import * as React from 'react';

export interface TimelineItem {
  /** 안정 키(없으면 인덱스). */
  id?: string | number;
  /** 화면에 보이는 시각 표기. */
  time?: React.ReactNode;
  /**
   * `<time dateTime>` 에 들어갈 기계 판독 값(ISO 8601). 생략하고 `time` 이
   * 문자열이면 그 값을 그대로 씁니다.
   */
  dateTime?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  tone?: 'signal' | 'positive' | 'cautionary' | 'negative' | 'neutral';
}

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TimelineItem[];
  /** 내부 `ol` 의 접근 가능한 이름(한 화면에 기록이 여럿일 때 구분용). */
  label?: string;
}

/** 세로 이벤트 타임라인 — 헤어라인 레일 위의 톤 노드. `ol/li` + `<time>` 시맨틱. */
export function Timeline(props: TimelineProps): React.JSX.Element;
