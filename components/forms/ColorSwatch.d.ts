import * as React from 'react';

export interface ColorSwatchOption {
  /** 임의의 CSS 색. 스와치의 값이자 배경으로 쓰입니다. */
  value: string;
  /** 스와치의 접근 가능 이름(한국어 색 이름). 생략하면 `색상 N`으로 대체됩니다. */
  label?: string;
  disabled?: boolean;
}

export interface ColorSwatchProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 색상(임의의 CSS 색) 또는 색 이름을 담은 항목. */
  colors: Array<string | ColorSwatchOption>;
  value?: string;
  defaultValue?: string;
  onChange?: (color: string) => void;
  /** 스와치 크기(px). @default 28 */
  size?: number;
  /** @default "rounded" */
  shape?: 'rounded' | 'circle';
  /** radiogroup의 접근 가능 이름. @default "색상 선택" */
  label?: string;
  /** 그룹 전체를 비활성화합니다. */
  disabled?: boolean;
}

/** 단일 선택 색상 스와치 radiogroup; 활성은 시그널 잉크 링과 체크 표시를 얻음. */
export function ColorSwatch(props: ColorSwatchProps): React.JSX.Element;
