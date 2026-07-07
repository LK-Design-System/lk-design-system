import { ProductCard } from '../src/index.js';
import { ProductCardCard as ProductCardCardStory } from './CardsExtended.shared.jsx';

const meta = {
  title: 'LDS Product/Content/Product Card',
  parameters: {
    docs: {
      description: {
        component: '제품 ID, 카테고리, 설명, 이미지를 묶어 보여주는 ProductCard 패턴입니다.',
      },
    },
  },
};

export default meta;

export const ProductCards = {
  name: '제품 카드',
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
