import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual action variant mapped through LK theme tokens. Also accepts "solid" and "outlined". @default "primary" */
  variant?:
    | "primary"
    | "secondary"
    | "signal"
    | "danger"
    | "dark"
    | "flat"
    | "ghost"
    | "on-dark"
    | "solid"
    | "outlined";
  /** color axis for solid/outlined buttons. @default "primary" */
  color?: "primary" | "assistive";
  /** Control height, padding, and text size. Aliases map small/medium/large to sm/md/lg. @default "md" */
  size?: "sm" | "md" | "lg" | "small" | "medium" | "large";
  /** @deprecated Kept as a no-op compatibility prop. */
  arrow?: boolean;
  /** Fill the available container width. @default false */
  full?: boolean;
  /** Disable activation and mark the control unavailable. @default false */
  disabled?: boolean;
  /** Disable alias. @default false */
  disable?: boolean;
  /**
   * Render the icon-only square button treatment. Requires `aria-label` (or
   * `aria-labelledby`); a development-only console warning fires when neither
   * is supplied.
   * @default false
   */
  iconOnly?: boolean;
  /**
   * Show the action loading state and prevent repeated activation. The control
   * stays focusable while loading (`aria-disabled` + `aria-busy` rather than
   * native `disabled`) so keyboard focus is not lost on activation.
   *
   * `true` swaps the label for a centered spinner on the muted palette.
   * `"inline"` keeps the label visible with a leading spinner and preserves
   * the variant palette — for controls whose words must survive the wait
   * (e.g. a safety stop reading "정지 요청 중"). Blocking semantics are
   * identical in both modes.
   * @default false
   */
  loading?: boolean | 'inline';
  /** Screen-reader label announced with the loading spinner (`loading` = `true`). @default "불러오는 중" */
  loadingLabel?: string;
  /** Render with another element or component, such as "a" for link CTAs. @default "button" */
  as?: React.ElementType;
  children?: React.ReactNode;
}

/**
 * Action/Button primitive. LDS keeps the role while mapping color,
 * state, and emphasis through LK theme tokens.
 */
export function Button(props: ButtonProps): React.JSX.Element;
