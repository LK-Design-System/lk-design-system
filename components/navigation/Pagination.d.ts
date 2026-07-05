import * as React from 'react';

export interface PaginationProps {
  /** 현재 페이지(1부터). @default 1 */
  page?: number;
  /** 전체 페이지 수. @default 1 */
  count?: number;
  onChange?: (page: number) => void;
  /** 현재 페이지 양옆에 보이는 페이지 수. @default 1 */
  siblingCount?: number;
  style?: React.CSSProperties;
}

/** 이전/다음 셰브론과 말줄임 접기가 있는 번호 페이지네이션. */
export function Pagination(props: PaginationProps): JSX.Element;
