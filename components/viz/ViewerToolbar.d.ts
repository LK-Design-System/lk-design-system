import * as React from 'react';

export interface ViewerToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @default "vertical" */
  orientation?: 'vertical' | 'horizontal';
  children?: React.ReactNode;
}

export interface ViewerToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 눌림(활성) 상태 — 시안 워시. @default false */
  active?: boolean;
  /** 접근성 라벨 + 툴팁. */
  label?: string;
  children?: React.ReactNode;
}

/** 뷰어용 플로팅 툴바(줌 · 핏 · 레이어 · 측정). ViewerToolbarButton으로 채웁니다. */
export function ViewerToolbar(props: ViewerToolbarProps): JSX.Element;
/** ViewerToolbar 내부 아이콘 버튼(active로 눌림 표시). */
export function ViewerToolbarButton(props: ViewerToolbarButtonProps): JSX.Element;
