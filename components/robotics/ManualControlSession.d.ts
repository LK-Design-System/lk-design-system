import * as React from 'react';

export type ManualControlReleaseReason =
  | 'link-unavailable'
  | 'authority-unavailable'
  | 'disarmed'
  | 'deadman-released'
  | 'focus-lost'
  | 'unmount';

export interface ManualControlSessionContext {
  interactionEnabled: boolean;
  blockReason: React.ReactNode;
  focused: boolean;
  controlMode: 'pointer' | 'keyboard' | 'hybrid';
}

export interface ManualControlSessionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  title?: React.ReactNode;
  linkState?: 'ready' | 'stale' | 'lost';
  authority?: 'checking' | 'granted' | 'denied' | 'revoked';
  armed?: boolean;
  deadmanRequired?: boolean;
  deadmanActive?: boolean;
  controlMode?: 'pointer' | 'keyboard' | 'hybrid';
  focusRequired?: boolean;
  sessionMeta?: React.ReactNode;
  deadmanControl?: React.ReactNode;
  onArmedChange?: (armed: boolean) => void;
  onSafetyReleaseRequest?: (reason: ManualControlReleaseReason) => void;
  onEmergencyStopRequest?: () => void;
  onFocusChange?: (focused: boolean) => void;
  children?: React.ReactNode | ((context: ManualControlSessionContext) => React.ReactNode);
}

/** UI boundary for a manual-control session. Transport STOP and watchdog guarantees remain application responsibilities. */
export function ManualControlSession(props: ManualControlSessionProps): JSX.Element;
