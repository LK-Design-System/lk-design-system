import * as React from 'react';

export interface FileUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrop'> {
  /** 선택된 File[]을 받음. */
  onFiles?: (files: File[]) => void;
  /** `accept` 속성(예: "image/*,.pdf"). */
  accept?: string;
  multiple?: boolean;
  /** 안내 문구. */
  hint?: React.ReactNode;
  disabled?: boolean;
}

/** 클릭 / 드래그 드롭존; 드래그 중 강조, 파일명 나열. */
export function FileUpload(props: FileUploadProps): JSX.Element;
