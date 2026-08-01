import * as React from 'react';
import type { DropdownMenuItem } from '@lk-design-system/lds-core/components/overlay/DropdownMenu';
import { ReactionLike, ReactionAction } from '../content/ReactionBar';

export interface FeedAuthor {
  /** 작성자 이름. article 접근 이름(`{name}님의 게시물`)에 쓰입니다. */
  name?: React.ReactNode;
  /** 아바타 이미지 URL. */
  src?: string;
  /** 아바타 변형. 팀·기관은 `company`/`academy`. @default "person" */
  variant?: 'person' | 'company' | 'academy' | 'education';
  /** 있으면 이름이 프로필 링크가 됩니다. */
  href?: string;
  /** 이름 옆 인증/역할 배지(예: 인증 체크 아이콘, "1촌"). 이름 뒤에 인라인 렌더됩니다. */
  badge?: React.ReactNode;
}

export interface FeedCardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** 작성자 identity(아바타·이름·링크). */
  author?: FeedAuthor;
  /** 헤더 보조 줄의 출처 부분(예: "운영 업데이트"). `time`과 함께 주면 `출처 · 시간`으로 합쳐집니다. */
  meta?: React.ReactNode;
  /** 상대 시간 라벨(예: "6시간 전"). 주면 `<time>`으로 렌더되어 보조 줄에 합쳐집니다. */
  time?: React.ReactNode;
  /** `time`의 기계판독 값(ISO 8601, 예: "2026-07-24T09:00:00Z"). `<time datetime>`에 들어갑니다. */
  datetime?: string;
  /** 팔로우 상태. 지정하거나 `onFollowToggle`을 주면 팔로우 버튼이 나타납니다. */
  following?: boolean;
  /** 팔로우 버튼 클릭 핸들러. */
  onFollowToggle?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** 팔로우 버튼 라벨. @default following ? "팔로잉" : "팔로우" */
  followLabel?: React.ReactNode;
  /** ⋮ 오버플로 메뉴 항목. 있을 때만 메뉴가 나타납니다. */
  menuItems?: DropdownMenuItem[];
  /** 오버플로 트리거 접근 라벨. 본문 펼치기("더 보기")와 겹치지 않게 기본값을 구분합니다. @default "게시물 옵션" */
  menuLabel?: string;
  /** 커버 이미지 URL(선택). 16:9로 지연 로드됩니다. */
  cover?: string;
  /** 커버 대체 텍스트. @default "" */
  coverAlt?: string;
  /** 본문 클램프 줄 수. `false`면 클램프 없이 전체를 렌더합니다. @default 3 */
  clamp?: number | false;
  /** 좋아요 토글(선택) — `ReactionBar`로 전달됩니다. */
  like?: ReactionLike;
  /** 댓글 액션(선택). */
  comment?: ReactionAction;
  /** 공유 액션(선택). */
  share?: ReactionAction;
  /** 작성자 이름의 heading 레벨. 주면 이름이 heading이 되어 피드 아웃라인을 만듭니다. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** 게시물 본문. */
  children?: React.ReactNode;
}

/** 소셜 피드 게시물 카드 — 작성자 헤더, 본문(더 보기), 커버, 인게이지먼트 바. */
export function FeedCard(props: FeedCardProps): React.JSX.Element;
