import * as React from 'react';

export interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 기본(모바일) 폭에서 차지할 컬럼 수(1–12). @default 12 */
  span?: number;
  /** sm 브레이크포인트(≥768)부터 차지할 컬럼 수. */
  sm?: number;
  /** md 브레이크포인트(≥992)부터 차지할 컬럼 수. */
  md?: number;
  /** lg 브레이크포인트(≥1200)부터 차지할 컬럼 수. */
  lg?: number;
  children?: React.ReactNode;
}

/** `Columns`의 스팬 자식. */
export function Col(props: ColProps): JSX.Element;
