import * as React from "react";
import type { LdsClassNames, LdsStyles, LdsVars } from '../internal/surface.js';

export type InputPart = 'root' | 'label' | 'control' | 'startIcon' | 'input' | 'endIcon' | 'statusIcon' | 'action' | 'message';
export type InputVariable =
  | '--lds-input-height'
  | '--lds-input-padding-inline'
  | '--lds-input-radius'
  | '--lds-input-gap';

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "style" | "size"
> {
  /** 박스 위에 렌더되는 필드 라벨. */
  label?: React.ReactNode;
  /** 박스 아래 보조 설명. */
  helper?: React.ReactNode;
  /** 박스 아래 오류 설명. `invalid`와 같은 시각 상태를 적용. */
  error?: React.ReactNode;
  /** 박스 안 텍스트 왼쪽에 표시되는 인라인 SVG. */
  iconLeft?: React.ReactNode;
  /** 박스 안 텍스트 오른쪽에 표시되는 인라인 SVG. */
  iconRight?: React.ReactNode;
  /** leading icon alias. */
  leadingIcon?: React.ReactNode;
  /** trailing icon alias. */
  trailingIcon?: React.ReactNode;
  /** 우측 끝에 표시되는 액션 슬롯. */
  actionRight?: React.ReactNode;
  /** trailing action alias. */
  trailingButton?: React.ReactNode;
  /** 검증 오류용 레드 링. @default false */
  invalid?: boolean;
  /** 라벨에 레드 별표 추가. @default false */
  required?: boolean;
  /** 상태 링과 메시지 톤. @default "normal" */
  status?: "normal" | "positive" | "negative";
  /** 입력 높이 프리셋. @default "md" */
  size?: "sm" | "md" | "lg" | "small" | "medium" | "large";
  /** 프리셋 대신 사용할 명시적 높이. */
  height?: number | string;
  interaction?:
    "normal" | "inactive" | "hovered" | "focused" | "active" | "active-focused";
  /** active visual state alias. */
  active?: boolean;
  /** focus visual state alias. */
  focus?: boolean;
  /** @deprecated Use `disabled`. */
  disable?: boolean;
  /** textinput resize evidence axis; accepted for API parity. */
  resize?: "normal" | "fixed" | "limit";
  /** platform evidence axis; accepted for API parity. */
  platform?: "ios" | "android" | "web";
  /** field variant evidence axis; accepted for API parity. */
  variant?: "textfield" | "textarea";
  /** 래퍼 스타일(예: 그리드 셀용 minWidth). */
  style?: React.CSSProperties;
  /** Public root class. */
  className?: string;
  /** Native input class. */
  inputClassName?: string;
  /** Native input style. */
  inputStyle?: React.CSSProperties;
  /** Public root ref; the default ref targets the native input. */
  rootRef?: React.Ref<HTMLDivElement>;
  classNames?: LdsClassNames<InputPart>;
  styles?: LdsStyles<InputPart>;
  vars?: LdsVars<InputVariable>;
}

/** 한 줄 텍스트 필드 — 화이트 박스, 헤어라인 링, 그래파이트 포커스 헤일로. */
export const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
