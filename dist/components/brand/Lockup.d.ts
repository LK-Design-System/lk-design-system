import * as React from 'react';

export interface LockupProps extends Omit<React.SVGProps<SVGSVGElement>, 'color'> {
  /** 'mark'(심볼만) · 'stacked' · 'inline'(가로) · 'portal'(SemiBold 600 LK Portal 고정 정본; ProductLockup의 portal과 동일 조형). @default "inline" */
  variant?: 'mark' | 'stacked' | 'inline' | 'portal';
  /** 채움 프리셋 — 공식 네이비, 반전 화이트, 호환용 currentColor. 제약된 검정 단색 출력은 color="#000000"을 명시합니다. @default "ink" */
  tone?: 'ink' | 'white' | 'brand' | 'current';
  /** 호환용 명시 채움. 임의 색을 공식 로고 사용으로 승인하지 않으며 신규 사용은 tone을 우선합니다. */
  color?: string;
  /** 요청 자연 높이. 최소 20 mark / 64 stacked / 20 inline으로 보정됩니다. 기본 responsive style의 축소는 실제 표시 최소를 보장하지 않습니다. @default 32 / 64 / 28 */
  height?: number;
  /** 접근성 이름. portal은 "LK Portal", 나머지는 "LK ROBOTICS"가 기본값입니다. */
  title?: string;
  /** 이미지가 아니라 장식으로 표시(aria-hidden). @default false */
  decorative?: boolean;
}

/** 규정된 커스텀 LK 심볼, Montserrat ExtraBold 800 기업 워드마크, SemiBold 600 Portal 정본. 일반 제품 셸은 ProductLockup을 사용합니다. width/viewBox/style override는 호환용이며 브랜드 규격 사용에서는 금지합니다. */
export function Lockup(props: LockupProps): React.JSX.Element;
