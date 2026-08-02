import * as React from 'react';

export interface ConfirmDialogProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 열림 상태. @default false */
  open?: boolean;
  /** 다이얼로그 제목. */
  title?: React.ReactNode;
  /** 본문. */
  children?: React.ReactNode;
  /** 확인 액션 톤. @default "default" */
  tone?: 'default' | 'danger' | 'warning';
  /** 제목 heading level. @default 2 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** 확인 버튼 라벨. @default "확인" */
  confirmLabel?: React.ReactNode;
  /** 취소 버튼 라벨. @default "취소" */
  cancelLabel?: React.ReactNode;
  /** 선행 조건이 충족되지 않았을 때 확인 액션을 비활성화합니다. @default false */
  confirmDisabled?: boolean;
  /** 확인 요청 중 pending 상태를 표시하고 중복 실행을 막습니다. @default false */
  confirmLoading?: boolean;
  /** pending 상태의 접근 가능한 라벨. @default "처리 중" */
  confirmLoadingLabel?: string;
  /** 확인 클릭 콜백. */
  onConfirm?: React.MouseEventHandler<HTMLButtonElement>;
  /** 취소 클릭 또는 scrim/Escape dismiss 콜백. */
  onCancel?: () => void;
  /** onCancel이 없을 때 쓰는 닫기 콜백. */
  onClose?: () => void;
  /** scrim 클릭으로 닫기. @default true */
  closeOnScrim?: boolean;
  /** 열릴 때 우선 초점을 받을 ConfirmDialog 내부 요소. 기본값은 취소 액션입니다. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** 닫힌 뒤 자동으로 캡처한 trigger 대신 초점을 돌려보낼 요소. */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  /** 닫힌 뒤 trigger 또는 `returnFocusRef`로 초점을 복원합니다. @default true */
  restoreFocus?: boolean;
  /** `title`이 없을 때 사용할 접근 가능한 이름. @default "확인 다이얼로그" */
  ariaLabel?: string;
  /** Render at the owner-document Portal boundary. @default true */
  withinPortal?: boolean;
  portalTarget?: HTMLElement | null;
  zIndex?: number;
}

/** 파괴적/안전 관련 액션을 명시적으로 확인하는 전용 다이얼로그. */
export function ConfirmDialog(props: ConfirmDialogProps): React.JSX.Element | null;
