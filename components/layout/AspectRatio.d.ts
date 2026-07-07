import * as React from 'react';

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width / height ratio. Accepts a number or CSS aspect-ratio string. @default 16 / 9 */
  ratio?: number | string;
  children?: React.ReactNode;
}

export function AspectRatio(props: AspectRatioProps): JSX.Element;
