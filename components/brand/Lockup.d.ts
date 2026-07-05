import * as React from 'react';

export interface LockupProps extends Omit<React.SVGProps<SVGSVGElement>, 'color'> {
  /** 'mark'(심볼만) · 'stacked'(기본) · 'inline'(가로). @default "inline" */
  variant?: 'mark' | 'stacked' | 'inline';
  /** 채움 프리셋 — 'ink' 네이비 · 'white' · 'brand' 시그널 잉크 · 'current'(currentColor). @default "ink" */
  tone?: 'ink' | 'white' | 'brand' | 'current';
  /** 명시적 채움, `tone`을 재정의. */
  color?: string;
  /** 렌더 픽셀 높이. @default 32 mark / 64 stacked / 28 inline */
  height?: number;
  /** 접근성 이름. @default "LK ROBOTICS" */
  title?: string;
  /** 이미지가 아니라 장식으로 표시(aria-hidden). @default false */
  decorative?: boolean;
}

/** LK ROBOTICS 로고 — mark / stacked / inline, 틴트 가능한 SVG로 인라인 렌더. */
export function Lockup(props: LockupProps): JSX.Element;
