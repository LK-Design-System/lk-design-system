import * as React from 'react';

export interface AccordionItem {
  title: React.ReactNode;
  content: React.ReactNode;
}

export interface AccordionProps {
  /** 행 — 각각 `{ title, content }`. */
  items: AccordionItem[];
  /** 한 번에 여러 행 열기 허용. @default false */
  multiple?: boolean;
  /** 마운트 시 열려 있는 인덱스. @default [] */
  defaultOpen?: number[];
  style?: React.CSSProperties;
}

/** 디스클로저 리스트(FAQ / 스펙 그룹) — 시그널 잉크 열린 헤더, 셰브론 뒤집힘. */
export function Accordion(props: AccordionProps): React.JSX.Element;
