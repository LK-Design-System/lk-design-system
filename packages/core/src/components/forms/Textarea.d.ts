import * as React from "react";
import type { LdsClassNames, LdsStyles, LdsVars } from '../internal/surface.js';

export type TextareaPart = 'root' | 'label' | 'control' | 'textarea' | 'statusIcon' | 'message';
export type TextareaVariable =
  | '--lds-textarea-min-height'
  | '--lds-textarea-max-height'
  | '--lds-textarea-padding'
  | '--lds-textarea-radius';

export interface TextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "style"
> {
  /** 박스 위에 렌더되는 필드 라벨. */
  label?: React.ReactNode;
  /** 박스 아래 보조 설명. */
  helper?: React.ReactNode;
  /** 박스 아래 오류 설명. */
  error?: React.ReactNode;
  /** 라벨에 레드 별표 추가. @default false */
  required?: boolean;
  /** 검증 오류용 레드 링. @default false */
  invalid?: boolean;
  /** 상태 링과 메시지 톤. @default "normal" */
  status?: "normal" | "positive" | "negative";
  /** 최소 높이 프리셋. @default "md" */
  size?: "sm" | "md" | "lg" | "small" | "medium" | "large";
  interaction?:
    "normal" | "inactive" | "hovered" | "focused" | "active" | "active-focused";
  /** active visual state alias. */
  active?: boolean;
  /** focus visual state alias. */
  focus?: boolean;
  /** @deprecated Use `disabled`. */
  disable?: boolean;
  /** resize axis. */
  resize?: "normal" | "fixed" | "limit";
  /** 처음 보이는 줄 수. @default 5 */
  rows?: number;
  /** 래퍼 스타일. */
  style?: React.CSSProperties;
  /** Public root class. */
  className?: string;
  /** Native textarea class. */
  textareaClassName?: string;
  /** Native textarea style. */
  textareaStyle?: React.CSSProperties;
  /** Public root ref; the default ref targets the native textarea. */
  rootRef?: React.Ref<HTMLDivElement>;
  classNames?: LdsClassNames<TextareaPart>;
  styles?: LdsStyles<TextareaPart>;
  vars?: LdsVars<TextareaVariable>;
}

/** Input의 박스·링·포커스 헤일로와 맞춘 여러 줄 텍스트 필드. */
export const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;
