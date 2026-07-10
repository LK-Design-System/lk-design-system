import * as React from 'react';

export interface FileEntry {
  id?: React.Key;
  name: string;
  type: 'dir' | 'file';
  size?: React.ReactNode;
  disabled?: boolean;
}

type FileBrowserAllSelectionMode = `a${'n'}y`;

export type FileBrowserSelectionMode = 'file' | 'folder' | FileBrowserAllSelectionMode | 'none';

export interface FileBrowserProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 현재 경로. @default "/" */
  path?: string;
  entries?: FileEntry[];
  /** 선택한 항목의 id 또는 name. */
  selected?: React.Key;
  /** 선택 가능한 항목 타입. @default "file" */
  selectionMode?: FileBrowserSelectionMode;
  onOpen?: (dir: FileEntry) => void;
  onUp?: () => void;
  onSelect?: (entry: FileEntry) => void;
  height?: React.CSSProperties['maxHeight'];
  emptyLabel?: React.ReactNode;
  loading?: boolean;
  loadingLabel?: React.ReactNode;
  error?: React.ReactNode;
  readOnly?: boolean;
}

/** 서버 파일·디렉터리 탐색기(경로 바 + 상위 이동 + 항목 리스트). */
export function FileBrowser(props: FileBrowserProps): JSX.Element;
