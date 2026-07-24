import { ListingCard } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Content/Listing Card',
  component: ListingCard,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-content-listing-card--listing-cards',
      eyebrow: 'Product / Listing Card',
      title: '사용자가 목록에서 항목의 기간·분류·상태를 훑고 하나를 선택합니다',
      description:
        '이벤트·강좌·모집·리소스처럼 커버·기간·상태가 반복되는 항목을 그리드로 훑을 때 적합합니다. 발행일·출처를 쓰는 기사·보도 카드가 필요하면 그 카드를, 즉시 수행할 단일 액션에는 카드 대신 명시적 액션 영역을 사용하세요.',
    },
    docs: {
      description: {
        component:
          '커버·제목·아이콘 메타 행·수명주기 상태 배지로 목록 항목을 표시하는 ListingCard 패턴입니다. 발행일·출처를 쓰는 기사·보도 카드와 의미가 다릅니다.',
      },
    },
  },
};

export default meta;

const cover = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180">
    <rect width="320" height="180" fill="#1f6feb"/>
    <circle cx="232" cy="66" r="40" fill="#4c8dff"/>
    <rect x="24" y="128" width="150" height="12" rx="6" fill="#ffffff" opacity="0.9"/>
  </svg>
`)}`;

export const ListingCards = {
  name: '개요',
  parameters: storyDescription(
    '진행 중인 항목과 마감된 항목을 같은 그리드에서 비교하는 상황입니다. 커버·제목·기간·분류의 읽기 순서가 유지되고, 상태 배지(진행중·신청 마감)가 링크 접근 이름에도 합성되어 열림/닫힘을 클릭 전에 알 수 있는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)', maxWidth: 820 }}>
      <ListingCard
        image={cover}
        title="글로벌 인재 채용 프로모션"
        meta={[
          { icon: 'calendar', label: '2026.06.08 ~ 2026.07.31 · 온라인' },
          { icon: 'tag', label: '이벤트, HR, 취업/이직' },
        ]}
        status="진행중"
        statusTone="positive"
        href="/events/global-hire"
      />
      <ListingCard
        image={cover}
        title="2026 하반기 HR 프렌즈 모집"
        meta={[
          { icon: 'calendar', label: '2026.07.01 ~ 2026.12.31' },
          { icon: 'location', label: '서울 송파구' },
          { icon: 'tag', label: '이벤트, HR, 직무역량' },
        ]}
        status="신청 마감"
        statusTone="neutral"
        href="/events/hr-friends"
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const cards = [...canvasElement.querySelectorAll('a')];
    if (cards.length !== 2) throw new Error('각 ListingCard는 하나의 링크로 렌더되어야 합니다.');

    for (const card of cards) {
      if (card.querySelector('a, button, input, select, textarea, [tabindex]')) {
        throw new Error('카드 전체가 링크이므로 안에 또 다른 포커스 가능한 요소를 두면 안 됩니다(중첩 인터랙티브 금지).');
      }
      const heading = card.querySelector('h3');
      if (!heading) throw new Error('제목은 실제 heading(기본 h3)으로 렌더되어야 합니다(WCAG 1.3.1).');
      const img = card.querySelector('img');
      if (!img || img.getAttribute('loading') !== 'lazy' || img.getAttribute('decoding') !== 'async') {
        throw new Error('커버 이미지는 loading="lazy"·decoding="async"로 지연 로드되어야 합니다.');
      }
    }

    // 상태가 링크 접근 이름에 합성되어 열림/닫힘을 이름만으로 알 수 있다.
    const [open, closed] = cards;
    if (open.getAttribute('aria-label') !== '글로벌 인재 채용 프로모션. 진행중') {
      throw new Error('문자열 status는 링크 접근 이름 끝에 "제목. 상태"로 합성되어야 합니다.');
    }
    if (closed.getAttribute('aria-label') !== '2026 하반기 HR 프렌즈 모집. 신청 마감') {
      throw new Error('마감 상태도 접근 이름에 합성되어 클릭 전에 낭독되어야 합니다.');
    }

    open.focus();
    if (canvasElement.ownerDocument.activeElement !== open) {
      throw new Error('항목 카드 링크는 키보드 포커스를 받아야 합니다.');
    }
    open.blur();
  },
};

export const NoCover = {
  name: '변형·상태 · 커버 없는 항목',
  parameters: storyDescription(
    '커버 이미지가 없는 항목(리소스·문서 목록)을 배치하는 상황입니다. 이미지 영역이 생략돼도 제목·메타·상태의 위계가 유지되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)', maxWidth: 560 }}>
      <ListingCard
        title="원티드 워커스 폰트 다운로드"
        meta={[
          { icon: 'calendar', label: '2026.06.26 ~ 2026.07.26' },
          { icon: 'tag', label: '트렌드, 무료' },
        ]}
        status="진행중"
        statusTone="positive"
        href="/resources/font"
      />
      <ListingCard
        title="2026 원티드 연봉 리포트"
        meta={[{ icon: 'tag', label: '취업/이직, 이력서/면접' }]}
        status="상시"
        statusTone="neutral"
        href="/resources/salary-report"
      />
    </main>
  ),
};

export const NarrowListing = {
  name: '반응형 · 320px',
  parameters: storyDescription(
    '320px 폭에서 항목 카드가 컨테이너를 넘치지 않는지 확인하는 상황입니다. 긴 제목이 2줄로 접히고 메타 행이 말줄임되며 상태 배지가 유지되는지 확인하세요.',
  ),
  render: () => (
    <main data-testid="listing-narrow" style={{ width: 320, maxWidth: '100%' }}>
      <ListingCard
        image={cover}
        title="2026 AX 교육 전문가 대규모 모집 중입니다 (5~6월 모집 중)"
        meta={[
          { icon: 'calendar', label: '2026.03.03 ~ 2026.12.31 · 온라인' },
          { icon: 'tag', label: '교육, 데이터 엔지니어, 웹 개발자' },
        ]}
        status="진행중"
        statusTone="positive"
        href="/events/ax"
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const wrapper = canvasElement.querySelector('[data-testid="listing-narrow"]');
    if (!wrapper || wrapper.scrollWidth > wrapper.clientWidth + 1) {
      throw new Error('ListingCard는 320px 컨테이너에서 가로 스크롤을 만들지 않아야 합니다.');
    }
  },
};

// Hidden visual-parity contract (not in the sidebar): the listing card's cover,
// title, meta rows, and lifecycle badge rendered as a fixed frame for the visual
// inventory, alongside NewsCard/ProductCard parity.
export const ListingCardCard = {
  name: 'ListingCard card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 700, height: 460, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <ListingCard
          image={cover}
          title="글로벌 인재 채용 프로모션"
          meta={[
            { icon: 'calendar', label: '2026.06.08 ~ 2026.07.31 · 온라인' },
            { icon: 'tag', label: '이벤트, HR, 취업/이직' },
          ]}
          status="진행중"
          statusTone="positive"
          href="#"
        />
        <ListingCard
          image={cover}
          title="2026 하반기 HR 프렌즈 모집"
          meta={[
            { icon: 'calendar', label: '2026.07.01 ~ 2026.12.31' },
            { icon: 'tag', label: '이벤트, HR, 직무역량' },
          ]}
          status="신청 마감"
          statusTone="neutral"
          href="#"
        />
      </div>
    </div>
  ),
};
