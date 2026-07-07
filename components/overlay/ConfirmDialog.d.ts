import * as React from 'react';

export interface ConfirmDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 열림 상태. @default false */
  open?: boolean;
  /** 다이얼로그 제목. */
  title?: React.ReactNode;
  /** 본문. */
  children?: React.ReactNode;
  /** 확인 액션 톤. @default "default" */
  tone?: 'default' | 'danger' | 'warning';
  /** 확인 버튼 라벨. @default "확인" */
  confirmLabel?: React.ReactNode;
  /** 취소 버튼 라벨. @default "취소" */
  cancelLabel?: React.ReactNode;
  /** 확인 클릭 콜백. */
  onConfirm?: React.MouseEventHandler<HTMLButtonElement>;
  /** 취소 클릭 또는 scrim/Escape dismiss 콜백. */
  onCancel?: () => void;
  /** onCancel이 없을 때 쓰는 닫기 콜백. */
  onClose?: () => void;
  /** scrim 클릭으로 닫기. @default true */
  closeOnScrim?: boolean;
}

/** 파괴적/안전 관련 액션을 명시적으로 확인하는 전용 다이얼로그. */
export function ConfirmDialog(props: ConfirmDialogProps): JSX.Element | null;
