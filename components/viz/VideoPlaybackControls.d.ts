import * as React from 'react';

export interface VideoPlaybackControlsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Media position in elapsed seconds. @default 0 */
  currentTime?: number;
  /** Finite media length in seconds. Missing, nonpositive, NaN or Infinity disables seeking. */
  duration?: number | null;
  /** Actual playing state supplied by media events. @default false */
  playing?: boolean;
  /** Actual mute state. @default false */
  muted?: boolean;
  /** Whether the consumer's chosen viewer root is fullscreen. @default false */
  fullscreen?: boolean;
  /** Buffering/loading feedback, independent of availability. @default false */
  loading?: boolean;
  /** All commands unavailable. @default false */
  disabled?: boolean;
  /** Seeking unavailable while other commands can remain available. @default false */
  seekDisabled?: boolean;
  /** Requested play/pause state; the consumer reconciles actual media events. */
  onPlayingChange?: (playing: boolean) => void;
  /** Requested seconds, once on pointer release or on each native keyboard change. */
  onSeek?: (seconds: number) => void;
  /** Requested mute state. Omit to remove the mute control. */
  onMutedChange?: (muted: boolean) => void;
  /** Requested fullscreen state. Omit when fullscreen is unsupported. */
  onFullscreenChange?: (fullscreen: boolean) => void;
  /** Same viewer surface vocabulary as ViewerToolbar. @default "on-dark" */
  appearance?: 'minimal' | 'surface' | 'on-dark';
  /** Perimeter owner: standalone owns border/radius; embedded lets the viewer own them. @default "standalone" */
  variant?: 'standalone' | 'embedded';
  /** Accessible group name. @default "영상 재생 조작" */
  label?: string;
}

/** Renderer-neutral, controlled media commands and native LDS seek slider. */
export function VideoPlaybackControls(props: VideoPlaybackControlsProps): React.JSX.Element;
