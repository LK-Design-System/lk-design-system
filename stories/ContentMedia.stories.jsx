import {
  Thumbnail,
} from '../src/index.js';
import { ThumbnailCard as ThumbnailCardStory } from './Content.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Content/Media Patterns',
  tags: ['autodocs'],
  id: 'lds-core-components-content-media',
  component: Thumbnail,
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

const mediaLabelStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  width: 'fit-content',
  padding: 'var(--space-1) var(--space-2)',
  borderRadius: 'var(--radius-sm)',
  background: 'var(--color-semantic-background-elevated-normal)',
  color: 'var(--color-semantic-label-normal)',
  fontSize: 'var(--caption1-size)',
  lineHeight: 'var(--caption1-line)',
  fontWeight: 700,
};

/* 정보 전달용 예시에 실제 이미지가 필요해 인라인 SVG data URI를 씁니다
   (외부 자산 의존 없이 alt 사용법을 보여주기 위함). */
const floorPlanSrc = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180">
    <rect width="320" height="180" fill="#e8eef4"/>
    <rect x="18" y="18" width="130" height="64" rx="6" fill="#ffffff" stroke="#9fb3c4" stroke-width="2"/>
    <rect x="18" y="98" width="130" height="64" rx="6" fill="#ffffff" stroke="#9fb3c4" stroke-width="2"/>
    <rect x="170" y="18" width="132" height="144" rx="6" fill="#ffffff" stroke="#9fb3c4" stroke-width="2"/>
    <path d="M148 50 H170" stroke="#1769aa" stroke-width="5"/>
    <path d="M148 130 H170" stroke="#1769aa" stroke-width="5"/>
    <circle cx="236" cy="90" r="12" fill="#1769aa"/>
  </svg>
`)}`;

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
            <span style={mediaLabelStyle}>{ratio}</span>
          </div>
        ))}
      </section>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <Thumbnail ratio="16/9" overlay={<span style={mediaLabelStyle}>LIVE</span>} overlayAlign="top-right" />
        <Thumbnail ratio="4/3" border overlay={<span style={mediaLabelStyle}>준비됨</span>} overlayAlign="bottom-right" />
        <Thumbnail ratio="4/5" radius={false} border overlay={<span style={mediaLabelStyle}>NO RADIUS</span>} overlayAlign="bottom-left" />
      </section>
    </main>
  ),
};

export const MediaAltText = {
  name: '사용법 · 정보 전달 이미지와 장식 이미지',
  parameters: storyDescription(
    '같은 이미지를 정보 전달용으로 쓸 때와 장식용으로 쓸 때의 alt 처리를 나란히 비교하는 상황입니다. 주변 텍스트에 없는 정보를 담은 이미지에는 alt를 쓰고, 제목이 이미 같은 내용을 말하는 대표 이미지는 alt=""로 두어 중복 낭독을 막는지 확인하세요. 오버레이가 있는 실제 이미지에는 대비 보장을 위한 스크림이 자동으로 깔립니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 'var(--space-5)', maxWidth: 820 }}>
      <figure style={{ margin: 0, display: 'grid', gap: 'var(--space-2)' }}>
        <Thumbnail
          data-testid="informative"
          src={floorPlanSrc}
          alt="3층 창고 평면도 — 좌측 두 구역과 우측 대형 구역이 통로 두 곳으로 연결되고, 충전 스테이션이 우측 중앙에 있습니다"
          ratio="16/9"
        />
        <figcaption style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--label2-size)', wordBreak: 'keep-all' }}>
          <strong style={{ color: 'var(--color-semantic-label-normal)' }}>정보 전달 이미지</strong> — 평면도의 내용은 본문 어디에도 없으므로 alt에 무엇이 보이는지 서술합니다.
        </figcaption>
      </figure>

      <figure style={{ margin: 0, display: 'grid', gap: 'var(--space-2)' }}>
        <Thumbnail
          data-testid="decorative"
          src={floorPlanSrc}
          alt=""
          ratio="16/9"
          overlay={<span style={mediaLabelStyle}>점검 필요</span>}
          overlayAlign="bottom-left"
        />
        <figcaption style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--label2-size)', wordBreak: 'keep-all' }}>
          <strong style={{ color: 'var(--color-semantic-label-normal)' }}>장식 이미지</strong> — 아래 캡션과 배지가 같은 정보를 전달하므로 alt=&quot;&quot;로 두고, 오버레이 뒤에는 스크림이 깔립니다.
        </figcaption>
      </figure>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const informative = canvasElement.querySelector('[data-testid="informative"] img');
    const decorative = canvasElement.querySelector('[data-testid="decorative"] img');
    if (!informative || !decorative) throw new Error('alt 예시에는 실제 이미지가 필요합니다.');
    if (!informative.getAttribute('alt')) {
      throw new Error('정보 전달 이미지는 비어 있지 않은 alt를 가져야 합니다.');
    }
    if (decorative.getAttribute('alt') !== '') {
      throw new Error('장식 이미지는 alt=""로 접근성 트리에서 빠져야 합니다.');
    }
    const view = canvasElement.ownerDocument.defaultView;
    const scrim = canvasElement.querySelector('[data-testid="decorative"] span[aria-hidden="true"]');
    if (!scrim || !view.getComputedStyle(scrim).backgroundImage.includes('gradient')) {
      throw new Error('실제 이미지 위 오버레이에는 대비 보장을 위한 스크림이 깔려야 합니다.');
    }
    if (canvasElement.querySelector('[data-testid="informative"] span[aria-hidden="true"]')) {
      throw new Error('오버레이가 없는 썸네일에는 스크림을 넣지 않습니다.');
    }
  },
};

export const ThumbnailCard = { ...ThumbnailCardStory, name: 'Thumbnail card parity', tags: ['!dev', 'visual-parity'] };
