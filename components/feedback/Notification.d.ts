import * as React from 'react';

export interface NotificationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  time?: React.ReactNode;
  /** 안읽음 워시 + 레드 점. @default false */
  unread?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

/** 알림 행 — 아이콘 타일 · 제목 · 설명 · 시간 · 안읽음 상태. */
export function Notification(props: NotificationProps): JSX.Element;
