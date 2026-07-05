import * as React from 'react';

export interface ModalProps {
  open?: boolean;
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** 푸터 노드(예: Button). */
  footer?: React.ReactNode;
  onClose?: () => void;
  /** 최대 너비(px). @default 520 */
  width?: number;
  closeOnScrim?: boolean;
  style?: React.CSSProperties;
}

/** 일반 콘텐츠 다이얼로그 — 헤더 + 스크롤 본문 + 선택적 푸터. */
export function Modal(props: ModalProps): JSX.Element | null;
