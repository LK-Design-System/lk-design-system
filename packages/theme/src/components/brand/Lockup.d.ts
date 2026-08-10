import * as React from 'react';

export interface LockupProps extends Omit<React.SVGProps<SVGSVGElement>, 'color'> {
  /** 'mark'(심볼만) · 'stacked'(기본) · 'inline'(가로). @default "inline" */
  variant?: 'mark' | 'stacked' | 'inline';
  /** 채움 프리셋 — 공식 네이비, 반전 화이트, 제약된 흑백 mono, 호환용 currentColor. @default "ink" */
  tone?: 'ink' | 'white' | 'brand' | 'mono' | 'current';
  /** 호환용 명시 채움. 임의 색을 공식 로고 사용으로 승인하지 않으며 신규 사용은 tone을 우선합니다. */
  color?: string;
  /** 요청 자연 높이. 최소 20 mark / 64 stacked / 20 inline으로 보정됩니다. 기본 responsive style의 축소는 실제 표시 최소를 보장하지 않습니다. @default 32 / 64 / 28 */
  height?: number;
  /** 접근성 이름. @default "LK ROBOTICS" */
  title?: string;
  /** 이미지가 아니라 장식으로 표시(aria-hidden). @default false */
  decorative?: boolean;
}

/** 규정된 커스텀 LK 심볼과 Montserrat ExtraBold 800 아웃라인 기반 로고. width/viewBox/style override는 호환용이며 브랜드 규격 사용에서는 금지합니다. */
export function Lockup(props: LockupProps): React.JSX.Element;
