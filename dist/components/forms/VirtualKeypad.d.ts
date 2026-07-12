import * as React from 'react';

export type VirtualKeypadMode = 'integer' | 'decimal';

export type VirtualKeypadChangeAction =
  | 'digit'
  | 'decimal'
  | 'sign'
  | 'backspace'
  | 'clear';

export interface VirtualKeypadChangeMeta {
  action: VirtualKeypadChangeAction;
  /** Canonical key, independent of the localized visible decimal separator. */
  key: string;
}

export interface VirtualKeypadProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'onChange'
> {
  /** Controlled canonical value. Decimal values always use `.` internally. */
  value: string;
  onChange: (value: string, meta: VirtualKeypadChangeMeta) => void;
  onConfirm: (value: string) => void;
  /** @default "integer" */
  mode?: VirtualKeypadMode;
  /** Show the sign-toggle key and allow negative confirmation. @default false */
  allowNegative?: boolean;
  /** BCP 47 locale used only for the visible decimal key. @default "ko-KR" */
  locale?: string;
  /** Confirmation lower bound. Intermediate input is never clamped. */
  min?: number;
  /** Confirmation upper bound. Intermediate input is never clamped. */
  max?: number;
  /** Maximum canonical string length, including sign and decimal point. */
  maxLength?: number;
  /** Disable every keypad action. @default false */
  disabled?: boolean;
  /** Disable confirmation without disabling editing actions. @default false */
  confirmDisabled?: boolean;
  /** Existing input id whose focus may be preserved during pointer activation. */
  targetId?: string;
  /** @default "모두 지우기" */
  clearLabel?: string;
  /** @default "마지막 자리 지우기" */
  backspaceLabel?: string;
  /** @default "부호 전환" */
  signLabel?: string;
  /** @default "확인" */
  confirmLabel?: string;
}

/** Controlled three-column numeric keypad for Product kiosk and embedded flows. */
export function VirtualKeypad(props: VirtualKeypadProps): React.JSX.Element;
