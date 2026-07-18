import * as React from 'react';
import type {
  NavigationActivateEvent,
  NavigationPoint,
  NavigationSvgFeatureProps,
} from './WaypointMarker';

export type RobotId = string;

/** Serializable robot pose supplied by the runtime; the marker never infers state. */
export interface RobotPoseData {
  readonly id: RobotId;
  /** Product-provided visible name, such as "AMR 7". Falls back to the id. */
  readonly label?: string;
  readonly mapId: string;
  /** Live robot position in the owning map's coordinate space. */
  readonly position: NavigationPoint;
  /**
   * Live bearing in radians in the map's y-down space (0 = +x). Omit for an
   * omnidirectional pose with no heading nose.
   */
  readonly headingRad?: number;
  /** Optional physical footprint radius in map units; drawn as a world-space ring that grows with zoom. */
  readonly footprintRadius?: number;
}

export interface RobotMarkerProps extends NavigationSvgFeatureProps {
  pose: RobotPoseData;
  /** Select or inspect this robot. Disabled markers do not call the callback. */
  onActivate?: (robotId: RobotId, event: NavigationActivateEvent) => void;
}

/** SVG `g` fragment for one robot's live pose. Returns `null` when the position is non-finite. The consumer owns the SVG root. */
export function RobotMarker(props: RobotMarkerProps): React.JSX.Element | null;
