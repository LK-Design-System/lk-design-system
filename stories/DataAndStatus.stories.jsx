import {
  Button,
  Icon,
  Link,
  MetricCard,
} from '../src/index.js';
import { StatCard as StatCardStory } from './CardsExtended.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const metricGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 'var(--space-4)',
  width: 'min(960px, 100%)',
};

const meta = {
  title: 'LDS Product/Data/Display/Metric Card',
  parameters: {
    storyGuide: {
      storyId: 'lds-product-data-display-metric-card--metrics',
      eyebrow: 'Product / Data / Metric Card',
      title: '사용자가 핵심 수치와 변화의 의미를 한눈에 판단합니다',
      description:
        '대시보드에서 소수의 KPI와 기준 기간·변화·갱신 시점을 빠르게 비교할 때 적합합니다. 상세 행 데이터나 여러 속성의 정밀 비교에는 Metric Card 대신 Table 또는 Chart를 사용하세요.',
    },
    docs: {
      description: {
        component: '대시보드와 현황판에서 핵심 KPI를 같은 카드 구조로 보여주는 지표 패턴입니다. Stat primitive의 시각 회귀 검증은 이 페이지의 숨김 parity story로 유지합니다.',
      },
    },
  },
};

export default meta;

export const Metrics = {
  name: '개요',
  parameters: storyDescription(
    '여러 KPI를 같은 카드 구조로 비교하는 대시보드 상황입니다. 값·단위·변화·기준 기간·갱신 시점의 위계가 일관되고 0 변화가 중립으로 읽히는지 확인하세요.',
  ),
  render: () => (
    <main style={metricGridStyle}>
      <MetricCard
        label="컴포넌트"
        value="156"
        unit="개"
        delta={4.3}
        period="이번 릴리스"
        baseline="직전 릴리스"
        caption="공개 export 기준"
        lastUpdated="2분 전"
        action={<Link href="#component-detail">상세 보기</Link>}
        icon={<Icon name="layers" size={22} />}
      />
      <MetricCard
        label="공개 스토리"
        value="103"
        delta={0}
        period="현재"
        baseline="어제"
        caption="Storybook 사이드바 기준"
        lastUpdated="방금"
        icon={<Icon name="document" size={22} />}
      />
      <MetricCard
        label="검증 통과율"
        value="99.7"
        unit="%"
        delta={1.8}
        period="최근 24시간"
        baseline="지난 24시간"
        caption="최근 check:storybook"
        lastUpdated="5분 전"
        icon={<Icon name="circle-check" size={22} />}
      />
      <MetricCard
        label="대기 항목"
        value="14"
        unit="건"
        delta={-2}
        period="현재"
        baseline="어제"
        caption="패리티 점검 대기열"
        lastUpdated="10분 전"
        icon={<Icon name="triangle-exclamation" size={22} />}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const cards = canvasElement.querySelectorAll('[data-metric-state="ready"]');
    if (cards.length !== 4) throw new Error('The normal metrics story must render four ready metric cards.');
    for (const card of cards) {
      const labelledBy = card.getAttribute('aria-labelledby');
      if (card.getAttribute('role') !== 'group' || !labelledBy || !canvasElement.ownerDocument.getElementById(labelledBy)) {
        throw new Error('Every MetricCard must be a named group linked to its visible label.');
      }
    }
    const unchanged = cards[1].querySelector('[data-change-direction="flat"][data-change-tone="neutral"]');
    if (!unchanged || unchanged.textContent?.trim() !== '0%' || unchanged.querySelector('svg')) {
      throw new Error('An automatic numeric zero delta must be flat, neutral, and arrow-free.');
    }
  },
};

export const NarrowSemanticReversal = {
  name: '반응형 · 좁은 폭과 변화 의미 반전',
  parameters: storyDescription(
    '값이 감소할수록 좋은 응답 시간 지표를 300px 카드에 보여 주는 상황입니다. 방향과 의미 tone이 분리되고 긴 라벨과 보조 정보가 잘림 없이 감싸지는지 확인하세요.',
  ),
  render: () => (
    <main style={{ width: 300, maxWidth: '100%' }}>
      <MetricCard
        data-testid="semantic-reversal"
        label="긴급 작업 요청의 평균 승인 대기 시간"
        value="41"
        unit="ms"
        delta={-12.4}
        changeDirection="down"
        changeTone="positive"
        period="최근 1시간"
        baseline="지난 7일 평균 47ms"
        caption="값이 내려갈수록 운영 응답성이 개선됩니다."
        lastUpdated="2분 전"
        action={<Link href="#latency-detail">응답 시간 상세</Link>}
        icon={<Icon name="clock" size={22} />}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[data-testid="semantic-reversal"]');
    const change = card?.querySelector('[data-change-direction="down"][data-change-tone="positive"]');
    if (!card || !change || !change.textContent?.includes('개선')) {
      throw new Error('A decreasing-but-good metric must separate down direction from positive semantic tone.');
    }
    const labelledBy = card.getAttribute('aria-labelledby');
    const label = labelledBy ? canvasElement.ownerDocument.getElementById(labelledBy) : null;
    if (!label || getComputedStyle(label).overflowWrap !== 'anywhere' || card.getBoundingClientRect().width > 300.5) {
      throw new Error('The long metric label must remain named and wrap inside the 300px card.');
    }
  },
};

export const ResourceStates = {
  name: '변형·상태 · 갱신 시점과 오래된 데이터',
  parameters: storyDescription(
    '지표를 불러오거나 데이터가 비어 있거나 실패·지연된 상황을 함께 비교합니다. loading·empty·error·stale가 서로 다른 의미와 복구 단서를 제공하는지 확인하세요.',
  ),
  render: () => (
    <main style={metricGridStyle}>
      <MetricCard label="처리량" loading loadingLabel="처리량 지표를 불러오는 중" />
      <MetricCard label="실패 작업" empty emptyLabel="집계할 실패 작업이 없습니다." />
      <MetricCard
        label="가동률"
        error="가동률 지표를 불러오지 못했습니다."
        action={<Button size="sm" variant="ghost">다시 시도</Button>}
      />
      <MetricCard
        label="평균 배터리"
        value="68"
        unit="%"
        period="최근 15분"
        stale
        staleLabel="업데이트 지연"
        lastUpdated="18분 전"
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const loading = canvasElement.querySelector('[data-metric-state="loading"]');
    const error = canvasElement.querySelector('[data-metric-resource-state="error"]');
    const empty = canvasElement.querySelector('[data-metric-resource-state="empty"]');
    const stale = canvasElement.querySelector('[data-metric-state="stale"]');
    if (loading?.getAttribute('aria-busy') !== 'true' || !loading.querySelector('[role="status"]')) {
      throw new Error('Loading MetricCard must expose aria-busy and a named polite status.');
    }
    if (error?.getAttribute('role') !== 'alert' || empty?.getAttribute('role') !== 'status') {
      throw new Error('MetricCard error and empty states must use distinct alert/status semantics.');
    }
    if (!stale?.textContent?.includes('업데이트 지연') || !stale.querySelector('[data-metric-last-updated]')) {
      throw new Error('Stale MetricCard must expose a non-color status label and last-updated text.');
    }
  },
};

export const StatCard = { ...StatCardStory, name: 'Stat card parity', tags: ['!dev', 'visual-parity'] };
