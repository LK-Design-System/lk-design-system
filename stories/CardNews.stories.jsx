import { NewsCard } from '../src/index.js';
import { NewsCardCard as NewsCardCardStory } from './CardsExtended.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Content/News Card',
  parameters: {
    storyGuide: {
      storyId: 'lds-product-content-news-card--news-cards',
      eyebrow: 'Product / News Card',
      title: '사용자가 공지와 소식의 출처·시점·핵심 내용을 빠르게 훑습니다',
      description:
        '기사·릴리스·공지처럼 발행 정보가 있는 콘텐츠를 요약해 다음 읽기로 연결할 때 적합합니다. 제품 기능이나 즉시 수행할 작업을 소개할 때는 NewsCard 대신 FeatureCard 또는 명시적인 액션 영역을 사용하세요.',
    },
    docs: {
      description: {
        component: '기사, 공지, 릴리스 같은 콘텐츠 요약을 보여주는 NewsCard 패턴입니다.',
      },
    },
  },
};

export default meta;

export const NewsCards = {
  name: '개요',
  parameters: storyDescription(
    '서로 다른 출처와 카테고리의 최신 소식을 나란히 제공하는 상황입니다. 제목·요약·출처·날짜의 읽기 순서가 분명하고 CTA의 목적이 예측 가능한지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)', maxWidth: 820 }}>
      <NewsCard
        category="릴리스"
        title="컴포넌트 문서 업데이트"
        excerpt="선택, 상태, 오버레이 컴포넌트 예제를 디자인 시스템 기준으로 정리했습니다."
        source="Design System"
        date="2026.02.11"
        cta="자세히"
      />
      <NewsCard
        category="R&D"
        title="비전 AI 결함 탐지 정확도 99.2%"
        excerpt="제조 라인 검사 모델을 현장 데이터로 재학습해 오탐을 줄였습니다."
        source="기술 블로그"
        date="2026.01.30"
        cta="자세히"
      />
    </main>
  ),
};

export const NewsCardCard = { ...NewsCardCardStory, name: 'NewsCard card parity', tags: ['!dev', 'visual-parity'] };
