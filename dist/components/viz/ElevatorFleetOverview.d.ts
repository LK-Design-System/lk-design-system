import * as React from 'react';

export type ElevatorDirection = 'up' | 'down' | 'idle';
export type ElevatorOperationalStatus = 'normal' | 'maintenance' | 'fault' | 'offline' | 'unknown';

export interface ElevatorFleetItem {
  id: string;
  name: string;
  currentFloor: string;
  direction?: ElevatorDirection;
  directionLabel?: string;
  status?: ElevatorOperationalStatus;
  statusLabel?: string;
  updatedLabel?: string;
}

export interface ElevatorFleetBuilding {
  id: string;
  name: string;
  floors: string[];
  /**
   * 지면 기준층. `floors`에 있는 값을 지정하면 그 아래 층에 지면선과 지하 톤을
   * 적용한다. 생략하거나 `floors`에 없는 값이면 지면 표시를 하지 않는다.
   * 층 이름에서 지하 여부를 추측하지 않으므로 표기 규칙이 다른 제품도 안전하다.
   */
  groundFloor?: string;
  elevators: ElevatorFleetItem[];
  statusLabel?: string;
  emptyMessage?: React.ReactNode;
}

export interface ElevatorFleetOverviewProps extends React.HTMLAttributes<HTMLElement> {
  buildings?: ElevatorFleetBuilding[];
  label?: string;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  emptyMessage?: React.ReactNode;
}

export function ElevatorFleetOverview(props: ElevatorFleetOverviewProps): React.JSX.Element;
