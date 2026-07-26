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
  /**
   * 자동 닫힘까지의 시간. `true`는 정책값 7000ms, 숫자는 ms, `null`/`false`는 자동 닫힘 없음.
   * `onClose`가 있어야 동작하며 포인터 hover와 내부 초점 동안 **남은 시간을 보존한 채**
   * 일시정지합니다. `action`이 있는 Toast는 WCAG 2.2.1(Timing Adjustable)에 따라 이 값을
   * 무시하고 자동으로 닫히지 않습니다. @default null (자동 닫힘 없음)
   */
  duration?: number | boolean | null;
}

/** transient dark-surface feedback toast with tone icon and optional action/close. */
export function Toast(props: ToastProps): React.JSX.Element;
