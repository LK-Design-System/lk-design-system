import * as React from "react";

export interface ChipProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Render element. Use "a" for linked chips.
   * @default onClick ? "button" : "span"
   */
  as?: React.ElementType;
  /** chip size mapped from xsmall/small/medium/large. @default "md" */
  size?: "xs" | "sm" | "md" | "lg" | "xsmall" | "small" | "medium" | "large";
  /** chip visual variant mapped through LK theme tokens. @default "default" */
  variant?: "default" | "solid" | "outlined";
  /** Selected or pinned chip state. @default false */
  selected?: boolean;
  /** Active alias. @default false */
  active?: boolean;
  /**
   * Explicit toggle state. Overrides `selected`/`active` when deciding the
   * `aria-pressed` value of an interactive chip.
   */
  pressed?: boolean;
  /**
   * Visually hidden text appended to a *non-interactive* selected chip so the
   * selected state is not carried by colour alone. Pass `null` to opt out.
   * @default "선택됨"
   */
  selectedLabel?: React.ReactNode;
  /** Disable pointer activation and show unavailable styling. @default false */
  disabled?: boolean;
  /** Disable alias. @default false */
  disable?: boolean;
  /** Optional leading icon content. */
  leading?: React.ReactNode;
  /** Optional thumbnail content. Takes precedence over leading. */
  thumbnail?: React.ReactNode;
  href?: string;
  children?: React.ReactNode;
}

/** Action/Chip primitive for compact labels, links, selected tags, and content chips. */
export function Chip(props: ChipProps): React.JSX.Element;
