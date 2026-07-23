import * as React from 'react';

export interface ProductCardProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * 제목(heading)으로 표시되는 제품 코드(예: "LKR-CP"). 링크의 접근 가능한
   * 이름도 이 값입니다.
   *
   * 주의 — 이 prop은 **DOM `id` 속성으로 전달되지 않습니다.** 카드를 DOM에서
   * 지목해야 하면 `data-*` 속성을 쓰거나 카드를 감싸는 래퍼에 `id`를 주세요.
   */
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
  /**
   * 제품 코드(`id`)의 heading 레벨. 카탈로그가 놓인 문서 계층에 맞춰 `1`–`6`을
   * 주고, 제목이 이미 카드 바깥에 있으면 `false`로 끕니다. @default 3
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6 | false;
}

/**
 * 시그니처 다크 제품 타일 — 사진이 카드 상단 68%에서 네이비 무대로
 * 페이드아웃하고, 이브로우·제품 코드·설명은 항상 순수 네이비 위에 앉는다.
 * 기본 CTA 없음. 호버는 이미지 줌 + 섀도 심화만(리프트 없음).
 */
export function ProductCard(props: ProductCardProps): React.JSX.Element;
