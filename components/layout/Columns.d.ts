import * as React from 'react';

export interface ColumnsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 나눌 그리드 트랙 수. @default 12 */
  columns?: number;
  /** 컬럼 & 행 갭 단축(숫자 = px). 기본값 `--grid-gutter`(20). */
  gap?: number | string;
  /** 컬럼 사이 가로 갭. */
  columnGap?: number | string;
  /** 줄바꿈된 행 사이 세로 갭. */
  rowGap?: number | string;
  children?: React.ReactNode;
}

/**
 * 레이아웃을 나누는 반응형 컬럼 그리드(12컬럼 그리드). 브레이크포인트별로
 * 트랙을 차지하는 `Col` 자식과 함께 쓰세요.
 */
export function Columns(props: ColumnsProps): React.JSX.Element;
