import * as React from 'react';

export type BrandLogoName = "apple" | "facebook" | "google" | "github" | "huggingface" | "linkedin" | "x" | "youtube";

export interface BrandLogoProps extends React.SVGProps<SVGSVGElement> {
  /** 브랜드 마크. */
  name: BrandLogoName;
  /** 렌더되는 정사각 크기(px). @default 24 */
  size?: number;
  /** 단색 `currentColor` 실루엣으로 렌더(라이트/다크에 맞게 반전 — 푸터·다크 바에 적합). @default false */
  mono?: boolean;
  /**
   * 이름이 있어도 장식용으로 강제합니다. 마크는 기본이 이미 장식(`aria-hidden`)이므로,
   * 이름을 함께 넘기는 합성 표면에서만 필요합니다. @default false
   */
  decorative?: boolean;
  /** 접근성 이름. 지정하면 마크가 `role="img"`로 승격됩니다(기본은 장식). */
  title?: string;
}

export const BRAND_LOGO_NAMES: BrandLogoName[];

/** 풀컬러 플랫폼 브랜드 로고(Apple / Facebook / Google / GitHub / Hugging Face / LinkedIn / X / YouTube). 기본은 장식용 마크이며, `title`(또는 `aria-label`)을 주면 정보성 이미지가 됩니다. GitHub·X·Apple은 currentColor로 테마에 맞게 반전되고, `mono`로 어떤 마크든 단색 실루엣으로 렌더할 수 있습니다. */
export function BrandLogo(props: BrandLogoProps): React.JSX.Element;
export default BrandLogo;
