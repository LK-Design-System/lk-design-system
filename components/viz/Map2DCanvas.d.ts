import * as React from 'react';

export interface Map2DViewport {
  x: number;
  y: number;
  z: number;
}

export interface Map2DCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 함께 변환되는 콘텐츠(맵 이미지 · SVG 오버레이 · konva 스테이지 등). */
  children?: React.ReactNode | ((context: { viewport: Map2DViewport; setViewport: (viewport: Map2DViewport | ((viewport: Map2DViewport) => Map2DViewport)) => void }) => React.ReactNode);
  /** @default 0.25 */
  minZoom?: number;
  /** @default 8 */
  maxZoom?: number;
  /** 격자 배경. @default true */
  grid?: boolean;
  /** 줌 컨트롤 + 배율 표시. @default true */
  controls?: boolean;
  /** 드래그 팬 사용 여부. 선택/드로잉 툴일 때 false로 두면 앱 캔버스 이벤트와 충돌하지 않는다. @default true */
  panEnabled?: boolean;
  /** 키보드 줌/팬 단축키 사용 여부. @default true */
  keyboard?: boolean;
  /** 제어형 뷰포트 상태. */
  viewport?: Map2DViewport;
  /** 비제어 초기 뷰포트. */
  defaultViewport?: Map2DViewport;
  /** 뷰포트 변경 콜백. */
  onViewportChange?: (viewport: Map2DViewport) => void;
  /** 뷰포트 위 오버레이 슬롯. */
  overlay?: React.ReactNode;
  /** 좌하단 상태 칩. 기본은 zoom %. */
  status?: React.ReactNode;
  /** 접근성 라벨. @default "2D 맵 캔버스" */
  label?: string;
}

/** 팬 · 줌 2D 캔버스 셸 — 드래그 팬 · 휠 줌 · 격자 · 줌 컨트롤. 실제 맵 렌더는 children으로. */
export function Map2DCanvas(props: Map2DCanvasProps): JSX.Element;
