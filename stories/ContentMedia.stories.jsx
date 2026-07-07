import {
  ContentBadge,
  Thumbnail,
} from '../src/index.js';
import { ThumbnailCard as ThumbnailCardStory } from './Content.shared.jsx';

const meta = {
  title: 'WDS Core/3 Component/4 Content/Media',
  parameters: {
    docs: {
      description: {
        component: '이미지와 영상 썸네일을 일정한 비율로 보여주는 Thumbnail 패턴입니다.',
      },
    },
  },
};

export default meta;

export const MediaThumbnails = {
  name: '미디어 썸네일',
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', maxWidth: 760 }}>
      <Thumbnail ratio={16 / 9} overlay={<ContentBadge tone="navy">LIVE</ContentBadge>} overlayAlign="top-right" />
      <Thumbnail ratio={4 / 3} overlay={<ContentBadge tone="positive">READY</ContentBadge>} overlayAlign="bottom-right" />
    </main>
  ),
};

export const ThumbnailCard = { ...ThumbnailCardStory, name: 'Thumbnail card parity', tags: ['!dev', 'visual-parity'] };
