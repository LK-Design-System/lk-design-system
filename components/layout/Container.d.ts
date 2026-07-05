import * as React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 폭 단계:
   * - `default` — 반응형 컬럼(lg까지 ≤1100, xl에서 1440)
   * - `read` — 좁은 리딩 밴드(1100)
   * - `wide` — 풀블리드 레일(1500)
   * @default "default"
   */
  size?: 'default' | 'read' | 'wide';
  children?: React.ReactNode;
}

/** 반응형 콘텐츠 폭 + 여백이 있는 중앙 정렬 페이지 컨테이너. */
export function Container(props: ContainerProps): JSX.Element;
