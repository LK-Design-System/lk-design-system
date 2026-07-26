import * as React from 'react';

export interface ListingMetaRow {
  /** 행 앞 아이콘 이름(registry). 예: `calendar`, `location`, `tag`, `clock`. */
  icon?: string;
  /** 행 텍스트(기간·장소·분류 등). 한 줄로 말줄임됩니다. */
  label: React.ReactNode;
}

export interface ListingCardProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'title'> {
  /** 커버 이미지 URL(선택). */
  image?: string;
  /**
   * 커버 대체 텍스트. 기본은 빈 문자열(장식) — 제목이 이미 의미를 전달합니다.
   * 사진이 정보를 담으면 지정하며, 그 값은 링크 접근 이름에 `제목. imageAlt`로
   * 합성됩니다. 커버는 `loading="lazy"`로 지연 로드되고 16:9 박스가 레이아웃을
   * 예약합니다.
   * @default ""
   */
  imageAlt?: string;
  /** 항목 제목(2줄 clamp, 실제 heading). */
  title?: React.ReactNode;
  /** 아이콘 붙은 메타 행들 — 기간·장소·분류 등 보조 정보. */
  meta?: ListingMetaRow[];
  /**
   * 수명주기 상태. 문자열이면 `ContentBadge`로 렌더되고 링크 접근 이름 끝에
   * 합성되어 낭독됩니다(진행중·신청 마감처럼 열림/닫힘이 클릭 결정을 바꾸므로).
   * 직접 만든 배지 노드를 넘기면 그대로 렌더하되 접근 이름 합성은 하지 않습니다.
   */
  status?: React.ReactNode;
  /** 문자열 `status`의 배지 톤. @default "neutral" */
  statusTone?: 'signal' | 'accent' | 'navy' | 'neutral' | 'positive' | 'cautionary' | 'warning' | 'negative';
  /**
   * 제목의 heading 레벨. 목록이 놓인 문서 계층에 맞춰 `1`–`6`을 주고, 제목이
   * 이미 카드 바깥에 있으면 `false`로 끕니다. @default 3
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6 | false;
  /** 항목 링크. @default "#" */
  href?: string;
}

/** 목록·카탈로그 항목 카드 — 커버, 제목, 아이콘 메타 행, 수명주기 상태 배지. */
export function ListingCard(props: ListingCardProps): React.JSX.Element;
