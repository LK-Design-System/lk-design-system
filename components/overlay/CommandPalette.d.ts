import * as React from 'react';

export interface Command {
  label: React.ReactNode;
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  onSelect?: () => void;
}

export interface CommandPaletteProps {
  open?: boolean;
  onClose?: () => void;
  commands: Command[];
  placeholder?: string;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  restoreFocus?: boolean;
  /** 다이얼로그의 접근 가능한 이름. @default "명령 팔레트" */
  ariaLabel?: string;
  style?: React.CSSProperties;
}

/** 검색 필드 + 필터링된 명령 목록이 있는 ⌘K 모달. */
export function CommandPalette(props: CommandPaletteProps): React.JSX.Element | null;
