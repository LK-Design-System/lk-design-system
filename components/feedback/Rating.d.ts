import * as React from 'react';

export interface RatingProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onChange'> {
  value?: number;
  defaultValue?: number;
  /** 별 개수. @default 5 */
  max?: number;
  onChange?: (value: number) => void;
  /** 별 크기(px). @default 20 */
  size?: number;
  /** 표시 전용(호버/클릭 없음). @default false */
  readOnly?: boolean;
}

/** 뮤트 오커 색의 별점 — 인터랙티브 또는 읽기 전용. */
export function Rating(props: RatingProps): React.JSX.Element;
