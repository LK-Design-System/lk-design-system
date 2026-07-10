import * as React from 'react';

export interface CanvasEditorCommandBarAction {
  key?: React.Key;
  value?: string;
  label: string;
  icon: React.ReactNode | string;
  active?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export interface CanvasEditorCommandBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 전체 command group 접근성 라벨. */
  label?: string;
  /** viewActions가 있을 때 렌더링되는 뷰어 명령 툴바 라벨. */
  viewLabel?: string;
  /** 실제 핸들러 또는 disabled 상태가 있는 viewer 명령만 렌더링합니다. */
  viewActions?: CanvasEditorCommandBarAction[];
  /** 히스토리 툴바 표시 여부. @default true */
  showHistory?: boolean;
  /** 히스토리 툴바 접근성 라벨. */
  historyLabel?: string;
  /** 실행 취소 가능 여부. @default false */
  canUndo?: boolean;
  /** 다시 실행 가능 여부. @default false */
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  /** 있으면 초기화 버튼 표시. */
  onReset?: () => void;
  /** 오른쪽 추가 명령 슬롯. */
  children?: React.ReactNode;
  /** 추가 명령 슬롯 접근성 라벨. */
  extraLabel?: string;
}

/** CanvasEditorShell 상단에 쓰는 공통 명령 바 - viewer 명령과 history 명령의 위치/상태를 강제합니다. */
export function CanvasEditorCommandBar(props: CanvasEditorCommandBarProps): JSX.Element;
