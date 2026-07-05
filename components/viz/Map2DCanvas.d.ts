import * as React from 'react';

export interface Map2DCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 함께 변환되는 콘텐츠(맵 이미지 · SVG 오버레이 · konva 스테이지 등). */
  children?: React.ReactNode;
  /** @default 0.25 */
  minZoom?: number;
  /** @default 8 */
  maxZoom?: number;
  /** 격자 배경. @default true */
  grid?: boolean;
  /** 줌 컨트롤 + 배율 표시. @default true */
  controls?: boolean;
}

/** 팬 · 줌 2D 캔버스 셸 — 드래그 팬 · 휠 줌 · 격자 · 줌 컨트롤. 실제 맵 렌더는 children으로. */
export function Map2DCanvas(props: Map2DCanvasProps): JSX.Element;
