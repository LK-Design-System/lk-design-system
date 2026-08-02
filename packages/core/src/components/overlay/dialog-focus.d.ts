import * as React from 'react';

export interface UseDialogFocusOptions {
  /** 다이얼로그가 열려 있는지 여부. */
  open: boolean;
  /** Escape 닫기 결정 콜백. 없으면 Escape는 무시된다(강제 확인 다이얼로그). */
  onDismiss?: () => void;
  /** 열릴 때 초점을 받을 다이얼로그 내부 요소 ref. 없으면 첫 focusable, 그것도 없으면 다이얼로그 자신. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** 닫힐 때 초점을 복원할 요소 ref. 없으면 열기 직전 activeElement. */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  /** 닫힐 때 초점 복원 여부. @default true */
  restoreFocus?: boolean;
  /** 열려 있는 동안 body 스크롤 잠금 여부(중첩 카운트 공유). @default true */
  lockScroll?: boolean;
  /** portalled host 밖의 sibling을 inert 처리할지 여부. @default true */
  inert?: boolean;
  /** 공통 Portal wrapper ref. inert boundary를 결정한다. */
  portalRef?: React.RefObject<HTMLDivElement | null>;
  /** 공통 overlay stack 대신 사용할 explicit z-index. */
  zIndex?: number;
}

export interface UseDialogFocusResult {
  /** `role="dialog"` 컨테이너에 연결하는 ref. 초점 트랩의 경계가 된다. */
  dialogRef: React.RefObject<HTMLElement | null>;
  /** 오버레이 스택 위치에 따라 엔진이 배정한 z-index. 다이얼로그 표면에 적용한다. */
  zIndex: number;
}

/**
 * 모달 다이얼로그 공용 초점 트랩·복원·스택·스크롤 잠금 엔진.
 * 최신 오버레이만 초점 봉쇄와 Escape를 소유하며, 닫히면 하위 오버레이가 다시 활성화된다.
 * 소비자: Modal, Alert, ConfirmDialog, CommandPalette, Lightbox, Drawer, Sheet.
 */
export function useDialogFocus(options: UseDialogFocusOptions): UseDialogFocusResult;
