import * as React from 'react';

export interface CanvasEditorShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 상단 타이틀 바. */
  title?: React.ReactNode;
  /** 좌측 툴 레일(예: EditorToolbar). */
  tools?: React.ReactNode;
  /** 중앙 캔버스 영역. */
  children?: React.ReactNode;
  /** 우측 속성 패널. */
  panel?: React.ReactNode;
  /** 하단 상태 바. */
  status?: React.ReactNode;
  /** 속성 패널 폭(px). @default 280 */
  panelWidth?: number;
}

/** 에디터 레이아웃 셸 — 타이틀 · 좌측 툴 레일 · 중앙 캔버스 · 우측 속성 패널 · 하단 상태 바. */
export function CanvasEditorShell(props: CanvasEditorShellProps): JSX.Element;
