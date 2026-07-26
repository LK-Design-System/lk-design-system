import * as React from 'react';

export interface AnchorItem {
  href: string;
  label: React.ReactNode;
  /** 들여쓰기 레벨 — DOM에서는 중첩 리스트(`ul > li > ul`)로 표현됩니다. @default 0 */
  level?: number;
}

export interface AnchorProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  items: AnchorItem[];
  /** 제어되는 활성 href. */
  active?: string;
  onChange?: (href: string) => void;
}

/**
 * 시그널 잉크 활성 룰이 있는 페이지 내 목차 내비게이션.
 * `level`에 따라 중첩 리스트(`ul > li > ul`)로 렌더되고, 활성 항목에는
 * `aria-current="location"`이 붙습니다. `nav`의 기본 `aria-label`은
 * `'목차'`이며 소비자가 전달한 `aria-label`이 우선합니다.
 * 비제어 모드에는 스크롤스파이가 없습니다 — 뷰포트 동기화는 소비자가
 * `active`(제어 값)로 담당합니다.
 */
export function Anchor(props: AnchorProps): React.JSX.Element;
