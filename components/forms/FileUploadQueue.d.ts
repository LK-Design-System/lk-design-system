import * as React from 'react';

export interface FileUploadQueueItem {
  id: React.Key;
  /** 파일명이며 progress/action accessible name에도 사용됩니다. */
  name: string;
  status: 'queued' | 'uploading' | 'processing' | 'succeeded' | 'failed';
  progress?: number;
  label?: React.ReactNode;
  sizeLabel?: React.ReactNode;
  message?: React.ReactNode;
}

export interface FileUploadQueueProps extends React.HTMLAttributes<HTMLElement> {
  items?: FileUploadQueueItem[];
  title?: React.ReactNode;
  emptyLabel?: React.ReactNode;
  onRetry?: (item: FileUploadQueueItem) => void;
  /** 업로드·처리 중인 행의 명시적 취소 요청. */
  onCancel?: (item: FileUploadQueueItem) => void;
  onRemove?: (item: FileUploadQueueItem) => void;
  onOpen?: (item: FileUploadQueueItem) => void;
}

/** Per-file upload and conversion queue. */
export function FileUploadQueue(props: FileUploadQueueProps): JSX.Element;
