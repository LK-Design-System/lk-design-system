import * as React from 'react';

export interface BookmarkProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** 제어되는 저장 상태. */
  active?: boolean;
  /** 비제어 초기 상태. @default false */
  defaultActive?: boolean;
  onChange?: (next: boolean) => void;
  /** 글리프 크기(px). @default 24 */
  size?: number;
  /** 비활성(흐림, 상호작용 불가). @default false */
  disabled?: boolean;
  /** 저장 대상의 이름. 접근 이름이 `"{label} 북마크"`가 됩니다(미지정 시 `북마크`). */
  label?: string;
}

/** 저장/북마크 토글 — 저장 시 시그널 잉크로 채움. 이름은 대상을 설명하고 상태는 `aria-pressed`가 전달합니다. */
export function Bookmark(props: BookmarkProps): React.JSX.Element;
