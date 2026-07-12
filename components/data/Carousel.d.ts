import * as React from 'react';

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 슬라이드 — 임의의 노드(이미지, 카드). */
  slides: React.ReactNode[];
  /** 점 인디케이터. @default true */
  showDots?: boolean;
  /** 이전/다음 화살표. @default true */
  showArrows?: boolean;
}

/** 점 + 화살표가 있는 가로 슬라이드 뷰포트; 양 끝에서 순환. */
export function Carousel(props: CarouselProps): React.JSX.Element;
