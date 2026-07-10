import * as React from 'react';

export interface SpeedDialAction {
  icon: React.ReactNode;
  label: React.ReactNode;
  /** Accessible name when label is not a plain string. */
  ariaLabel?: string;
  onClick?: () => void;
  danger?: boolean;
}

export interface SpeedDialProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 트리거 아이콘(기본 +). */
  icon?: React.ReactNode;
  actions?: SpeedDialAction[];
  open?: boolean;
  /** @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** 트리거 aria-label. @default "작업" */
  label?: string;
}

/** 열리면 라벨 툴 액션이 펼쳐지는 FAB 스피드다이얼. Fab 확장. */
export function SpeedDial(props: SpeedDialProps): JSX.Element;
