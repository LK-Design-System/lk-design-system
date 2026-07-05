import * as React from 'react';

export interface Scene3DFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 3D 캔버스(three / @react-three/fiber 등)를 자식으로. */
  children?: React.ReactNode;
  /** 좌상단 HUD 타이틀(대문자). */
  title?: React.ReactNode;
  /** 타이틀 옆 배지 노드. */
  badges?: React.ReactNode;
  /** 우상단 툴바 슬롯. */
  toolbar?: React.ReactNode;
  /** 로딩 오버레이. @default false */
  loading?: boolean;
  /** 빈 상태 메시지(로딩이 아닐 때). */
  empty?: React.ReactNode;
}

/** 3D 뷰포트 크롬 셸 — 다크 프레임 + HUD(타이틀·배지) · 툴바 슬롯 · 로딩/빈 상태. */
export function Scene3DFrame(props: Scene3DFrameProps): JSX.Element;
