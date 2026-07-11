import * as React from "react";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  /** tone. Legacy info/success/warning/error aliases are supported. @default "normal" */
  tone?:
    | "normal"
    | "positive"
    | "cautionary"
    | "negative"
    | "info"
    | "success"
    | "warning"
    | "error";
  /** Alias for the tone axis. */
  variant?: "normal" | "positive" | "cautionary" | "negative";
  children?: React.ReactNode;
  action?: React.ReactNode;
  onAction?: () => void;
  onClose?: () => void;
  /** 닫기 버튼의 접근성 레이블. @default "닫기" */
  closeLabel?: string;
  /** leadingIcon axis. @default true */
  leadingIcon?: boolean;
  icon?: React.ReactNode;
}

/** transient dark-surface feedback toast with tone icon and optional action/close. */
export function Toast(props: ToastProps): JSX.Element;
