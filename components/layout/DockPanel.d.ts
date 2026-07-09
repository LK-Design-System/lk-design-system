import * as React from 'react';

export interface DockPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @default "right" */
  side?: 'left' | 'right';
  open?: boolean;
  /** @default true */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  /** 펼쳤을 때 폭(px). @default 300 */
  width?: number;
  children?: React.ReactNode;
}

/** 캔버스 위에서 돌출 셰브론 핸들로 접히는 사이드 도킹 패널(맵·에디터 오버레이용). */
export function DockPanel(props: DockPanelProps): JSX.Element;
