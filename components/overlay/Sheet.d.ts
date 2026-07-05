import * as React from 'react';

export interface SheetProps {
  open?: boolean;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onClose?: () => void;
  closeOnScrim?: boolean;
  /** 고정 높이(아니면 콘텐츠 크기, 88vh 상한). */
  height?: number | string;
  style?: React.CSSProperties;
}

/** 그랩 핸들이 있는 바텀 시트 — 모바일 액션 / 피커. */
export function Sheet(props: SheetProps): JSX.Element | null;
