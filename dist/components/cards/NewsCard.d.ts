import * as React from 'react';

export interface NewsCardProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'title'> {
  /** 커버 이미지 URL(선택). */
  image?: string;
  /**
   * 커버 이미지 대체 텍스트. 기본값은 빈 문자열 — 헤드라인이 이미 의미를
   * 전달하므로 커버는 장식으로 둡니다. 사진 자체가 정보를 담을 때만 지정하며,
   * 이때 링크의 접근 이름은 `헤드라인. imageAlt`로 합성됩니다(카드 = 링크라
   * 이미지 alt만으로는 낭독되지 않기 때문). 커버는 `loading="lazy"`로 지연
   * 로드되고 16:9 박스가 로드 전 레이아웃을 예약합니다.
   * @default ""
   */
  imageAlt?: string;
  /** 대문자 카테고리 키커. */
  category?: React.ReactNode;
  /** 헤드라인. */
  title?: React.ReactNode;
  /** 짧은 발췌 / 데크. */
  excerpt?: React.ReactNode;
  /** 푸터의 출처 / 바이라인. */
  source?: React.ReactNode;
  /** 날짜(tabular 숫자). */
  date?: React.ReactNode;
  /** `date`의 기계 판독 값(ISO 8601). 주면 날짜가 `time` 엘리먼트로 렌더됩니다. */
  dateTime?: string;
  /** 선택적 콜투액션 라벨(끝 화살표와 함께 렌더). */
  cta?: React.ReactNode;
  /** 기사 링크. @default "#" */
  href?: string;
  /**
   * 헤드라인의 heading 레벨. 목록이 놓인 문서 계층에 맞춰 `1`–`6`을 주고,
   * 제목이 이미 카드 바깥에 있으면 `false`로 끕니다. @default 3
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6 | false;
}

/** 기사 / 보도 카드 — 커버, 카테고리, 헤드라인, 발췌, 출처 · 날짜. 호버 시 떠오름. */
export function NewsCard(props: NewsCardProps): React.JSX.Element;
