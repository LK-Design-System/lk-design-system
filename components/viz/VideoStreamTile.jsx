import React from 'react';
import { ViewerFrame } from './ViewerFrame.jsx';

/**
 * LK Robotics — VideoStreamTile
 * Video-source preset built on ViewerFrame. Applications provide <video>,
 * WebRTC, iframe, or image output and own playback/transport behavior.
 */
export function VideoStreamTile({
  children,
  label,
  ariaLabel,
  status,
  state,
  availability,
  connection,
  freshness,
  playback,
  aspectRatio = '16 / 9',
  badges,
  hud,
  toolbar,
  overlay,
  metadata,
  stateLabel,
  stateDescription,
  stateIcon,
  stateAction,
  variant = 'standalone',
  style,
  ...rest
}) {
  const usesExplicitAxes = availability != null
    || connection != null
    || freshness != null
    || playback != null;
  const resolvedState = usesExplicitAxes ? state : state ?? status ?? 'idle';
  const resolvedAriaLabel = ariaLabel
    ?? (typeof label === 'string' && label.trim() ? `${label} 영상 스트림` : '영상 스트림');

  return (
    <ViewerFrame
      {...rest}
      label={resolvedAriaLabel}
      source={label}
      variant={variant}
      badges={badges}
      hud={hud}
      toolbar={toolbar}
      overlay={overlay}
      status={metadata}
      state={resolvedState}
      availability={availability}
      connection={connection}
      freshness={freshness}
      playback={playback}
      stateLabel={stateLabel}
      stateDescription={stateDescription}
      stateIcon={stateIcon}
      stateAction={stateAction}
      style={{ aspectRatio, ...style }}
    >
      {children}
    </ViewerFrame>
  );
}
