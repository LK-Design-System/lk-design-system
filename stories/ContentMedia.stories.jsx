import {
  ContentBadge,
  Thumbnail,
} from '../src/index.js';
import { ThumbnailCard as ThumbnailCardStory } from './Content.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Content/Media Patterns',
  id: 'lds-core-components-content-media',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-content-media--media-thumbnails',
      eyebrow: 'Core / Content / Media Patterns',
      title: '이미지와 영상의 비율을 예측 가능한 프레임으로 유지합니다',
      description:
        '카드, 갤러리, 미리보기에서 원본 크기가 다른 미디어를 일정한 비율로 정렬할 때 적합합니다. 인물 정체성은 Avatar를, 장식용 배경은 일반 이미지나 CSS 배경을 사용하고 중요한 상태를 오버레이에만 의존하지 마세요.',
    },
    docs: {
      description: {
        component: '이미지와 영상 썸네일을 일정한 비율로 보여주는 Thumbnail 패턴입니다.',
      },
    },
  },
};

export default meta;

export const MediaThumbnails = {
  name: '개요',
  parameters: storyDescription(
    '가로·세로 비율이 다른 미디어와 상태 오버레이를 콘텐츠 목록에 배치하는 상황입니다. 각 비율에서 크롭과 테두리·모서리가 안정적이고 오버레이가 핵심 피사체와 대체 텍스트를 방해하지 않는지 확인하세요.',
  ),
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
        <Thumbnail ratio="4/3" border overlay={<ContentBadge tone="positive">준비됨</ContentBadge>} overlayAlign="bottom-right" />
        <Thumbnail ratio="4/5" radius={false} border overlay={<ContentBadge variant="outlined">NO RADIUS</ContentBadge>} overlayAlign="bottom-left" />
      </section>
    </main>
  ),
};

export const ThumbnailCard = { ...ThumbnailCardStory, name: 'Thumbnail card parity', tags: ['!dev', 'visual-parity'] };
