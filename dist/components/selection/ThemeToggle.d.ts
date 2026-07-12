import * as React from 'react';

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeToggleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** `[data-theme]`를 설정할 요소(또는 CSS 셀렉터). `null` = 변경만 보고하고 DOM은 건드리지 않음. @default document.documentElement */
  target?: HTMLElement | string | null;
  /** 선택을 저장하는 데 쓰는 localStorage 키. @default "lk-theme" */
  storageKey?: string;
  /** 제공할 모드(순서대로). @default ["light","dark","auto"] */
  options?: ThemeMode[];
  /** 제어되는 값. */
  value?: ThemeMode;
  /** 비제어 시 초기 값(저장된 선택이 있으면 우선). @default "light" */
  defaultValue?: ThemeMode;
  /** 선택된 모드와 함께 호출. */
  onChange?: (theme: ThemeMode) => void;
  /** @default "md" */
  size?: 'sm' | 'md';
  /** 각 아이콘 옆에 텍스트 라벨 표시. @default true */
  showLabels?: boolean;
  /** 선택을 localStorage에 저장(그리고 마운트 시 복원). @default true */
  persist?: boolean;
}

/** `[data-theme]` + localStorage로 DS 테마를 구동하는 세그먼트형 Light / Dark / Auto 스위치. */
export function ThemeToggle(props: ThemeToggleProps): React.JSX.Element;
