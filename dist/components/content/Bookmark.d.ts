import * as React from 'react';

export interface BookmarkProps {
  /** 제어되는 저장 상태. */
  active?: boolean;
  /** 비제어 초기 상태. @default false */
  defaultActive?: boolean;
  onChange?: (next: boolean) => void;
  /** 글리프 크기(px). @default 24 */
  size?: number;
  disabled?: boolean;
  style?: React.CSSProperties;
}

/** 저장/북마크 토글 — 저장 시 시그널 잉크로 채움. */
export function Bookmark(props: BookmarkProps): React.JSX.Element;
