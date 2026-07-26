import * as React from 'react';

export interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 플랫폼. @default "google" */
  provider?: 'google' | 'apple' | 'facebook';
  /** 'outline' = DS 네이티브(서피스 + 헤어라인 + 풀컬러 마크, 다크 테마 대응) ·
   * 'brand' = 킷의 플랫폼 원색 필(구글 화이트+섀도 · 애플 블랙 · 페이스북 #1877F2). @default "outline" */
  tone?: 'outline' | 'brand';
  /** 원형 아이콘 버튼(48px 서클, 라벨은 aria-label로) — 아이콘 행 패턴용. @default false */
  iconOnly?: boolean;
  /** 아이콘·라벨 정렬 — 킷의 Centre / Left Aligned 두 변형. @default "center" */
  align?: 'center' | 'left';
  /** 컨테이너 전체 폭. @default false */
  full?: boolean;
  /** 라벨 재정의(기본 "Google로 계속하기" 등 KR 카피). */
  children?: React.ReactNode;
  /** 비활성(흐림, 상호작용 불가). @default false */
  disabled?: boolean;
  /** 렌더 요소(링크는 "a"). @default "button" */
  as?: React.ElementType;
}

/**
 * 소셜 로그인 버튼 — "Google/Apple/Facebook으로 계속하기".
 * 지오메트리·타이포는 LK 컨트롤 문법(52px · radius-md · 16px 볼드 · 토큰 모션),
 * 기본 tone="outline"은 DS 네이티브, tone="brand"가 킷의 플랫폼 원색 필.
 * 마크는 `BrandLogo`를 재사용합니다.
 */
export function SocialButton(props: SocialButtonProps): React.JSX.Element;
