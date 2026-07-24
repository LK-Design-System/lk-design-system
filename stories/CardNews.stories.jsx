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

/* 정보 전달용 예시에 실제 이미지가 필요해 인라인 SVG data URI를 씁니다
   (외부 자산 의존 없이 커버 처리를 보여주기 위함). */
const coverSrc = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180">
    <rect width="320" height="180" fill="#1f6feb"/>
    <circle cx="232" cy="52" r="34" fill="#4c8dff"/>
    <rect x="24" y="118" width="180" height="14" rx="7" fill="#ffffff" opacity="0.9"/>
    <rect x="24" y="142" width="120" height="12" rx="6" fill="#ffffff" opacity="0.6"/>
  </svg>
`)}`;

export const CoverImage = {
  name: '사용법 · 커버 이미지',
  parameters: storyDescription(
    '커버 사진이 있는 소식을 목록에 배치하는 상황입니다. 사진이 장식일 때(헤드라인이 내용을 대신함)와 사진 자체가 정보를 담을 때(imageAlt로 접근 이름에 합성)를 구분하고, 목록에서 이미지가 지연 로드되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)', maxWidth: 820 }}>
      <NewsCard
        image={coverSrc}
        category="현장"
        title="대덕 물류센터 자동화 라인 가동"
        excerpt="여덟 대의 AMR이 피킹부터 적재까지 담당하는 무인 라인을 공개했습니다."
        source="보도자료"
        date="2026.07.14"
        dateTime="2026-07-14"
        cta="자세히"
        href="/news/line"
      />
      <NewsCard
        image={coverSrc}
        imageAlt="검사 로봇이 컨베이어 라인을 점검하는 모습"
        category="R&D"
        title="비전 검사 정확도 리포트"
        excerpt="현장 데이터로 재학습한 결함 탐지 모델의 검증 결과를 정리했습니다."
        source="기술 블로그"
        date="2026.07.02"
        dateTime="2026-07-02"
        href="/news/vision"
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const cards = Array.from(canvasElement.querySelectorAll('a'));
    if (cards.length !== 2) throw new Error('각 NewsCard는 하나의 링크로 렌더되어야 합니다.');

    const [decorative, informative] = cards;
    const decorativeImg = decorative.querySelector('img');
    const informativeImg = informative.querySelector('img');
    if (!decorativeImg || !informativeImg) {
      throw new Error('image를 주면 커버 이미지가 렌더되어야 합니다.');
    }

    for (const img of [decorativeImg, informativeImg]) {
      if (img.getAttribute('loading') !== 'lazy' || img.getAttribute('decoding') !== 'async') {
        throw new Error('커버 이미지는 목록 비용을 낮추도록 loading="lazy"·decoding="async"로 렌더되어야 합니다.');
      }
    }

    // 장식 커버: alt는 비어 있고, 링크 이름은 헤드라인뿐이다.
    if (decorativeImg.getAttribute('alt') !== '') {
      throw new Error('imageAlt를 주지 않은 커버는 장식(alt="")이어야 합니다.');
    }
    const decorativeHeading = decorative.querySelector('h3');
    if (decorative.getAttribute('aria-label') !== decorativeHeading.textContent.trim()) {
      throw new Error('장식 커버 카드의 접근 이름은 헤드라인이어야 합니다.');
    }

    // 정보성 커버: imageAlt가 링크 접근 이름에 합성되어 낭독된다.
    const informativeHeading = informative.querySelector('h3');
    const expected = `${informativeHeading.textContent.trim()}. 검사 로봇이 컨베이어 라인을 점검하는 모습`;
    if (informative.getAttribute('aria-label') !== expected) {
      throw new Error('정보성 imageAlt는 링크 접근 이름에 "헤드라인. imageAlt"로 합성되어야 합니다.');
    }
    if (informativeImg.getAttribute('alt') !== '검사 로봇이 컨베이어 라인을 점검하는 모습') {
      throw new Error('정보성 커버의 img는 imageAlt를 그대로 갖습니다.');
    }

    // 카드 = 링크: 중첩 인터랙티브 금지.
    for (const card of cards) {
      if (card.querySelector('a, button, input, select, textarea, [tabindex]')) {
        throw new Error('카드 전체가 링크이므로 안에 또 다른 포커스 가능한 요소를 두면 안 됩니다.');
      }
    }
  },
};

export const NewsCardCard = { ...NewsCardCardStory, name: 'NewsCard card parity', tags: ['!dev', 'visual-parity'] };
