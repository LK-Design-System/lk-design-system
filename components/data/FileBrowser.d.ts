import * as React from 'react';

export interface FileBrowserEntry {
  id?: React.Key;
  name: string;
  kind: 'directory' | 'file';
  meta?: React.ReactNode;
  disabled?: boolean;
}

export type FileBrowserSelectionMode = 'file' | 'folder' | 'file-or-folder' | 'none';

export interface FileBrowserProps extends React.HTMLAttributes<HTMLDivElement> {
  path?: string;
  entries?: FileBrowserEntry[];
  selectedId?: React.Key;
  selectionMode?: FileBrowserSelectionMode;
  onNavigate?: (directory: FileBrowserEntry) => void;
  onUp?: () => void;
  onSelectionChange?: (entry: FileBrowserEntry) => void;
  maxHeight?: React.CSSProperties['maxHeight'];
  emptyMessage?: React.ReactNode;
  loading?: boolean;
  loadingMessage?: React.ReactNode;
  error?: React.ReactNode;
  disabled?: boolean;
  navigationDisabled?: boolean;
  /** 보이는 경로 문자열 앞에 붙는 보조기술 전용 설명. @default "현재 경로" */
  pathLabel?: string;
  /** 항목 목록(`ul`)의 접근 가능한 이름. @default "파일과 폴더" */
  listLabel?: string;
}

/** File and directory navigation with selection kept as an explicit separate action. */
export function FileBrowser(props: FileBrowserProps): React.JSX.Element;
