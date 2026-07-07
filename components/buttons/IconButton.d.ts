import * as React from "react";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual action variant mapped through LK theme tokens. @default "soft" */
  variant?: "soft" | "solid" | "signal" | "ghost" | "on-dark";
  /** Square control size in px or size key. @default "medium" */
  size?: number | "custom" | "small" | "sm" | "medium" | "md";
  /** alternative inverse treatment. @default false */
  alternative?: boolean;
  /** Render as a circular control instead of the default rounded square. @default false */
  round?: boolean;
  /** Disable alias. @default false */
  disable?: boolean;
  /** Required accessible label for the icon-only control. */
  label: string;
  /** Icon glyph or inline SVG content. */
  children?: React.ReactNode;
}

/** Action/Icon Button primitive for icon-only one-shot actions. */
export function IconButton(props: IconButtonProps): JSX.Element;
