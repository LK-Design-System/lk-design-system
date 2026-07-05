import * as React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style'> {
  /** 박스 위에 렌더되는 필드 라벨. */
  label?: React.ReactNode;
  /** 박스 안 텍스트 왼쪽에 표시되는 인라인 SVG. */
  iconLeft?: React.ReactNode;
  /** 박스 안 텍스트 오른쪽에 표시되는 인라인 SVG. */
  iconRight?: React.ReactNode;
  /** 검증 오류용 레드 링. @default false */
  invalid?: boolean;
  /** 라벨에 레드 별표 추가. @default false */
  required?: boolean;
  /** 래퍼 스타일(예: 그리드 셀용 minWidth). */
  style?: React.CSSProperties;
}

/** 한 줄 텍스트 필드 — 화이트 박스, 헤어라인 링, 그래파이트 포커스 헤일로. */
export function Input(props: InputProps): JSX.Element;
