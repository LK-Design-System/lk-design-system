import * as React from 'react';

export interface DockPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @default "right" */
  side?: 'left' | 'right';
  open?: boolean;
  /** @default true */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  /** 패널 너비. 숫자는 px로 처리합니다. @default 300 */
  width?: React.CSSProperties['width'];
  /** 리사이즈 가능한 패널의 최소 너비(px). @default 240 */
  minWidth?: number;
  /** 리사이즈 가능한 패널의 최대 너비(px). @default 520 */
  maxWidth?: number;
  /** 키보드 리사이즈 증감 단위(px). Shift와 함께 누르면 4배로 이동합니다. @default 16 */
  resizeStep?: number;
  /** 패널 경계에 접근 가능한 resize separator를 표시합니다. 숫자 width일 때 동작합니다. @default false */
  resizable?: boolean;
  onWidthChange?: (width: number) => void;
  /** 열린 패널 내부에서 Escape를 누르면 패널을 접고 handle로 focus를 복귀합니다. @default true */
  closeOnEscape?: boolean;
  /** 본문 padding. @default "var(--space-4)" */
  bodyPadding?: React.CSSProperties['padding'];
  bodyStyle?: React.CSSProperties;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

/** 캔버스 위에서 돌출 핸들로 접고 펼치는 사이드 도킹 패널. */
export function DockPanel(props: DockPanelProps): JSX.Element;
