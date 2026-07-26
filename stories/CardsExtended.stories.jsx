import { ProductCard } from '../src/index.js';
import { ProductCardCard as ProductCardCardStory } from './CardsExtended.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Content/Product Card',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-product-content-product-card--product-cards',
      eyebrow: 'Product / Product Card',
      title: '사용자가 제품이나 패키지의 정체성과 핵심 설명을 비교합니다',
      description:
        '제품 ID·핵심 설명을 한 단위로 묶어 카탈로그형 선택을 지원할 때 적합합니다. 제품군 자체가 선택 기준인 혼합 목록에서만 선택적으로 카테고리를 보완하고, 상세 제원 비교나 상태 모니터링에는 ProductCard 대신 Spec Row가 있는 상세 패널이나 상태 전용 패턴을 사용하세요.',
    },
    docs: {
      description: {
        component: '제품 ID, 설명, 이미지를 묶고 필요한 경우에만 카테고리를 보완하는 ProductCard 패턴입니다.',
      },
    },
  },
};

export default meta;

export const ProductCards = {
  name: '개요',
  parameters: storyDescription(
    '서로 다른 제품 패키지를 같은 카드 구조로 비교하는 상황입니다. 기본 카드에서는 제품 ID가 먼저 읽히고, 설명 길이가 달라도 카드 간 위계와 정렬이 유지되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', maxWidth: 760 }}>
      <ProductCard
        headingLevel={2}
        id="LKR-T1"
        image="./assets/products/lkr-t1.webp"
        description="설비 구역을 자율 순찰하며 계기와 밸브 상태를 점검하는 2륜 AMR입니다."
      />
      <ProductCard
        headingLevel={2}
        id="LKR-VisionX"
        image="./assets/products/lkr-visionx.webp"
        imagePosition="50% 38%"
        description="주야간 감시용 PTZ 비전 헤드를 갖춘 인식 확장 모듈입니다."
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const cards = Array.from(canvasElement.querySelectorAll('a'));
    if (cards.length !== 2) throw new Error('각 ProductCard는 하나의 링크로 렌더되어야 합니다.');
    if (canvasElement.textContent?.includes('Inspection AMR') || canvasElement.textContent?.includes('Vision Module')) {
      throw new Error('기본 ProductCard 예제는 중복 카테고리 eyebrow를 표시하지 않아야 합니다.');
    }
    for (const card of cards) {
      if (card.querySelector('a, button, input, select, textarea, [tabindex]')) {
        throw new Error('카드 전체가 링크이므로 안에 또 다른 포커스 가능한 요소를 두면 안 됩니다(중첩 인터랙티브 금지).');
      }
      const heading = card.querySelector('h2');
      if (!heading) throw new Error('제품 코드는 실제 heading(기본 h3)으로 렌더되어야 합니다(WCAG 1.3.1).');
      if (card.getAttribute('aria-label') !== heading.textContent.trim()) {
        throw new Error('링크의 접근 가능한 이름은 타일 전문이 아니라 제품 코드여야 합니다.');
      }
      const cardRect = card.getBoundingClientRect();
      if (Math.abs((cardRect.width / cardRect.height) - 1.5) > 0.02) {
        throw new Error('ratio를 생략한 ProductCard는 기본 가로형 3:2 비율이어야 합니다.');
      }
      const content = heading.parentElement?.parentElement;
      const scrim = content?.previousElementSibling;
      if (!content || getComputedStyle(content).paddingTop !== '24px') {
        throw new Error('ProductCard 콘텐츠는 space-6(24px) 패딩을 사용해야 합니다.');
      }
      if (scrim?.getAttribute('aria-hidden') !== 'true'
        || !getComputedStyle(scrim).backgroundImage.includes('linear-gradient')) {
        throw new Error('ProductCard 텍스트 뒤에는 전용 하단 가독성 스크림이 있어야 합니다.');
      }
      if (card.id) throw new Error('id prop은 제품 코드이므로 DOM id를 점유하면 안 됩니다.');
      const photo = card.querySelector('img');
      if (!photo) throw new Error('image를 주면 제품 사진이 렌더되어야 합니다.');
      if (getComputedStyle(photo).objectFit !== 'cover') {
        throw new Error('기본 제품 사진은 원본 비율과 무관하게 cover 정책을 사용해야 합니다.');
      }
      const photoRect = photo.getBoundingClientRect();
      if (Math.abs(photoRect.width - cardRect.width) > 2 || Math.abs(photoRect.height - cardRect.height) > 2) {
        throw new Error('제품 사진은 카드 전체를 채워야 합니다.');
      }
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

export const CardRatioPolicy = {
  name: '변형·상태 · 가로·정사각·세로 비율',
  parameters: storyDescription(
    'ProductCard 자체가 놓이는 레이아웃에 따라 3:2 가로형, 1:1 정사각형, 4:5 세로형을 선택합니다. 비율이 달라도 콘텐츠 패딩과 하단 스크림 깊이가 안정적으로 유지되는지 비교하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', alignItems: 'start', gap: 'var(--space-4)', maxWidth: 900 }}>
      <ProductCard
        headingLevel={2}
        id="가로형 3:2"
        ratio="3/2"
        image="./assets/products/lkr-t1.webp"
        imagePosition="50% 30%"
        imageSrcSet="./assets/products/lkr-t1.webp 1400w"
        imageSizes="(min-width: 768px) 300px, 100vw"
        description="넓은 그리드와 뉴스형 진입점에 사용하는 기본 카드입니다."
      />
      <ProductCard
        headingLevel={2}
        id="정사각형 1:1"
        ratio="1/1"
        image="./assets/products/lkr-s1.webp"
        imagePosition="50% 36%"
        description="밀도 높은 타일 그리드에서도 같은 하단 콘텐츠 규칙을 유지합니다."
      />
      <ProductCard
        headingLevel={2}
        id="세로형 4:5"
        ratio="4/5"
        image="./assets/products/lkr-visionx.webp"
        imagePosition="50% 38%"
        description="세로형 컬렉션에서는 늘어난 높이를 이미지 영역으로 사용합니다."
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const cards = Array.from(canvasElement.querySelectorAll('a'));
    const images = Array.from(canvasElement.querySelectorAll('img'));
    const expectedRatios = [1.5, 1, 0.8];
    if (cards.length !== expectedRatios.length || images.length !== expectedRatios.length) {
      throw new Error('카드 비율 정책은 가로·정사각·세로 예제를 모두 보여줘야 합니다.');
    }
    if (images[0].getAttribute('srcset') !== './assets/products/lkr-t1.webp 1400w'
      || images[0].getAttribute('sizes') !== '(min-width: 768px) 300px, 100vw') {
      throw new Error('반응형 이미지 후보와 예상 표시 폭은 내부 img에 전달되어야 합니다.');
    }
    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const actualRatio = cardRect.width / cardRect.height;
      if (Math.abs(actualRatio - expectedRatios[index]) > 0.02) {
        throw new Error('ratio prop은 카드 자체의 가로·정사각·세로 비율을 결정해야 합니다.');
      }
      const content = card.lastElementChild;
      const scrim = content?.previousElementSibling;
      const scrimRect = scrim?.getBoundingClientRect();
      if (!scrimRect || Math.abs(scrimRect.bottom - cardRect.bottom) > 2 || scrimRect.height > 241) {
        throw new Error('스크림은 카드 비율과 무관하게 하단에 고정되고 최대 240px까지만 확장되어야 합니다.');
      }
      if (getComputedStyle(content).paddingTop !== '24px') {
        throw new Error('모든 카드 비율에서 콘텐츠는 동일한 24px 패딩을 사용해야 합니다.');
      }
      const imageRect = images[index].getBoundingClientRect();
      if (Math.abs(imageRect.width - cardRect.width) > 2 || Math.abs(imageRect.height - cardRect.height) > 2) {
        throw new Error('사진은 선택한 카드 비율의 전체 프레임을 채워야 합니다.');
      }
    });
  },
};

export const ProductCardCard = { ...ProductCardCardStory, name: 'ProductCard card parity', tags: ['!dev', 'visual-parity'] };
