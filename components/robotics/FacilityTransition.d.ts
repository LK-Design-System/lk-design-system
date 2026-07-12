import type * as React from 'react';
import type {
  NavigationActivateEvent,
  NavigationAvailability,
  NavigationPoint,
  NavigationSvgFeatureProps,
} from './WaypointMarker';

export interface FacilityTransitionEndpoint {
  readonly mapId: string;
  readonly position: NavigationPoint;
  readonly label?: string;
  /** Optional graph identity; no renderer behavior is inferred from it. */
  readonly waypointId?: string;
  /** Optional related spatial-region identity. */
  readonly regionId?: string;
  /** Optional related door identity. */
  readonly doorId?: string;
}

interface FacilityTransitionBase {
  readonly id: string;
  readonly label: string;
  readonly facilityId: string;
  readonly from: FacilityTransitionEndpoint;
  readonly to?: FacilityTransitionEndpoint;
  /** Independent from door/lift/dock state. */
  readonly availability: NavigationAvailability;
}

export type FacilityDoorState = 'closed' | 'moving' | 'open' | 'offline' | 'unknown';
export type DoorTransitionEvent = 'open' | 'close' | 'pass';

export type DoorFacilityTransition = FacilityTransitionBase & {
  readonly kind: 'door';
  readonly doorState: FacilityDoorState;
  readonly event?: DoorTransitionEvent;
};

export type LiftTransitionPhase = 'approach' | 'waiting' | 'boarding' | 'moving' | 'arrival' | 'exiting';
export type LiftMotionState = 'stopped' | 'up' | 'down' | 'unknown';
export type LiftOperatingMode = 'human' | 'agv' | 'fire' | 'offline' | 'emergency' | 'unknown';
export type LiftSessionState = 'none' | 'requested' | 'owned' | 'other' | 'unknown';

export type LiftFacilityTransition = FacilityTransitionBase & {
  readonly kind: 'lift';
  readonly phase: LiftTransitionPhase;
  readonly doorState: FacilityDoorState;
  readonly motionState?: LiftMotionState;
  readonly operatingMode?: LiftOperatingMode;
  readonly sessionState?: LiftSessionState;
  readonly currentMapId?: string;
  readonly destinationMapId?: string;
};

export type DockTransitionPhase = 'approach' | 'docking' | 'docked' | 'undocking' | 'complete';

export type DockFacilityTransition = FacilityTransitionBase & {
  readonly kind: 'dock';
  readonly phase: DockTransitionPhase;
};

export type FacilityTransitionData =
  | DoorFacilityTransition
  | LiftFacilityTransition
  | DockFacilityTransition;

export interface FacilityTransitionProps extends NavigationSvgFeatureProps {
  /** Serializable renderer-neutral transition model. */
  transition: FacilityTransitionData;
  /** Chooses the visible from/to endpoint and filters unrelated maps. */
  activeMapId: string;
  /** Removes the transition from rendering and the accessibility tree. @default false */
  hidden?: boolean;
  /** Selection/inspection activation only; never issues a facility command. */
  onActivate?: (id: string, event: NavigationActivateEvent) => void;
}

/** SVG fragment for door, lift, and dock transition state. Must be mounted inside an application-owned svg. */
export function FacilityTransition(props: FacilityTransitionProps): React.JSX.Element | null;
