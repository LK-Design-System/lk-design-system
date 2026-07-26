import * as React from 'react';

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /** 경로 항목, 상위 → 현재(마지막은 굵고 링크 없음). */
  items: BreadcrumbItem[];
}

/**
 * 셰브론 구분자가 있는 경로 트레일.
 * APG 패턴대로 `nav > ol > li`로 렌더되고 마지막 항목에 `aria-current="page"`가
 * 붙습니다. `nav`의 기본 `aria-label`은 `'현재 위치'`이며 소비자가 전달한
 * `aria-label`이 우선합니다.
 */
export function Breadcrumb(props: BreadcrumbProps): React.JSX.Element;
