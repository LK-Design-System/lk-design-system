import * as React from 'react';

export interface DimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  /** 스크림 뒤를 블러. @default false */
  blur?: boolean;
  /**
   * 열려 있는 동안 같은 컨테이너의 형제 요소를 `inert` 처리해 Tab·포인터·보조기기에서
   * 모두 제외합니다. 순수 장식용 스크림에서만 끄세요. @default true
   */
  blockInteraction?: boolean;
  /**
   * 컨테이너에 `aria-busy="true"`를 걸고 children을 `role="status"` 라이브 영역으로
   * 노출해 처리 중 상태를 알립니다. @default true
   */
  busy?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
}

/** 포지션드 조상을 채우는 스크림 오버레이(로딩 / 차단 상태). */
export function Dimmer(props: DimmerProps): React.JSX.Element | null;
