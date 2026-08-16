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
  /**
   * 'vertical'(기본)은 로그를 위→아래로, 'horizontal'은 연대기를 좌→우로
   * 읽습니다. 가로에서 각 사건은 등분 컬럼(`minmax(0, 1fr)`)이라 사건이
   * 적을수록 한 칸이 넓어지고, 레일은 마지막 노드 앞에서 멈춥니다.
   * 표현 축일 뿐 `ol`/`time` 시맨틱은 동일합니다.
   * @default "vertical"
   */
  orientation?: 'vertical' | 'horizontal';
}

/** 이벤트 타임라인(세로 기본, 가로 옵션) — 헤어라인 레일 위의 톤 노드. `ol/li` + `<time>` 시맨틱. */
export function Timeline(props: TimelineProps): React.JSX.Element;
