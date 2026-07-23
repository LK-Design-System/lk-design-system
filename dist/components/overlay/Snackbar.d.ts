import * as React from "react";

export interface SnackbarProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  action?: React.ReactNode;
  onAction?: () => void;
  /**
   * severity 축(Toast와 같은 이름·정규화). `negative`는 `role="alert"` +
   * `aria-live="assertive"`로 announce합니다. Legacy info/success/warning/error 별칭 지원.
   * @default "normal"
   */
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
  /** 기본 glyph를 대체합니다. 생략하면 `tone`에 맞는 registry glyph를 씁니다. */
  icon?: React.ReactNode;
  /** icon axis. @default false */
  leadingIcon?: boolean;
  /**
   * 닫기 버튼 노출 축. 닫기 버튼은 `onClose`가 있을 때만 렌더링되며(핸들러 없는 죽은 컨트롤 방지),
   * 이 값을 `false`로 두면 `onClose`가 있어도 감춥니다. @default true
   */
  closeButton?: boolean;
  onClose?: () => void;
  /** 닫기 버튼의 접근성 레이블. @default "닫기" */
  closeLabel?: string;
  /** snackbar width. @default 384 */
  width?: number | string;
}

/** snackbar with heading, description, icon, action, and close button slots. */
export function Snackbar(props: SnackbarProps): React.JSX.Element;
