import * as React from 'react';

export interface NewsCardProps extends React.HTMLAttributes<HTMLAnchorElement> {
  /** 커버 이미지 URL(선택). */
  image?: string;
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
  /** 선택적 콜투액션 라벨(끝 화살표와 함께 렌더). */
  cta?: React.ReactNode;
  /** 기사 링크. @default "#" */
  href?: string;
}

/** 기사 / 보도 카드 — 커버, 카테고리, 헤드라인, 발췌, 출처 · 날짜. 호버 시 떠오름. */
export function NewsCard(props: NewsCardProps): JSX.Element;
