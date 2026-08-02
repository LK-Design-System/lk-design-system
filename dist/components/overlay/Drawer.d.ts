import * as React from 'react';

export interface DrawerProps {
  /** 열림 상태. @default false */
  open?: boolean;
  /** 슬라이드인 방향. @default "right" */
  side?: 'left' | 'right';
  /** 패널 너비(px). @default 380 */
  width?: number;
  title?: React.ReactNode;
  /** 제목 아래의 짧은 보조 설명. dialog의 `aria-describedby`와 연결됩니다. */
  subtitle?: React.ReactNode;
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
  /** Render at the owner-document Portal boundary. @default true */
  withinPortal?: boolean;
  portalTarget?: HTMLElement | null;
  zIndex?: number;
  /** 스크롤 body의 padding·layout을 조합별로 조정합니다. */
  bodyStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}

/** 네이비 스크림 위 사이드 패널 — 필터 / 상세 / 설정. */
export function Drawer(props: DrawerProps): React.JSX.Element | null;
