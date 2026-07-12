import { ProductCard } from '../src/index.js';
import { ProductCardCard as ProductCardCardStory } from './CardsExtended.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Content/Product Card',
  parameters: {
    storyGuide: {
      storyId: 'lds-product-content-product-card--product-cards',
      eyebrow: 'Product / Product Card',
      title: '사용자가 제품이나 패키지의 정체성과 핵심 설명을 비교합니다',
      description:
        '제품 ID·카테고리·설명을 한 단위로 묶어 카탈로그형 선택을 지원할 때 적합합니다. 상세 제원 비교나 상태 모니터링에는 ProductCard 대신 Spec Row가 있는 상세 패널이나 상태 전용 패턴을 사용하세요.',
    },
    docs: {
      description: {
        component: '제품 ID, 카테고리, 설명, 이미지를 묶어 보여주는 ProductCard 패턴입니다.',
      },
    },
  },
};

export default meta;

export const ProductCards = {
  name: '개요',
  parameters: storyDescription(
    '서로 다른 제품 패키지를 같은 카드 구조로 비교하는 상황입니다. ID와 카테고리가 먼저 읽히고 설명 길이가 달라도 카드 간 위계와 정렬이 유지되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', maxWidth: 760 }}>
      <ProductCard
        id="Core Kit"
        category="Component Bundle"
        description="토큰, 컴포넌트, 문서 예제를 하나의 패키지로 제공합니다."
      />
      <ProductCard
        id="Docs Kit"
        category="Documentation"
        description="가이드와 예제를 함께 제공하는 문서 카드입니다."
      />
    </main>
  ),
};

export const ProductCardCard = { ...ProductCardCardStory, name: 'ProductCard card parity', tags: ['!dev', 'visual-parity'] };
