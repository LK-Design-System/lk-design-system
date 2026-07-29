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
  elevators: ElevatorFleetItem[];
  statusLabel?: string;
  visualLabel?: string;
  emptyMessage?: React.ReactNode;
}

export interface ElevatorFleetOverviewProps extends React.HTMLAttributes<HTMLElement> {
  buildings?: ElevatorFleetBuilding[];
  label?: string;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  emptyMessage?: React.ReactNode;
}

export function ElevatorFleetOverview(props: ElevatorFleetOverviewProps): React.JSX.Element;
