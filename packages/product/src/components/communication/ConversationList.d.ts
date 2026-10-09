import * as React from 'react';

export interface ConversationListItem {
  /** 안정적인 대화 id. */
  id: string;
  /** 한 줄 제목. 넘치면 말줄임하고 전체 제목은 링크의 접근 이름과 native title에 남습니다. */
  title: string;
  /** 대화 URL. 행은 실제 링크입니다. */
  href?: string;
  /** `currentId` 대신 항목별로 현재 여부를 지정합니다. */
  current?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export interface ConversationListGroup {
  id: string;
  /** 제품이 계산하고 지역화한 묶음 이름(예: `오늘`). */
  label: React.ReactNode;
  items: ConversationListItem[];
}

export interface ConversationListAction {
  id: string;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  divider?: boolean;
}

export interface ConversationListProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onError'> {
  groups: ConversationListGroup[];
  /** 현재 대화 id. 해당 링크가 `aria-current="page"`, 무채색 채움, 굵기를 받습니다. */
  currentId?: string;
  /** 링크를 router link로 치환하는 렌더 훅. */
  renderLink?: (item: ConversationListItem, props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => React.ReactElement;
  /** 행의 형제 「더 보기」 메뉴 항목(예: 이름 바꾸기, 구분선, 삭제). 비우면 행 동작이 없습니다. */
  itemActions?: ConversationListAction[] | ((item: ConversationListItem) => ConversationListAction[]);
  /** 메뉴 항목 실행 요청. 확인 대화상자와 실제 실행은 제품이 소유합니다. */
  onItemAction?: (actionId: string, item: ConversationListItem) => void;
  /** 「더 보기」 버튼 이름. @default (item) => `${item.title} 더 보기` */
  moreLabel?: (item: ConversationListItem) => string;
  /** 묶음 제목 heading 단계. @default 3 */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** 첫 로딩. 항목이 없으면 Skeleton 행을 보입니다. @default false */
  loading?: boolean;
  /** 오류 설명. 항목이 없으면 축약 ResourceState로 보입니다. */
  error?: React.ReactNode | boolean;
  onRetry?: () => void;
  /** @default "다시 시도" */
  retryLabel?: React.ReactNode;
  /** @default "아직 대화가 없습니다." */
  emptyLabel?: React.ReactNode;
  /** 목록 끝 「더 불러오기」 노출 여부. 무한 스크롤은 쓰지 않습니다. @default false */
  hasMore?: boolean;
  onLoadMore?: () => void;
  /** @default false */
  loadingMore?: boolean;
  /** @default "더 불러오기" */
  loadMoreLabel?: React.ReactNode;
  /** nav 이름. ShellPanel 안에서는 생략하면 패널 제목을 `aria-labelledby`로 씁니다. */
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

/** 날짜 묶음, 링크 행, 형제 「더 보기」 메뉴, 현재 항목 표시를 가진 대화 목록 탐색. */
export function ConversationList(props: ConversationListProps): React.JSX.Element;
