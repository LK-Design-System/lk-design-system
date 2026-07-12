import * as React from 'react';

export interface DrawerProps {
  /** 열림 상태. @default false */
  open?: boolean;
  /** 슬라이드인 방향. @default "right" */
  side?: 'left' | 'right';
  /** 패널 너비(px). @default 380 */
  width?: number;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  /** Escape, scrim, 닫기 액션이 호출하는 controlled dismiss callback. */
  onClose?: () => void;
  /** scrim 클릭으로 닫기. @default true */
  closeOnScrim?: boolean;
  /** 열릴 때 우선 초점을 받을 Drawer 내부 요소. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** 닫힌 뒤 자동으로 캡처한 trigger 대신 초점을 돌려보낼 요소. */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  /** 닫힌 뒤 trigger 또는 `returnFocusRef`로 초점을 복원합니다. @default true */
  restoreFocus?: boolean;
  /** `title`이 없을 때 사용할 접근 가능한 이름. @default "서랍 패널" */
  ariaLabel?: string;
  /** 닫기 버튼의 접근 가능한 이름. @default "닫기" */
  closeLabel?: string;
  style?: React.CSSProperties;
}

/** 네이비 스크림 위 사이드 패널 — 필터 / 상세 / 설정. */
export function Drawer(props: DrawerProps): React.JSX.Element | null;
