import * as React from 'react';

export interface MultiSelectChipProps {
  /** 제어되는 선택 상태. */
  selected?: boolean;
  /** 비제어 초기 상태. @default false */
  defaultSelected?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/** 다중 선택 토글 칩 — 선택 시 리딩 체크 + 시안 워시. */
export function MultiSelectChip(props: MultiSelectChipProps): JSX.Element;
