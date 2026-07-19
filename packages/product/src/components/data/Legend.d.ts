import * as React from 'react';

export interface LegendItem {
  id?: React.Key;
  label: React.ReactNode;
  color: string;
  /** @default "square" */
  shape?: 'dot' | 'line' | 'square';
  dashed?: boolean;
  value?: React.ReactNode;
  muted?: boolean;
  disabled?: boolean;
}

export interface LegendProps extends React.HTMLAttributes<HTMLUListElement> {
  items?: LegendItem[];
  /** @default "horizontal" */
  direction?: 'horizontal' | 'vertical';
  /** @default "md" */
  size?: 'sm' | 'md';
  emptyLabel?: React.ReactNode;
}

/** 맵·차트·다이어그램용 색상 키(스와치 + 라벨 + 선택적 값). */
export function Legend(props: LegendProps): React.JSX.Element;
