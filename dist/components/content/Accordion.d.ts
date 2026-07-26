import * as React from 'react';

export interface AccordionItem {
  title: React.ReactNode;
  content: React.ReactNode;
  /**
   * 제목 앞 장식 노드(아이콘·아바타 등). 트리거의 접근 이름은 `title`에 고정되어
   * 있으므로 이 노드는 이름에 섞이지 않습니다. 의미를 담아야 하면 노드 자체에
   * 접근 이름을 붙이세요.
   */
  leading?: React.ReactNode;
  /**
   * 제목 아래 보조 설명. 트리거 안에 놓여 행 전체가 계속 눌리지만, 접근 이름이
   * 아니라 `aria-describedby`로 연결되어 이름은 짧게 유지되고 설명은 설명으로
   * 낭독됩니다.
   */
  description?: React.ReactNode;
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
