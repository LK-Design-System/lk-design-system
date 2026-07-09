import * as React from 'react';

export interface LegendItem {
  label: React.ReactNode;
  color: string;
  /** @default "square" */
  shape?: 'dot' | 'line' | 'square';
  value?: React.ReactNode;
  muted?: boolean;
}

export interface LegendProps extends React.HTMLAttributes<HTMLUListElement> {
  items?: LegendItem[];
  /** @default "horizontal" */
  direction?: 'horizontal' | 'vertical';
}

/** 맵·차트·다이어그램용 색상 키(스와치 + 라벨). */
export function Legend(props: LegendProps): JSX.Element;
