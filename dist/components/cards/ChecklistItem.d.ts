import * as React from 'react';

export interface ChecklistItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 시그널 잉크 체크 대신 레드 크로스 표시. @default false */
  cross?: boolean;
  /** 흐림 + 취소선(예: 제외된 기능). @default false */
  muted?: boolean;
  /** 다크 서피스에 렌더. @default false */
  dark?: boolean;
  children?: React.ReactNode;
}

/** 기능 행 — 시그널 잉크 체크(또는 레드 크로스) + 라벨. 브랜드의 핵심 리스트 스타일. */
export function ChecklistItem(props: ChecklistItemProps): React.JSX.Element;
