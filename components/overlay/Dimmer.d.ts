import * as React from 'react';

export interface DimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  /** 스크림 뒤를 블러. @default false */
  blur?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
}

/** 포지션드 조상을 채우는 스크림 오버레이(로딩 / 차단 상태). */
export function Dimmer(props: DimmerProps): JSX.Element | null;
