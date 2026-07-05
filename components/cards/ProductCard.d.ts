import * as React from 'react';

export interface ProductCardProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** 제목으로 표시되는 제품 코드(예: "LKR-CP"). */
  id?: string;
  /** 카테고리 이브로우(예: "Patrol & Cleaning Robot"). */
  category?: string;
  /** 짧은 설명 줄. */
  description?: string;
  /** 제품 사진 URL — 카드 상단 68%를 차지하고 네이비로 페이드아웃. */
  image?: string;
  /** 사진 초점(object-position). 사진마다 피사체 위치가 다를 때 튜닝. @default "50% 30%" */
  imagePosition?: string;
  /** 링크 대상. @default "#" */
  href?: string;
  /**
   * 우하단 소형 라벨(12.5px). 기본은 없음 — 균질한 제품 그리드에선
   * 카드=링크 관례가 어포던스이고, 행동 유도는 섹션 헤더로 승격.
   * 개별 유도가 필요한 맥락에서만 지정.
   */
  cta?: string;
}

/**
 * 시그니처 다크 제품 타일 — 사진이 카드 상단 68%에서 네이비 무대로
 * 페이드아웃하고, 이브로우·제품 코드·설명은 항상 순수 네이비 위에 앉는다.
 * 기본 CTA 없음. 호버는 이미지 줌 + 섀도 심화만(리프트 없음).
 */
export function ProductCard(props: ProductCardProps): JSX.Element;
