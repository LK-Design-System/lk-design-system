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
        dateTime="2026-02-11"
        cta="자세히"
      />
      <NewsCard
        category="R&D"
        title="비전 AI 결함 탐지 정확도 99.2%"
        excerpt="제조 라인 검사 모델을 현장 데이터로 재학습해 오탐을 줄였습니다."
        source="기술 블로그"
        date="2026.01.30"
        dateTime="2026-01-30"
        cta="자세히"
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const cards = Array.from(canvasElement.querySelectorAll('a'));
    if (cards.length !== 2) throw new Error('각 NewsCard는 하나의 링크로 렌더되어야 합니다.');
    for (const card of cards) {
      if (card.querySelector('a, button, input, select, textarea, [tabindex]')) {
        throw new Error('카드 전체가 링크이므로 안에 또 다른 포커스 가능한 요소를 두면 안 됩니다(중첩 인터랙티브 금지).');
      }
      const heading = card.querySelector('h3');
      if (!heading) throw new Error('헤드라인은 실제 heading(기본 h3)으로 렌더되어야 합니다(WCAG 1.3.1).');
      const label = card.getAttribute('aria-label');
      if (label !== heading.textContent.trim()) {
        throw new Error('링크의 접근 가능한 이름은 카드 전문이 아니라 헤드라인이어야 합니다.');
      }
      if (!card.querySelector('time[datetime]')) {
        throw new Error('dateTime을 주면 날짜가 기계 판독 가능한 time 엘리먼트로 렌더되어야 합니다.');
      }
    }
    cards[0].focus();
    if (canvasElement.ownerDocument.activeElement !== cards[0]) {
      throw new Error('카드 링크는 키보드 포커스를 받아야 합니다.');
    }
    cards[0].blur();
  },
};

export const NewsCardCard = { ...NewsCardCardStory, name: 'NewsCard card parity', tags: ['!dev', 'visual-parity'] };
