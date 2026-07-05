import * as React from 'react';

export type BrandLogoName = "apple" | "facebook" | "google" | "github" | "huggingface" | "linkedin" | "x" | "youtube";

export interface BrandLogoProps extends React.SVGProps<SVGSVGElement> {
  /** 브랜드 마크. */
  name: BrandLogoName;
  /** 렌더되는 정사각 크기(px). @default 24 */
  size?: number;
  /** 단색 `currentColor` 실루엣으로 렌더(라이트/다크에 맞게 반전 — 푸터·다크 바에 적합). @default false */
  mono?: boolean;
  /** 장식용 마크로 렌더해 접근성 트리에서 숨김. @default false */
  decorative?: boolean;
  /** 접근성 라벨(기본값 "<name> logo"). */
  title?: string;
}

export const BRAND_LOGO_NAMES: BrandLogoName[];

/** 풀컬러 플랫폼 브랜드 로고(Apple / Facebook / Google / GitHub / Hugging Face / LinkedIn / X / YouTube). GitHub·X·Apple은 currentColor로 테마에 맞게 반전되고, `mono`로 어떤 마크든 단색 실루엣으로 렌더할 수 있습니다. */
export function BrandLogo(props: BrandLogoProps): JSX.Element;
export default BrandLogo;
