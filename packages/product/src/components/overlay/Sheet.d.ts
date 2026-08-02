import * as React from 'react';

export interface SheetProps {
  /** 열림 상태. @default false */
  open?: boolean;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  /** Escape, scrim, 명시적 액션이 호출하는 controlled dismiss callback. */
  onClose?: () => void;
  /** scrim 클릭으로 닫기. @default true */
  closeOnScrim?: boolean;
  /** 고정 높이(아니면 콘텐츠 크기, 88vh 상한). */
  height?: number | string;
  /** 열릴 때 우선 초점을 받을 Sheet 내부 요소. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** 닫힌 뒤 자동으로 캡처한 trigger 대신 초점을 돌려보낼 요소. */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  /** 닫힌 뒤 trigger 또는 `returnFocusRef`로 초점을 복원합니다. @default true */
  restoreFocus?: boolean;
  /** `title`이 없을 때 사용할 접근 가능한 이름. @default "하단 시트" */
  ariaLabel?: string;
  /** Render at the owner-document Portal boundary. @default true */
  withinPortal?: boolean;
  portalTarget?: HTMLElement | null;
  zIndex?: number;
  style?: React.CSSProperties;
}

/** 그랩 핸들이 있는 바텀 시트 — 모바일 액션 / 피커. */
export function Sheet(props: SheetProps): React.JSX.Element | null;
