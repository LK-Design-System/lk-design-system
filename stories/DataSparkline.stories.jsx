import { Sparkline } from '../src/index.js';
import { assertAccessibleChart } from './DataCharts.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Data/Visualization/Sparkline',
  tags: ['autodocs'],
  component: Sparkline,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-data-visualization-sparkline--trend-line',
      eyebrow: 'Product / Data / Sparkline',
      title: '사용자가 작은 공간에서 최근 값의 방향과 변동을 빠르게 훑습니다',
      description:
        '카드나 표 셀 안에서 짧은 시계열의 상승·하락·변동만 보조적으로 보여 줄 때 적합합니다. 축·기준선·정확한 값 비교가 중요하면 Sparkline 대신 전체 Line Chart를 사용하세요.',
    },
    docs: {
      description: {
        component: '짧은 시계열 추세를 한 줄로 보여주는 Sparkline 패턴입니다.',
      },
    },
  },
};

export default meta;

export const TrendLine = {
  name: '개요',
  parameters: storyDescription(
    '최근 일일 처리량의 방향을 작은 선 그래프로 보조하는 상황입니다. 시각 추세와 접근 가능한 설명이 같은 기간을 가리키고 라벨이 그래프의 목적을 알려 주는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap', maxWidth: 480 }}>
      <Sparkline
        aria-label="일일 처리량 추세"
        description="최근 8일의 일일 처리량입니다."
        data={[8, 12, 9, 16, 15, 22, 18, 28]}
        width={220}
        height={64}
      />
      <span style={{ color: 'var(--color-semantic-label-neutral)' }}>일일 처리량 추세</span>
    </main>
  ),
  play: async ({ canvasElement }) => {
    assertAccessibleChart(canvasElement, '일일 처리량 추세');
  },
};

export const NarrowParent = {
  name: '반응형 · 좁은 카드',
  parameters: storyDescription(
    '320px 카드 안에서 Sparkline이 부모 폭에 맞춰 축소되는 상황입니다. 선과 설명이 잘리지 않고 차트가 컨테이너 밖으로 넘치지 않는지 확인하세요.',
  ),
  render: () => (
    <main data-narrow-charts style={{ display: 'grid', gap: 'var(--space-4)', width: 320, maxWidth: '100%' }}>
      <Sparkline
        aria-label="좁은 카드의 처리량 추세"
        description="좁은 부모 안에서 비례 축소되는 추세입니다."
        data={[12, 18, 15, 24, 21, 31, 29]}
        width={288}
        height={56}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-narrow-charts]');
    if (!root || Math.round(root.getBoundingClientRect().width) > 320) {
      throw new Error('Narrow chart story must remain within the 320px target width.');
    }
    const chart = assertAccessibleChart(canvasElement, '좁은 카드의 처리량 추세');
    if (chart.getBoundingClientRect().width > root.getBoundingClientRect().width + 1) {
      throw new Error('좁은 카드의 처리량 추세 must not overflow the narrow chart column.');
    }
  },
};

export const EmptyDataset = {
  name: '변형·상태 · 빈 추세 데이터',
  parameters: storyDescription(
    '추세를 계산할 데이터 포인트가 없는 상황입니다. 빈 선이나 잘못된 방향을 그리지 않고 데이터 부재가 명확히 전달되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ width: 'min(440px, 100%)' }}>
      <section style={{ minHeight: 100, padding: 'var(--space-4)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)' }}>
        <Sparkline aria-label="빈 추세 차트" description="아직 시계열 표본이 없습니다." data={[]} width={220} height={56} emptyLabel="추세 데이터 없음" />
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const chart = assertAccessibleChart(canvasElement, '빈 추세 차트');
    if (!chart.querySelector('[data-chart-empty]')) {
      throw new Error('빈 추세 차트 must expose a visible empty state.');
    }
  },
};
