import * as React from 'react';
import type {
  ViewerAvailability,
  ViewerConnection,
  ViewerFreshness,
  ViewerPlayback,
  ViewerState,
} from './ViewerFrame';

export interface VideoStreamTileProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Actual video, WebRTC, iframe, or image renderer output. */
  children?: React.ReactNode;
  /** Visible camera or media-source identity. */
  label?: React.ReactNode;
  /** Accessible region name. Derived from a string label when omitted. */
  ariaLabel?: string;
  /** Normalized stream state. Prefer `state` in new code. @default "idle" */
  status?: ViewerState;
  /** Normalized stream state. Takes precedence over the compatibility `status` prop. */
  state?: ViewerState;
  availability?: ViewerAvailability;
  connection?: ViewerConnection;
  freshness?: ViewerFreshness;
  playback?: ViewerPlayback;
  /** CSS aspect-ratio value. @default "16 / 9" */
  aspectRatio?: string;
  badges?: React.ReactNode;
  /** 상단 우측 생존성 슬롯. `state="live"`의 라이브 표시가 이 자리에 렌더된다. */
  liveness?: React.ReactNode;
  /** Compact passive diagnostics; keep the default HUD to essential values. */
  hud?: React.ReactNode;
  /** Viewport-local mute, captions, snapshot, or fullscreen controls. */
  toolbar?: React.ReactNode;
  /** Non-interactive video overlay. */
  overlay?: React.ReactNode;
  /** Passive stream metadata such as resolution, FPS, or freshness. */
  metadata?: React.ReactNode;
  stateLabel?: React.ReactNode;
  stateDescription?: React.ReactNode;
  stateIcon?: React.ReactNode;
  stateAction?: React.ReactNode;
  /** Perimeter ownership. "embedded" drops the tile's own border and radius so a parent surface owns one continuous outline. @default "standalone" */
  variant?: 'standalone' | 'embedded';
  /** Video chrome treatment. @default "overlay" */
  chromeVariant?: 'surface' | 'overlay';
  /** Local media controls are revealed by hover, press, or focus by default. */
  toolbarVisibility?: 'always' | 'interaction';
  /**
   * 뷰포트 컨트롤 위치. 영상은 플레이어 관례를 따라 하단이 기본이며, 상단 우측은
   * 상시 표시되는 생존성 신호가 화면 끝에 붙도록 비워 둔다. @default "bottom-right"
   */
  toolbarPlacement?: 'top-right' | 'bottom-right';
}

/** Video-source preset built on ViewerFrame. Transport and playback remain application-owned. */
export function VideoStreamTile(props: VideoStreamTileProps): React.JSX.Element;
