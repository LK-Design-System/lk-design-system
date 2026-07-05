import * as React from 'react';

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /** 경로 항목, 상위 → 현재(마지막은 굵고 링크 없음). */
  items: BreadcrumbItem[];
}

/** 셰브론 구분자가 있는 경로 트레일. */
export function Breadcrumb(props: BreadcrumbProps): JSX.Element;
