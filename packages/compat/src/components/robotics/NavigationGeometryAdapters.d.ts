// Temporary compatibility facade. New product code should import from
// @lk-robotics/lds-robotics-ui directly.
export {
  NAVIGATION_GEOMETRY_SPACE,
  adaptWorldLaneToLane,
  adaptWorldRouteToRoute,
  adaptWorldTrajectoryToTrajectory,
  projectNavigationWorldPoints,
  type NavigationGeometrySpace,
  type NavigationMultiMapProjectionOptions,
  type NavigationSingleMapProjectionOptions,
  type WorldLaneData,
  type WorldRouteData,
  type WorldRouteSegmentData,
  type WorldTrajectoryData,
} from '@lk-robotics/lds-robotics-ui';
