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
}

/** Rounded LDS checkbox, or source-style check mark treatment via `variant="mark"`. */
export function Checkbox(props: CheckboxProps): JSX.Element;
