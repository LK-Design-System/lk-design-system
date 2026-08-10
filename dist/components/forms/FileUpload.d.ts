import * as React from 'react';

export interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 선택된 File[]을 받음. */
  onFiles?: (files: File[]) => void;
  /** accept 또는 단일 선택 제한으로 제외된 파일. */
  onRejectedFiles?: (files: File[]) => void;
  /** 네이티브 picker와 drag/drop에 함께 적용되는 파일 형식 규칙. */
  accept?: string;
  multiple?: boolean;
  capture?: boolean | 'user' | 'environment';
  /** Actual file input의 접근 가능한 이름을 별도로 지정합니다. */
  inputAriaLabel?: string;
  /** Helper/error element IDs applied to the actual file input. */
  inputAriaDescribedBy?: string;
  inputAriaInvalid?: React.AriaAttributes['aria-invalid'];
  /** 안내 문구. */
  hint?: React.ReactNode;
  /** drop target 크기. compact component scope에서는 기본 `sm`, 그 밖에서는 `md`. */
  size?: 'sm' | 'md' | 'small' | 'medium';
  disabled?: boolean;
}

/** 키보드 접근 가능한 native file input 기반 drag-and-drop target. */
export function FileUpload(props: FileUploadProps): React.JSX.Element;
