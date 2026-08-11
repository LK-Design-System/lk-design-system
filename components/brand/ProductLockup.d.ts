import * as React from 'react';

export type ProductLockupProduct = 'console' | 'portal';

export interface ProductLockupProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'children' | 'color' | 'fill' | 'height' | 'preserveAspectRatio' | 'viewBox' | 'width'> {
  /** 브랜드 승인을 거쳐 outline registry에 등록된 제품 key. */
  product: ProductLockupProduct;
  /** 밝은 단색 배경의 공식 네이비 또는 어두운 단색 배경의 반전 화이트. @default "ink" */
  tone?: 'ink' | 'white';
  /** 전체 SVG의 자연 높이. 20px 미만은 20px로 보정됩니다. @default 28 */
  height?: number;
  /** 제품 워드마크를 생략하고 LK mark만 표시합니다. 접근성 이름은 유지됩니다. @default false */
  compact?: boolean;
  /** 독립 사용 시 기본 이름 `LK {registered label}`을 문맥에 맞게 덮습니다. */
  'aria-label'?: string;
  /** 이름을 소유한 링크·컨트롤 안에서 중복 낭독을 막습니다. @default false */
  decorative?: boolean;
}

/** LK Portal과 같은 outline 조형을 승인 제품 registry에 적용하는 제품 셸 lockup. */
export function ProductLockup(props: ProductLockupProps): React.JSX.Element;
