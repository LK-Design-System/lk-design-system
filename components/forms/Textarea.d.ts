import * as React from 'react';

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'> {
  /** 박스 위에 렌더되는 필드 라벨. */
  label?: React.ReactNode;
  /** 라벨에 레드 별표 추가. @default false */
  required?: boolean;
  /** 검증 오류용 레드 링. @default false */
  invalid?: boolean;
  /** 처음 보이는 줄 수. @default 5 */
  rows?: number;
  /** 래퍼 스타일. */
  style?: React.CSSProperties;
}

/** Input의 박스·링·포커스 헤일로와 맞춘 여러 줄 텍스트 필드. */
export function Textarea(props: TextareaProps): JSX.Element;
