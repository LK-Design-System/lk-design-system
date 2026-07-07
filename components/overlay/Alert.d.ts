import * as React from "react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  title?: React.ReactNode;
  /** heading axis. @default true */
  heading?: boolean;
  children?: React.ReactNode;
  description?: React.ReactNode;
  /** platform axis. @default "web" */
  platform?: "ios" | "android" | "web";
  /** Backward-compatible severity alias. */
  tone?:
    | "default"
    | "danger"
    | "negative"
    | "normal"
    | "assistive"
    | "info"
    | "error";
  /** variant axis. @default "normal" */
  variant?: "normal" | "assistive" | "negative";
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  primaryLabel?: React.ReactNode;
  secondaryLabel?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  actions?: React.ReactNode;
  closeOnScrim?: boolean;
}

/** modal feedback alert with iOS, Android, and Web treatments. */
export function Alert(props: AlertProps): JSX.Element | null;
