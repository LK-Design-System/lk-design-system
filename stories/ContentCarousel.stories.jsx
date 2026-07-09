import {
  Carousel,
  ContentBadge,
  Thumbnail,
} from '../src/index.js';

const meta = {
  title: 'LDS Core/Components/Content/Carousel',
  parameters: {
    docs: {
      description: {
        component: '여러 장의 미디어를 가로로 넘겨보는 Carousel 패턴입니다.',
      },
    },
  },
};

export default meta;

export const CarouselSlides = {
  name: '캐러셀',
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
