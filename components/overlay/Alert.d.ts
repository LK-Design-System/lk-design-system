import * as React from 'react';

export interface AlertProps {
  /** 다이얼로그 표시. @default false */
  open?: boolean;
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** `danger`는 확인 버튼을 레드로. @default "default" */
  tone?: 'default' | 'danger';
  /** 확인 버튼 라벨. @default "확인" */
  confirmLabel?: React.ReactNode;
  /** 취소 버튼 라벨(단일 버튼 다이얼로그면 생략). */
  cancelLabel?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  /** Esc / 스크림 클릭 시 호출(onCancel로 폴백). */
  onClose?: () => void;
  /** 커스텀 푸터 노드 — 기본 버튼을 재정의. */
  actions?: React.ReactNode;
  /** 스크림 클릭 시 닫기. @default true */
  closeOnScrim?: boolean;
  style?: React.CSSProperties;
}

/** 네이비 스크림 위 중앙 모달 확인 다이얼로그. */
export function Alert(props: AlertProps): JSX.Element | null;
