import * as React from 'react';

export interface FilterChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /** 활성(선택) — 시안 워시 + 시그널 잉크로 채움. @default false */
  active?: boolean;
  /** 선택적 끝 카운트. */
  count?: number;
  /** 드롭다운 캐럿 표시(메뉴를 여는 필터용). @default false */
  caret?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
}

/** 라운드 필터 필 — 패싯을 토글; 선택적 카운트 / 드롭다운 캐럿. */
export function FilterChip(props: FilterChipProps): JSX.Element;
