import * as React from 'react';

export interface RatingProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onChange'> {
  value?: number;
  defaultValue?: number;
  /** 별 개수. `aria-valuemax`와 값 문구의 만점이 됩니다. @default 5 */
  max?: number;
  /** 값이 실제로 바뀔 때만 호출됩니다. */
  onChange?: (value: number) => void;
  /** 별 크기(px). @default 20 */
  size?: number;
  /** 표시 전용(`role="img"`, 포커스·입력 없음). @default false */
  readOnly?: boolean;
  /** 입력 모드 slider의 접근 이름. `aria-label`/`aria-labelledby`로 덮어쓸 수 있습니다. @default "평점" */
  label?: string;
  /** 값 문구 생성기(`aria-valuetext`, 읽기 전용 모드의 이름). @default (v, max) => `${max}점 만점에 ${v}점` */
  valueText?: (value: number, max: number) => string;
}

/** 뮤트 오커 색의 별점 — 입력 모드는 APG slider, 읽기 전용 모드는 값이 이름인 이미지. */
export function Rating(props: RatingProps): React.JSX.Element;
