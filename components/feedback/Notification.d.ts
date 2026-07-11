import * as React from 'react';

export interface NotificationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'onClick'> {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  time?: React.ReactNode;
  /** 안읽음 primary 워시 + primary 점. @default false */
  unread?: boolean;
  /** 제공하면 행을 키보드 접근 가능한 native button으로 렌더링합니다. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

/** 알림 행 — 아이콘 타일 · 제목 · 설명 · 시간 · 안읽음 상태. */
export function Notification(props: NotificationProps): JSX.Element;
