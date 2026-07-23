import * as React from 'react';

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 슬라이드 — 임의의 노드(이미지, 카드). */
  slides: React.ReactNode[];
  /** 캐러셀 영역의 접근 이름. @default "캐러셀" */
  label?: string;
  /** 슬라이드별 이름. 위치 표기 `N / 전체` 앞에 붙습니다. */
  slideLabels?: string[];
  /** 점 인디케이터. @default true */
  showDots?: boolean;
  /** 이전/다음 화살표. @default true */
  showArrows?: boolean;
  /** 자동 회전. 일시정지 컨트롤이 함께 렌더됩니다. @default false */
  autoPlay?: boolean;
  /** 자동 회전 간격(ms). @default 5000 */
  interval?: number;
  /** 이전 버튼의 접근 이름. @default "이전 슬라이드" */
  previousLabel?: string;
  /** 다음 버튼의 접근 이름. @default "다음 슬라이드" */
  nextLabel?: string;
  /** 정지 상태 회전 컨트롤의 접근 이름. @default "자동 재생 시작" */
  playLabel?: string;
  /** 재생 상태 회전 컨트롤의 접근 이름. @default "자동 재생 일시정지" */
  pauseLabel?: string;
}

/** APG carousel 패턴을 따르는 가로 슬라이드 뷰포트; 양 끝에서 순환. */
export function Carousel(props: CarouselProps): React.JSX.Element;
