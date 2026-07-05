import * as React from 'react';

export interface ClusterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 갭. @default 10 */
  gap?: number | string;
  align?: React.CSSProperties['alignItems'];
  justify?: React.CSSProperties['justifyContent'];
  children?: React.ReactNode;
}

/** 균등 갭의 줄바꿈 행 — 칩, 태그, 메타데이터. */
export function Cluster(props: ClusterProps): JSX.Element;
