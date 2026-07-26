import * as React from 'react';

export interface MultiSelectChipProps {
  /** 제어되는 선택 상태. */
  selected?: boolean;
  /** 비제어 초기 상태. @default false */
  defaultSelected?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  /** 밀도. sm은 소형 컨트롤 높이(32)에 맞춥니다. @default "md" */
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/** 다중 선택 토글 칩 — 선택 시 리딩 체크 + 시안 워시. */
export function MultiSelectChip(props: MultiSelectChipProps): React.JSX.Element;
