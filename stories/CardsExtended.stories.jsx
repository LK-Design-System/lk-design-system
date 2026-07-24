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
        id="LKR-T1"
        category="Inspection AMR"
        image="./assets/products/lkr-t1.webp"
        description="설비 구역을 자율 순찰하며 계기와 밸브 상태를 점검하는 2륜 AMR입니다."
      />
      <ProductCard
        id="LKR-VisionX"
        category="Vision Module"
        image="./assets/products/lkr-visionx.webp"
        imagePosition="50% 38%"
        description="주야간 감시용 PTZ 비전 헤드를 갖춘 인식 확장 모듈입니다."
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const cards = Array.from(canvasElement.querySelectorAll('a'));
    if (cards.length !== 2) throw new Error('각 ProductCard는 하나의 링크로 렌더되어야 합니다.');
    for (const card of cards) {
      if (card.querySelector('a, button, input, select, textarea, [tabindex]')) {
        throw new Error('카드 전체가 링크이므로 안에 또 다른 포커스 가능한 요소를 두면 안 됩니다(중첩 인터랙티브 금지).');
      }
      const heading = card.querySelector('h3');
      if (!heading) throw new Error('제품 코드는 실제 heading(기본 h3)으로 렌더되어야 합니다(WCAG 1.3.1).');
      if (card.getAttribute('aria-label') !== heading.textContent.trim()) {
        throw new Error('링크의 접근 가능한 이름은 타일 전문이 아니라 제품 코드여야 합니다.');
      }
      if (card.id) throw new Error('id prop은 제품 코드이므로 DOM id를 점유하면 안 됩니다.');
      const photo = card.querySelector('img');
      if (!photo) throw new Error('image를 주면 제품 사진이 렌더되어야 합니다.');
      if (photo.getAttribute('loading') !== 'lazy' || photo.getAttribute('decoding') !== 'async') {
        throw new Error('제품 사진은 그리드 비용을 낮추도록 loading="lazy"·decoding="async"로 렌더되어야 합니다.');
      }
      // The photo is a decorative stage element: empty alt, hidden from the tree.
      if (photo.getAttribute('alt') !== '' || !photo.closest('[aria-hidden="true"]')) {
        throw new Error('제품 사진은 장식이므로 alt=""이고 aria-hidden 영역 안에 있어야 합니다.');
      }
    }
    cards[0].focus();
    if (canvasElement.ownerDocument.activeElement !== cards[0]) {
      throw new Error('제품 카드 링크는 키보드 포커스를 받아야 합니다.');
    }
    cards[0].blur();
  },
};

export const ProductCardCard = { ...ProductCardCardStory, name: 'ProductCard card parity', tags: ['!dev', 'visual-parity'] };
