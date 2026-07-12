import * as React from 'react';

export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 세로 공간 확보. */
  minHeight?: number | string;
  children?: React.ReactNode;
}

/** 자식을 양 축으로 가운데 정렬. */
export function Center(props: CenterProps): React.JSX.Element;
