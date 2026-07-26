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
  /**
   * 선택형 카테고리 이브로우(예: "Patrol & Cleaning Robot").
   * 기본 카드에서는 생략하고, 서로 다른 제품군이 한 목록에 섞여 분류가 선택에
   * 영향을 줄 때만 보완 정보로 사용합니다.
   */
  category?: string;
  /** 짧은 설명 줄. */
  description?: string;
  /** 제품 사진 URL — 선택한 비율의 카드 전체를 채우고 하단 가독성 스크림 아래에 놓입니다. */
  image?: string;
  /**
   * 카드 자체의 가로/세로 비율. LDS ratio preset(`"3/2"`, `"1/1"`, `"4/5"` 등),
   * 숫자 또는 CSS `aspect-ratio` 문자열을 받습니다. @default "3/2"
   */
  ratio?: number | string;
  /**
   * 사진 배치 방식. `cover`는 프레임을 채우고 초점 밖을 자르며, `contain`은
   * 컷아웃·기술 이미지의 전체 형상을 24px 안전 여백 안에 보존합니다.
   * @default "cover"
   */
  imageFit?: 'cover' | 'contain';
  /** 사진 초점(object-position). `cover` crop에서 피사체 위치를 튜닝합니다. @default "50% 30%" */
  imagePosition?: string;
  /** 반응형 이미지 후보. `<img srcSet>`으로 전달됩니다. */
  imageSrcSet?: string;
  /** `imageSrcSet` 후보의 예상 표시 폭. `<img sizes>`로 전달됩니다. */
  imageSizes?: string;
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
 * 시그니처 이미지형 제품 타일 — 사진이 3:2 카드 전체를 채우고,
 * 하단 스크림 위에 제품 코드·설명과 선택형 카테고리를 배치합니다.
 * 기본 CTA 없음. 호버는 이미지 줌 + 섀도 심화만(리프트 없음).
 */
export function ProductCard(props: ProductCardProps): React.JSX.Element;
