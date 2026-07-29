import React from 'react';
import { ViewerFrame } from './ViewerFrame.jsx';

/**
 * LDS Product — VideoStreamTile
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
  liveness,
  hud,
  toolbar,
  overlay,
  metadata,
  stateLabel,
  stateDescription,
  stateIcon,
  stateAction,
  variant = 'standalone',
  chromeVariant = 'overlay',
  toolbarVisibility = 'interaction',
  // 영상 컨트롤은 하단이 플레이어 관례이고, 우상단은 상시 표시되는 생존성
  // 신호(라이브)가 화면 끝에 붙을 수 있도록 비워 둔다. 상단에 두면 숨겨진
  // 툴바가 자리를 차지해 라이브가 가장자리에서 밀려난다.
  toolbarPlacement = 'bottom-right',
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
      chromeVariant={chromeVariant}
      badges={badges}
      liveness={liveness}
      hud={hud}
      toolbar={toolbar}
      toolbarVisibility={toolbarVisibility}
      toolbarPlacement={toolbarPlacement}
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
