import * as React from 'react';

export interface ReactionLike {
  /** 좋아요 수. 접근 이름에 `좋아요 N개`로 합성되고 숫자는 시각용으로 표시됩니다. */
  count?: number;
  /** 제어형 눌림 상태. 주면 상태를 부모가 소유합니다. */
  active?: boolean;
  /** 비제어형 초기 눌림 상태. @default false */
  defaultActive?: boolean;
  /** 눌림 상태가 바뀔 때 호출됩니다. */
  onToggle?: (active: boolean) => void;
  /** 접근 이름의 명사(기본 "좋아요"). 상태는 `aria-pressed`가 전달합니다. */
  label?: string;
}

export interface ReactionAction {
  /** 수(선택). 접근 이름에 `라벨 N개`로 합성됩니다. */
  count?: number;
  /** 클릭 핸들러(댓글 열기 / 공유 시트 열기 등). */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** 접근 이름의 명사(기본 댓글="댓글", 공유="공유"). */
  label?: string;
}

export interface ReactionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 좋아요 토글(선택). 생략하면 렌더되지 않습니다. */
  like?: ReactionLike;
  /** 댓글 액션(선택). */
  comment?: ReactionAction;
  /** 공유 액션(선택). */
  share?: ReactionAction;
  /** 컨트롤 크기. @default "md" */
  size?: 'sm' | 'md';
  /** 정렬. `start`는 왼쪽 정렬, `between`은 양끝 배분. @default "start" */
  align?: 'start' | 'between';
  /**
   * 눈에 보이는 수의 표기 방식. 기본은 한국식 축약(1240 → "1.2천", 12800 → "1.2만").
   * 접근 이름에는 축약 없이 정확한 수가 들어갑니다. `(n) => String(n)`로 끄거나
   * K/M 포맷터로 바꿀 수 있습니다.
   */
  formatCount?: (count: number) => React.ReactNode;
  /** 추가 액션(북마크 등)을 뒤에 덧붙입니다. */
  children?: React.ReactNode;
}

/** 게시물·댓글·기사의 인게이지먼트 바 — 좋아요(토글)·댓글·공유와 수. */
export function ReactionBar(props: ReactionBarProps): React.JSX.Element;
