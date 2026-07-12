import * as React from 'react';

export interface RefreshControlOption {
  value: string;
  label: React.ReactNode;
}

export interface RefreshControlProps extends React.HTMLAttributes<HTMLDivElement> {
  refreshing?: boolean;
  onRefresh?: () => void;
  lastUpdated?: React.ReactNode;
  lastUpdatedLabel?: React.ReactNode;
  refreshLabel?: React.ReactNode;
  /** 제품이 제어하는 polling interval 값. */
  autoRefreshValue?: string;
  autoRefreshOptions?: RefreshControlOption[];
  /** 제품 polling interval 변경 callback. 생략하면 interval control은 read-only 의미로 비활성화됩니다. */
  onAutoRefreshChange?: (value: string) => void;
  autoRefreshLabel?: string;
  disabled?: boolean;
  /** disabled 이유를 control과 함께 보이게 표시합니다. */
  unavailableReason?: React.ReactNode;
  size?: 'sm' | 'md';
}

/** freshness, 수동 새로고침, 제품 제어 자동 간격을 묶는 LDS Product control입니다. */
export function RefreshControl(props: RefreshControlProps): React.JSX.Element;
