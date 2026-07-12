import * as React from 'react';

export interface DataExportOption {
  value: string;
  label: React.ReactNode;
}

export interface DataExportRequest {
  format: string;
  scope: string;
}

export interface DataExportActionProps extends React.HTMLAttributes<HTMLDivElement> {
  formats?: DataExportOption[];
  formatValue?: string;
  defaultFormatValue?: string;
  onFormatChange?: (value: string) => void;
  scopeValue?: string;
  defaultScopeValue?: string;
  scopeOptions?: DataExportOption[];
  onScopeChange?: (value: string) => void;
  selectedCount?: number;
  totalCount?: number;
  onExport?: (request: DataExportRequest) => void;
  state?: 'idle' | 'processing' | 'success' | 'error';
  progress?: number;
  successMessage?: React.ReactNode;
  errorMessage?: React.ReactNode;
  /** 제품 RBAC 판정 결과. @default true */
  allowed?: boolean;
  /** 권한이 없을 때 disabled 설명 또는 완전 숨김. @default "disabled" */
  unavailableBehavior?: 'disabled' | 'hidden';
  unavailableReason?: React.ReactNode;
  exportLabel?: React.ReactNode;
  size?: 'sm' | 'md';
}

/** 형식·범위·권한·비동기 상태를 표현하는 controlled LDS Product 내보내기 action입니다. */
export function DataExportAction(props: DataExportActionProps): React.JSX.Element | null;
