import * as React from 'react';

export interface ShellPanelPrimaryAction {
  /** 행 라벨(예: `새 질문`). */
  label: React.ReactNode;
  /** 장식 아이콘. */
  icon?: React.ReactNode;
  /** 제공하면 실제 anchor로 렌더링합니다. */
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** 현재 화면이면 `aria-current="page"`와 무채색 채움·굵기를 받습니다. */
  current?: boolean;
}

export interface ShellPanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 패널 제목. 안의 목록 nav가 `aria-labelledby`로 이 제목을 이름으로 씁니다. */
  title: React.ReactNode;
  /** 제목 heading 단계. @default 2 */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** 머리 오른쪽 아이콘 동작(예: 검색). 최대 2개이며 넘치면 개발 경고를 냅니다. 접기 토글은 두지 않습니다. */
  actions?: React.ReactNode;
  /** 목록 행과 같은 해부의 주 동작 행(예: `새 질문`). 객체를 주면 LDS 행으로 렌더링합니다. */
  primaryAction?: ShellPanelPrimaryAction | React.ReactNode;
  /** `primaryAction.href`를 router link로 치환하는 렌더 훅. */
  renderLink?: (action: ShellPanelPrimaryAction, props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => React.ReactElement;
  /** 스크롤하지 않는 짧은 고정 구역(예: 고정한 대화). */
  children?: React.ReactNode;
  /** 패널의 유일한 스크롤 구역(긴 목록). 스크롤될 때만 위쪽 경계선을 보입니다. */
  scrollRegion?: React.ReactNode;
  /** 스크롤 구역의 접근 가능한 이름. 생략하면 `{title} 목록`입니다. */
  scrollRegionLabel?: string;
  /** 선택 꼬리. 계정은 레일에 두므로 보통 비웁니다. */
  footer?: React.ReactNode;
  /** 제목 id. 생략하면 생성합니다. */
  titleId?: string;
}

/** `DashboardShell topology="rail-panel"`의 맥락 패널: 고정 머리, 주 동작 행, 고정 구역, 스크롤 구역 하나. */
export function ShellPanel(props: ShellPanelProps): React.JSX.Element;
