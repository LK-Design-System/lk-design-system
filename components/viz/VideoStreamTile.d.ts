import * as React from 'react';

export interface VideoStreamTileProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 실제 영상 엘리먼트(iframe/video) — 렌더 소스는 앱이 주입. */
  children?: React.ReactNode;
  /** 좌상단 코너 라벨(예: "RGB", "IR", "EO-1"). */
  label?: React.ReactNode;
  /** "live"면 코너에 점 인디케이터, "loading"/"disconnected"면 오버레이. @default "live" */
  status?: 'live' | 'loading' | 'disconnected';
  /** CSS aspect-ratio 값. @default "16 / 9" */
  aspectRatio?: string;
}

/** 라이브 비디오 스트림 타일 셸 — 코너 라벨 칩 · 로딩/연결끊김 오버레이. 실제 렌더는 children으로 주입. */
export function VideoStreamTile(props: VideoStreamTileProps): JSX.Element;
