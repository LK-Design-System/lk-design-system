import * as React from 'react';

export type ProductLockupProduct = 'console' | 'portal';
/** 회사 보증 형이 승인된 registry key. */
export type ProductLockupCompanyProduct = 'portal';
/** `mark`: LK mark + 대문자 제품명. `company`: 회사 inline 로크업 + canonical 대소문자 제품명. */
export type ProductLockupEndorsement = 'mark' | 'company';

interface ProductLockupBaseProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'children' | 'color' | 'fill' | 'height' | 'preserveAspectRatio' | 'viewBox' | 'width'> {
  /** 밝은 단색 배경의 공식 네이비 또는 어두운 단색 배경의 반전 화이트. @default "positive" */
  appearance?: 'positive' | 'reverse';
  /** 전체 SVG의 자연 높이. 20px 미만은 20px로 보정됩니다. @default 28 */
  height?: number;
  /** 독립 사용 시 기본 이름(mark 형 `LK {label}`, 회사 보증 형 `LK ROBOTICS {label}`)을 문맥에 맞게 덮습니다. */
  'aria-label'?: string;
  /** 이름을 소유한 링크·컨트롤 안에서 중복 낭독을 막습니다. @default false */
  decorative?: boolean;
}

export interface ProductLockupMarkProps extends ProductLockupBaseProps {
  /** 브랜드 승인을 거쳐 outline registry에 등록된 제품 key. */
  product: ProductLockupProduct;
  /** LK mark를 모브랜드로 우선하는 제품 셸 형태. @default "mark" */
  endorsement?: 'mark';
  /** 같은 SVG에서 제품 워드마크 영역을 접어 LK mark만 표시합니다. 접근성 이름은 유지됩니다. @default false */
  compact?: boolean;
}

export interface ProductLockupCompanyProps extends ProductLockupBaseProps {
  /** 회사 보증 형이 승인된 registry key. */
  product: ProductLockupCompanyProduct;
  /** 회사 inline 로크업(LK ROBOTICS) 뒤에 승인 제품명을 붙인 회사 보증 형. 홈 hero·로그인 같은 넓은 첫인상 표면용입니다. */
  endorsement: 'company';
  /** 회사 보증 형은 compact가 없습니다. 좁은 슬롯은 `Lockup variant="inline"`이나 `"mark"`로 전환합니다. */
  compact?: false;
}

export type ProductLockupProps = ProductLockupMarkProps | ProductLockupCompanyProps;

/** LK mark 또는 회사 inline 로크업을 모브랜드로 우선하고 승인 제품명을 SemiBold outline으로 조합하는 제품 lockup. */
export function ProductLockup(props: ProductLockupProps): React.JSX.Element;
