import * as React from "react";

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
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
  /** 열릴 때 우선 초점을 받을 Alert 내부 요소. 기본값은 secondary 또는 primary 액션입니다. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** 닫힌 뒤 자동으로 캡처한 trigger 대신 초점을 돌려보낼 요소. */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  /** 닫힌 뒤 trigger 또는 `returnFocusRef`로 초점을 복원합니다. @default true */
  restoreFocus?: boolean;
  /** 보이는 title이 없을 때 사용할 접근 가능한 이름. @default "알림" */
  ariaLabel?: string;
}

/** modal feedback alert with iOS, Android, and Web treatments. */
export function Alert(props: AlertProps): React.JSX.Element | null;
