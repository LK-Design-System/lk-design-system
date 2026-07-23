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
  /**
   * 각 헤더 트리거를 감싸는 heading 레벨(APG: "each accordion header is
   * contained in an element with role heading"). `false` 면 heading 래퍼 없이
   * 버튼만 렌더링합니다.
   * @default 3
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6 | false;
  style?: React.CSSProperties;
}

/** 디스클로저 리스트(FAQ / 스펙 그룹) — 시그널 잉크 열린 헤더, 셰브론 뒤집힘. */
export function Accordion(props: AccordionProps): React.JSX.Element;
