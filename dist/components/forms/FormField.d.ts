import * as React from 'react';

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  /** 레드 필수 별표 표시. @default false */
  required?: boolean;
  /** 헬퍼 텍스트(`error`가 설정되면 숨김). */
  helper?: React.ReactNode;
  /** 에러 텍스트(메시지를 레드로 틴트). */
  error?: React.ReactNode;
  /** 라벨의 `htmlFor`. */
  htmlFor?: string;
  children?: React.ReactNode;
}

/** 라벨 래퍼: 라벨(+ 필수) · 컨트롤 · 헬퍼/에러. */
export function FormField(props: FormFieldProps): React.JSX.Element;
