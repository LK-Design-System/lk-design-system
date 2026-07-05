import * as React from 'react';

export interface HistoryToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 실행 취소 가능 여부. @default false */
  canUndo?: boolean;
  /** 다시 실행 가능 여부. @default false */
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  /** 있으면 초기화 버튼 표시. */
  onReset?: () => void;
  /** 히스토리 깊이(있으면 "N 단계" 표시). */
  count?: number;
}

/** 에디터용 실행 취소 / 다시 실행 / 초기화 툴바 — 히스토리 상태에 연결. */
export function HistoryToolbar(props: HistoryToolbarProps): JSX.Element;
