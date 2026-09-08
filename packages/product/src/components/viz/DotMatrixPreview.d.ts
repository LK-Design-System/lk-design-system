import * as React from 'react';

export interface DotMatrixPreviewProps extends Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
  /** Panel width in pixels (dots). @default 128 */
  columns?: number;
  /** Panel height in pixels (dots). @default 32 */
  rows?: number;
  /** 1-bit frame, row-major from the top-left, MSB first inside each byte (`columns × rows / 8` bytes). */
  bitmap?: ArrayLike<number>;
  /** Alternative to `bitmap`: one truthy entry per lit dot in row-major order. Takes precedence when both are given. */
  pixels?: ArrayLike<boolean | 0 | 1>;
  /** Lit-dot colour as a 6-digit hex string. Invalid values fall back to white. @default "#ffffff" */
  color?: string;
  /** Panel brightness 0–255 applied to the lit colour, matching the value sent to the controller. @default 255 */
  brightness?: number;
  /** Visible title and the start of the canvas accessible name (e.g. "로봇 왼쪽 LED"). */
  label: React.ReactNode;
  /** Text alternative of what the frame shows (the message being rendered). Required for a meaningful accessible name whenever the frame is not empty. */
  description?: React.ReactNode;
  /** Optional connection or sync status composed with LDS status primitives. */
  status?: React.ReactNode;
  /** Dot geometry of the physical panel. @default "square" */
  dotShape?: 'square' | 'round';
  /** Summary shown when no dot is lit. @default "꺼진 화면" */
  emptyLabel?: React.ReactNode;
}

/** Physical-panel preview of a 1-bit dot-matrix frame with an accessible text alternative. */
export const DotMatrixPreview: React.ForwardRefExoticComponent<DotMatrixPreviewProps & React.RefAttributes<HTMLElement>>;
