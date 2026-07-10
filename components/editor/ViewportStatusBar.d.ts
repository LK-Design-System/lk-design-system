import * as React from 'react';

export interface ViewportStatusItem {
  label: React.ReactNode;
  value: React.ReactNode;
  unit?: React.ReactNode;
  tone?: 'default' | 'signal' | 'positive' | 'warning' | 'danger';
  mono?: boolean;
  title?: string;
}

export interface ViewportStatusBarProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: ViewportStatusItem[];
  children?: React.ReactNode;
}

/** 2D/3D 에디터용 고밀도 뷰포트 상태 바 — 좌표, 줌/카메라, 선택 수, snap, 포인트 수, FPS. */
export function ViewportStatusBar(props: ViewportStatusBarProps): JSX.Element;
