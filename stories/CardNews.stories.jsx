import { NewsCard } from '../src/index.js';
import { NewsCardCard as NewsCardCardStory } from './CardsExtended.shared.jsx';

const meta = {
  title: 'LDS Core/3 Component/4 Content/News Card',
  parameters: {
    docs: {
      description: {
        component: '기사, 공지, 릴리스 같은 콘텐츠 요약을 보여주는 NewsCard 패턴입니다.',
      },
    },
  },
};

export default meta;

export const NewsCards = {
  name: '뉴스 카드',
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
