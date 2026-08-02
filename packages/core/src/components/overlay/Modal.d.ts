import * as React from 'react';
import type { LdsClassNames, LdsStyles, LdsVars } from '../internal/surface.js';

export type ModalPart = 'backdrop' | 'root' | 'header' | 'title' | 'close' | 'body' | 'footer';
export type ModalVariable = '--lds-modal-width' | '--lds-modal-max-height' | '--lds-modal-radius';

export interface ModalProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 열림 상태. @default false */
  open?: boolean;
  /** 비제어 초기 열림 상태. @default false */
  defaultOpen?: boolean;
  /** canonical 열림 상태 변경 알림. */
  onOpenChange?: (open: boolean) => void;
  /** 보이는 제목. 제공하면 다이얼로그의 접근 가능한 이름으로 연결됩니다. */
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** 푸터 노드(예: Button). */
  footer?: React.ReactNode;
  /** Escape, scrim, 닫기 액션이 호출하는 controlled dismiss callback. */
  onClose?: () => void;
  /** 최대 너비(px). @default 520 */
  width?: number | string;
  /** scrim 클릭으로 닫기. @default true */
  closeOnScrim?: boolean;
  /** 열릴 때 우선 초점을 받을 다이얼로그 내부 요소. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** 닫힌 뒤 자동으로 캡처한 trigger 대신 초점을 돌려보낼 요소. */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  /** 닫힌 뒤 trigger 또는 `returnFocusRef`로 초점을 복원합니다. @default true */
  restoreFocus?: boolean;
  /** `title`이 없을 때 사용할 접근 가능한 이름. @default "모달" */
  ariaLabel?: string;
  style?: React.CSSProperties;
  /** Render at the owner-document Portal boundary. @default true */
  withinPortal?: boolean;
  portalTarget?: HTMLElement | null;
  zIndex?: number;
  classNames?: LdsClassNames<ModalPart>;
  styles?: LdsStyles<ModalPart>;
  vars?: LdsVars<ModalVariable>;
}

/** 일반 콘텐츠 다이얼로그 — 헤더 + 스크롤 본문 + 선택적 푸터. */
export const Modal: React.ForwardRefExoticComponent<ModalProps & React.RefAttributes<HTMLDivElement>>;
