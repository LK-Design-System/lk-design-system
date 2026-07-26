import * as React from "react";

export interface CheckboxProps {
  /** Optional label rendered next to the control. */
  label?: React.ReactNode;
  /** Controlled checked state. */
  checked?: boolean;
  /** Initial checked state for uncontrolled usage. */
  defaultChecked?: boolean;
  /** Mixed checkbox state. Applies to the default box variant. @default false */
  indeterminate?: boolean;
  /** Called with the next checked state. */
  onChange?: (checked: boolean) => void;
  /** Native form control name — submitted with the form when checked. */
  name?: string;
  /** Native form control value submitted when checked. @default "on" */
  value?: string;
  /** Visual style. `mark` renders the source-style check mark treatment. @default "box" */
  variant?: "box" | "mark";
  /** Semantic status tone for the mark variant. @default "normal" */
  status?: "normal" | "negative";
  /** fixed visual state for evidence matrices. */
  state?: "unchecked" | "checked" | "indeterminate";
  /** custom typography emphasis alias. */
  bold?: boolean;
  /** Control size. @default "md" */
  size?: "sm" | "md" | "small" | "medium";
  /** Reduces spacing between control and label. @default false */
  tight?: boolean;
  /** Forces visual interaction state for documentation matrices. */
  interaction?: "normal" | "inactive" | "hovered" | "focused";
  /** Blocks pointer and keyboard interaction. @default false */
  disabled?: boolean;
  /** disabled alias. */
  disable?: boolean;
  labelStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  id?: string;
  "aria-label"?: string;
  /** Forwarded to the native input; runs before the built-in Space toggle. */
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

/** Rounded LDS checkbox, or source-style check mark treatment via `variant="mark"`. */
export function Checkbox(props: CheckboxProps): React.JSX.Element;
