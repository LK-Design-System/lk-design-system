import * as React from 'react';

export interface ColorSwatchProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 색상(임의의 CSS 색). */
  colors: string[];
  value?: string;
  defaultValue?: string;
  onChange?: (color: string) => void;
  /** 스와치 크기(px). @default 28 */
  size?: number;
  /** @default "rounded" */
  shape?: 'rounded' | 'circle';
}

/** 선택 가능한 색상 스와치 행; 활성은 시그널 잉크 링을 얻음. */
export function ColorSwatch(props: ColorSwatchProps): React.JSX.Element;
