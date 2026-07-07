import {
  ContentBadge,
  Thumbnail,
} from '../src/index.js';
import { ThumbnailCard as ThumbnailCardStory } from './Content.shared.jsx';

const meta = {
  title: 'LDS Core/3 Component/4 Content/Media',
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
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 820 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 'var(--space-3)', alignItems: 'end' }}>
        {['1/1', '5/4', '4/3', '3/2', '16/10', '1.618/1', '16/9', '21/9', '4/5', '3/4', '2/3', '9/16', '1/2'].map((ratio) => (
          <div key={ratio} style={{ display: 'grid', gap: 'var(--space-2)' }}>
            <Thumbnail ratio={ratio} />
            <ContentBadge size="xsmall">{ratio}</ContentBadge>
          </div>
        ))}
      </section>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <Thumbnail ratio="16/9" overlay={<ContentBadge color="accent">LIVE</ContentBadge>} overlayAlign="top-right" />
        <Thumbnail ratio="4/3" border overlay={<ContentBadge tone="positive">READY</ContentBadge>} overlayAlign="bottom-right" />
        <Thumbnail ratio="4/5" radius={false} border overlay={<ContentBadge variant="outlined">NO RADIUS</ContentBadge>} overlayAlign="bottom-left" />
      </section>
    </main>
  ),
};

export const ThumbnailCard = { ...ThumbnailCardStory, name: 'Thumbnail card parity', tags: ['!dev', 'visual-parity'] };
