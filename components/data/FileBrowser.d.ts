import * as React from 'react';

export interface FileEntry {
  name: string;
  type: 'dir' | 'file';
  size?: React.ReactNode;
}

export interface FileBrowserProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 현재 경로. @default "/" */
  path?: string;
  entries?: FileEntry[];
  /** 선택된 항목 이름. */
  selected?: string;
  onOpen?: (dir: FileEntry) => void;
  onUp?: () => void;
  onSelect?: (entry: FileEntry) => void;
  height?: number;
}

/** 서버 파일·디렉터리 탐색기(경로 바 + 상위 이동 + 항목 리스트). */
export function FileBrowser(props: FileBrowserProps): JSX.Element;
