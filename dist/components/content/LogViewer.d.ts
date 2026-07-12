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
  onExport?: (visibleLines: LogLine[]) => void;
  onClear?: () => void;
  onCopyLine?: (line: LogLine, text: string) => void;
}

/** Monospace log/console stream viewer with filters, search, tail controls, and copy affordances. */
export function LogViewer(props: LogViewerProps): React.JSX.Element;
