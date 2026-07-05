import * as React from 'react';

export interface ListCellProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 리딩 노드(아이콘 / 아바타 / 썸네일). */
  leading?: React.ReactNode;
  /** 기본 텍스트(굵게, 말줄임). */
  title?: React.ReactNode;
  /** 보조 줄(뮤트, 말줄임). */
  description?: React.ReactNode;
  /** 트레일링 노드(값 / 셰브론 / 스위치). */
  trailing?: React.ReactNode;
  /** 행을 인터랙티브하게 만듦(호버 워시, 키보드). */
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  /** 헤어라인 밑줄 추가. @default false */
  divider?: boolean;
}

/** 핵심 리스트 행: 리딩 · 제목/설명 · 트레일링. */
export function ListCell(props: ListCellProps): JSX.Element;
