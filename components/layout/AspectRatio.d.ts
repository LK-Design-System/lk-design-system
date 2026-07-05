import * as React from 'react';

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 너비 / 높이. @default 16/9 */
  ratio?: number;
  children?: React.ReactNode;
}

/** 미디어 / 지도 타일 / 비디오용 비율 고정 박스. */
export function AspectRatio(props: AspectRatioProps): JSX.Element;
