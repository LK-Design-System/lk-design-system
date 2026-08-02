import * as React from "react";
import type { LdsClassNames, LdsStyles, LdsVars } from '../internal/surface.js';

export type SelectPart = 'root' | 'label' | 'control' | 'trigger' | 'value' | 'indicators' | 'dropdown' | 'option' | 'message';
export type SelectVariable =
  | '--lds-select-min-width'
  | '--lds-select-height'
  | '--lds-select-dropdown-max-height';

export interface SelectOption {
  value: string;
  label: React.ReactNode;
  /** Marks this option unavailable; keyboard navigation skips it and activation is blocked. */
  disabled?: boolean;
}

export interface SelectProps {
  /** 컨트롤 위의 필드 라벨. */
  label?: React.ReactNode;
  helper?: React.ReactNode;
  error?: React.ReactNode;
  /** 옵션은 문자열 또는 `{ value, label }`. 생략하면 `<option>` 자식을 읽음. */
  options?: Array<string | SelectOption>;
  /** 제어되는 선택 값. */
  value?: string;
  /** 비제어 시 초기 값. */
  defaultValue?: string;
  /** 아무것도 선택되지 않았을 때 표시되는 플레이스홀더. @default "선택" */
  placeholder?: string;
  /** 선택된 옵션의 값과 함께 호출. */
  onChange?: (value: string) => void;
  required?: boolean;
  invalid?: boolean;
  status?: "normal" | "positive" | "negative";
  disabled?: boolean;
  /** Keeps the current selection focusable and legible while preventing changes. */
  readOnly?: boolean;
  /** @deprecated Use `disabled`. */
  disable?: boolean;
  /** @deprecated Use `invalid` or `status="negative"`. */
  negative?: boolean;
  /** @default "md" */
  size?: "sm" | "md" | "lg" | "small" | "medium" | "large";
  /** Opens the uncontrolled popup initially unless the control is disabled or read-only. */
  defaultOpen?: boolean;
  interaction?:
    | "normal"
    | "inactive"
    | "hovered"
    | "focused"
    | "active"
    | "active-focused"
    | "open";
  /** active visual state alias. */
  active?: boolean;
  /** focus visual state alias. */
  focus?: boolean;
  /** overflow evidence axis; accepted for API parity. */
  overflow?: boolean;
  /** platform evidence axis; accepted for API parity. */
  platform?: "ios" | "android" | "web";
  /** select variant evidence axis; accepted for API parity. */
  variant?: "normal";
  /** 선택 값을 텍스트 또는 칩으로 표시. @default "text" */
  render?: "text" | "chip";
  iconLeft?: React.ReactNode;
  id?: string;
  /** 접근 가능한 이름. 보이는 `label`이 없을 때 지정합니다. */
  "aria-label"?: string;
  /** 외부 라벨 요소의 id. */
  "aria-labelledby"?: string;
  /** 외부 설명 id. 내부 helper/error id와 함께 연결됩니다. */
  "aria-describedby"?: string;
  /** 트리거 키보드 이벤트. preventDefault하면 기본 Select 키보드 동작을 건너뜁니다. */
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  /** 트리거 클릭 이벤트. preventDefault하면 기본 열기/닫기를 건너뜁니다. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** `<option>` 자식(하위 호환) — `options`가 없을 때 사용. */
  children?: React.ReactNode;
  /** Public root class and style. */
  className?: string;
  style?: React.CSSProperties;
  /** Native combobox trigger class and style. */
  triggerClassName?: string;
  triggerStyle?: React.CSSProperties;
  /** Public root ref; the default ref targets the native trigger button. */
  rootRef?: React.Ref<HTMLDivElement>;
  classNames?: LdsClassNames<SelectPart>;
  styles?: LdsStyles<SelectPart>;
  vars?: LdsVars<SelectVariable>;
  /** Escape clipping ancestors through the owner-document Portal. @default true */
  withinPortal?: boolean;
  portalTarget?: HTMLElement | null;
  zIndex?: number;
  /** Preferred popup side; flips when space is insufficient. @default "bottom" */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Popup alignment. @default "left" */
  align?: 'left' | 'right';
  /** Trigger-to-popup gap in pixels. @default 6 */
  offset?: number;
}

/** 커스텀 단일 선택 드롭다운(스타일된 트리거 + 플로팅 패널, 시그널 포커스). 네이티브 `<select>`가 아님. */
export const Select: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLButtonElement>>;
