import * as React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Shape. `text` renders one or more line bars; `rect` and `circle` render a single block. @default "rect" */
  variant?: "rect" | "text" | "circle";
  /** Width in px, CSS length, or percent. @default "100%" */
  width?: number | string;
  /** text skeleton length axis. Overrides width when provided. */
  length?: "25%" | "50%" | "75%" | "100%" | number | string;
  /** Height in px or CSS length. Text defaults to 14px, rect to 16px, circle to width. */
  height?: number | string;
  /** Rect corner radius. Defaults to `--radius-lg`; circle always uses 50%. */
  radius?: number | string;
  /** Text-line count. The last line is shortened when more than one line is rendered. @default 1 */
  lines?: number;
  /** Horizontal alignment for text lines. @default "leading" */
  align?: "leading" | "center" | "trailing";
  /** Visual tone for normal or inverse/dark surfaces. @default "normal" */
  tone?: "normal" | "light" | "white";
  /** customize color axis. Use `white` for inverse-surface skeletons. */
  color?: string;
  /** animate axis. @default true */
  animate?: boolean;
  /** customize opacity axis. */
  opacity?: number | string;
}

/** Shimmering loading placeholder with rect, text, and circle shapes. */
export function Skeleton(props: SkeletonProps): JSX.Element;
