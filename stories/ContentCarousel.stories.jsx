import {
  Carousel,
  ContentBadge,
  Thumbnail,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Data/Display/Carousel',
  parameters: {
    storyGuide: {
      storyId: 'lds-product-data-display-carousel--carousel-slides',
      eyebrow: 'Product / Data / Carousel',
      title: '사용자가 여러 미디어의 순서와 상태를 한 흐름에서 비교합니다',
      description:
        '제품 이미지나 작업 장면처럼 같은 맥락의 미디어를 차례로 살펴볼 때 적합합니다. 모든 항목을 동시에 비교해야 하거나 각 항목에 복잡한 조작이 필요하면 Carousel 대신 Grid 또는 List를 사용하세요.',
    },
    docs: {
      description: {
        component: '여러 장의 미디어를 가로로 넘겨보는 Carousel 패턴입니다.',
      },
    },
  },
};

export default meta;

export const CarouselSlides = {
  name: '개요',
  parameters: storyDescription(
    '상태 배지가 붙은 여러 미디어를 한 장씩 넘겨 보는 상황입니다. 슬라이드 순서와 현재 위치가 이해되고 각 미디어의 상태가 이미지와 함께 읽히는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 560 }}>
      <Carousel
        slides={[
          <Thumbnail key="live" ratio="16/9" radius={false} overlay={<ContentBadge color="accent">LIVE</ContentBadge>} overlayAlign="top-right" />,
          <Thumbnail key="ready" ratio="16/9" radius={false} overlay={<ContentBadge tone="positive">준비됨</ContentBadge>} overlayAlign="top-right" />,
          <Thumbnail key="review" ratio="16/9" radius={false} overlay={<ContentBadge variant="outlined">검토 중</ContentBadge>} overlayAlign="top-right" />,
        ]}
      />
    </main>
  ),
};
