import * as React from 'react';

export interface LogLine {
  time?: React.ReactNode;
  level?: 'debug' | 'info' | 'warn' | 'error';
  source?: React.ReactNode;
  text: React.ReactNode;
}

export interface LogViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: LogLine[];
  /** 레벨 필터 칩 표시. @default true */
  filter?: boolean;
  /** 새 라인 추가 시 자동 스크롤. @default true */
  autoScroll?: boolean;
  height?: number;
}

/** 레벨 색상 로그·콘솔 스트림 뷰어(필터 + tail 자동 스크롤). Code의 스트리밍 보완재. */
export function LogViewer(props: LogViewerProps): JSX.Element;
