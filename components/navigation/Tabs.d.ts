import * as React from 'react';

export type TabItem = string | { value: string; label: React.ReactNode; count?: number };

export interface TabsProps {
  /** 탭 — 문자열 또는 `{ value, label, count }`. */
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** 탭을 폭까지 늘림. @default false */
  full?: boolean;
  style?: React.CSSProperties;
}

/** 언더라인 탭 바 — 시그널 잉크 인디케이터, 탭별 카운트(선택). */
export function Tabs(props: TabsProps): JSX.Element;
