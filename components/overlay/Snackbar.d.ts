import * as React from "react";

export interface SnackbarProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  action?: React.ReactNode;
  onAction?: () => void;
  icon?: React.ReactNode;
  /** icon axis. @default false */
  leadingIcon?: boolean;
  /** close button axis. @default false */
  closeButton?: boolean;
  onClose?: () => void;
  /** 닫기 버튼의 접근성 레이블. @default "닫기" */
  closeLabel?: string;
  /** snackbar width. @default 384 */
  width?: number | string;
}

/** snackbar with heading, description, icon, action, and close button slots. */
export function Snackbar(props: SnackbarProps): JSX.Element;
