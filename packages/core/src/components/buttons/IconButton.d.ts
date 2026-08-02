import * as React from "react";

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** Visual action variant mapped through LK theme tokens. @default "soft" */
  variant?: "soft" | "solid" | "signal" | "ghost" | "plain" | "on-dark";
  /** Square control size in px or size key. `xs`/`xsmall` is the 24px dense-action extension; `custom` preserves the WDS 28px compatibility size. @default "medium" */
  size?: number | "xsmall" | "xs" | "custom" | "small" | "sm" | "medium" | "md";
  /** alternative inverse treatment. @default false */
  alternative?: boolean;
  /** Circular control (WDS default). Pass false to opt into the rounded-square look. @default true */
  round?: boolean;
  /** Disable alias. @default false */
  disable?: boolean;
  /** Required accessible label for the icon-only control. */
  label: string;
  /** Icon glyph or inline SVG content. */
  children?: React.ReactNode;
}

/** Action/Icon Button primitive for icon-only one-shot actions. */
export function IconButton(props: IconButtonProps): React.JSX.Element;
