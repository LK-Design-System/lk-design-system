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
}

/** File and directory navigation with selection kept as an explicit separate action. */
export function FileBrowser(props: FileBrowserProps): JSX.Element;
