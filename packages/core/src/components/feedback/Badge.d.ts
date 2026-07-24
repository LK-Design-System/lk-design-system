import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 색상 톤. @default "signal" */
  tone?: 'signal' | 'positive' | 'cautionary' | 'negative' | 'navy' | 'steel' | 'amber' | 'red';
  /**
   * 톤 색상의 상태 점을 라벨 앞에 붙입니다. `children`이 있으면 텍스트가 점 옆에
   * 그대로 보이며, `children`이 없는 단독 점은 장식(`aria-hidden`)입니다.
   * 단독 점에 의미가 있으면 `aria-label`을 함께 전달해 `role="img"`로 이름을
   * 부여하세요. @default false
   */
  dot?: boolean;
  /**
   * 카운트 클램프. 숫자(또는 숫자 문자열) children이 이 값을 넘으면 `"max+"`로
   * 표시합니다. 텍스트 라벨은 클램프되지 않습니다. `null`이면 클램프 없음.
   * @default 99
   */
  max?: number | null;
  children?: React.ReactNode;
}

/** 작은 상태/카운트 토큰 — 솔리드 필, 또는 라벨 앞에 붙는 상태 점. */
export function Badge(props: BadgeProps): React.JSX.Element;
