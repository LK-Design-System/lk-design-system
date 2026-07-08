import * as React from "react";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  /** tone. Legacy info/success/warning/error aliases are supported. @default "normal" */
  tone?:
    | "normal"
    | "assistive"
    | "positive"
    | "cautionary"
    | "negative"
    | "info"
    | "success"
    | "warning"
    | "error";
  /** Alias for the tone axis. */
  variant?: "normal" | "assistive" | "positive" | "cautionary" | "negative";
  children?: React.ReactNode;
  action?: React.ReactNode;
  onAction?: () => void;
  onClose?: () => void;
  /** leadingIcon axis. @default true */
  leadingIcon?: boolean;
  icon?: React.ReactNode;
}

/** transient dark-surface feedback toast with tone icon and optional action/close. */
export function Toast(props: ToastProps): JSX.Element;
