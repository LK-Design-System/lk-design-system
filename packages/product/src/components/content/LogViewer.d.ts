import * as React from 'react';

export interface LogLine {
  time?: React.ReactNode;
  level?: 'debug' | 'info' | 'warn' | 'error';
  source?: React.ReactNode;
  text: React.ReactNode;
}

export interface LogViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: LogLine[];
  /** Show level filter chips. @default true */
  filter?: boolean;
  /** Show the search field. @default true */
  search?: boolean;
  /** Show tail pause, latest, and clear tools. @default true */
  tools?: boolean;
  /** Show per-line copy buttons. @default true */
  copyable?: boolean;
  /** Keep the newest line in view as lines append. @default true */
  autoScroll?: boolean;
  height?: number;
  density?: 'compact' | 'comfortable';
  /** Wrap log messages. Virtualization is disabled while wrapping is enabled. @default false */
  wrap?: boolean;
  /** Render only visible rows for large fixed-height log streams. @default true */
  virtualized?: boolean;
  /** Extra rows to render above and below the viewport while virtualized. @default 8 */
  overscan?: number;
  initialQuery?: string;
  /** Optional transport/freshness state shown above the stream. */
  streamStatus?: 'connecting' | 'online' | 'reconnecting' | 'weak' | 'stale' | 'error' | 'offline';
  lastUpdatedAt?: React.ReactNode;
  droppedCount?: number;
  /**
   * tail을 따라가는 동안 도착한 새 로그를 polite status region으로 요약
   * 공지합니다. 일시정지했거나 위로 스크롤해 둔 상태에서는 공지하지 않고 +N
   * 배지로만 알립니다. 디버그 콘솔처럼 공지가 방해되는 맥락에서만 끄세요.
   * @default true
   */
  announceNewLines?: boolean;
  /** 로그 뷰포트(`role="log"`)의 accessible name. @default "로그 스트림" */
  'aria-label'?: string;
  onExport?: (visibleLines: LogLine[]) => void;
  onClear?: () => void;
  onCopyLine?: (line: LogLine, text: string) => void;
}

/** Monospace log/console stream viewer with filters, search, tail controls, and copy affordances. */
export function LogViewer(props: LogViewerProps): React.JSX.Element;
