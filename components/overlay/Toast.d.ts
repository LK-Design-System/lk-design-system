import * as React from 'react';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 톤(리딩 아이콘 색). @default "info" */
  tone?: 'info' | 'success' | 'warning' | 'error';
  children?: React.ReactNode;
  /** 끝의 액션 노드(예: "실행 취소"). */
  action?: React.ReactNode;
  /** 닫기 버튼 표시; 클릭 시 호출. */
  onClose?: () => void;
}

/** 떠 있는 일시 메시지 — 다크 네이비 카드, 톤 아이콘, 선택적 액션/닫기. */
export function Toast(props: ToastProps): JSX.Element;
