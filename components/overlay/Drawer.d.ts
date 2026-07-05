import * as React from 'react';

export interface DrawerProps {
  open?: boolean;
  /** 슬라이드인 방향. @default "right" */
  side?: 'left' | 'right';
  /** 패널 너비(px). @default 380 */
  width?: number;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onClose?: () => void;
  closeOnScrim?: boolean;
  style?: React.CSSProperties;
}

/** 네이비 스크림 위 사이드 패널 — 필터 / 상세 / 설정. */
export function Drawer(props: DrawerProps): JSX.Element | null;
