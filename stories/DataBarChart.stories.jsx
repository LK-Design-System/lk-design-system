import { BarChart } from '../src/index.js';
import { assertAccessibleChart } from './DataCharts.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

// 막대는 영 기준선에서 값에 비례해야 하고, 모두 같은 바닥선에 놓여야 한다.
// 값 라벨이나 줄바꿈된 범주 라벨이 막대 자리를 먹으면 둘 다 깨진다 — 라벨
// 공간이 100% 기준 안에 들어오면 가장 큰 막대만 눌려 단위당 높이가 어긋나고,
// 열마다 트랙을 따로 재면 라벨이 긴 열의 막대가 기준선에서 들린다.
function assertProportionalBars(canvasElement, label) {
  const bars = Array.from(canvasElement.querySelectorAll('[data-bar-value]'));
  if (!bars.length) {
    throw new Error(`${label} must render a bar per category.`);
  }

  const scales = bars.map((bar) => bar.getBoundingClientRect().height / Number(bar.getAttribute('data-bar-value')));
  const mean = scales.reduce((total, scale) => total + scale, 0) / scales.length;
  const drift = Math.max(...scales.map((scale) => Math.abs(scale - mean))) / mean;
  if (!(drift <= 0.05)) {
    throw new Error(`${label} must keep bar heights proportional to values from a zero baseline (unit height drifted ${(drift * 100).toFixed(1)}%).`);
  }

  const baselines = new Set(bars.map((bar) => Math.round(bar.getBoundingClientRect().bottom)));
  if (baselines.size !== 1) {
    throw new Error(`${label} must sit every bar on one shared baseline (found ${baselines.size}).`);
  }
}

const meta = {
  title: 'LDS Product/Data/Visualization/Bar Chart',
  tags: ['autodocs'],
  component: BarChart,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-data-visualization-bar-chart--bar-comparison',
      eyebrow: 'Product / Data / Bar Chart',
      title: '사용자가 여러 범주의 크기 차이를 빠르게 비교합니다',
      description:
        '상태·조직·제품처럼 이산 범주의 수치를 공통 기준선에서 비교할 때 적합합니다. 시간에 따른 변화나 전체 구성 비율을 보여 줄 때는 Bar Chart 대신 Line Chart 또는 Donut Chart를 사용하세요.',
    },
    docs: {
      description: {
        component: '범주별 수치를 막대로 비교하는 BarChart 패턴입니다.',
      },
    },
  },
};

export default meta;

export const BarComparison = {
  name: '개요',
  parameters: storyDescription(
    '문서 상태별 항목 수를 막대와 값으로 비교하는 상황입니다. 공통 기준선과 숫자 라벨이 범주 간 차이를 정확히 전달하고 접근 가능한 요약이 제공되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ width: 'min(440px, 100%)' }}>
      <section style={{ background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
        <BarChart
          aria-label="문서 상태별 항목 수"
          description="초안, 검토, 승인, 보류 상태의 항목 수를 비교합니다."
          height={180}
          showValue
          data={[
            { id: 'draft', label: '초안', value: 42 },
            { id: 'review', label: '검토', value: 28 },
            { id: 'approved', label: '승인', value: 18 },
            { id: 'pending', label: '보류', value: 7 },
          ]}
        />
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    assertAccessibleChart(canvasElement, '문서 상태별 항목 수');
    assertProportionalBars(canvasElement, '문서 상태별 항목 수');
  },
};

export const NarrowLongLabels = {
  name: '반응형 · 좁은 폭과 긴 라벨',
  parameters: storyDescription(
    '320px 폭에서 긴 운영 상태 라벨을 가진 범주를 비교하는 상황입니다. 라벨이 잘리지 않고 막대·값과 올바르게 대응하며 차트가 표면 밖으로 넘치지 않는지 확인하세요.',
  ),
  render: () => (
    <main data-narrow-charts style={{ display: 'grid', gap: 'var(--space-4)', width: 320, maxWidth: '100%' }}>
      <section className="narrow-chart-surface" style={{ minWidth: 0, padding: 'var(--space-4)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)' }}>
        <BarChart
          aria-label="장기 운영 단계별 건수"
          description="긴 단계 이름이 좁은 카드에서 줄바꿈되는 예시입니다."
          height={190}
          gap={8}
          data={[
            { id: 'waiting', label: '운영 승인 대기 중인 장비', accessibleLabel: '승인 대기 장비', value: 14 },
            { id: 'inspection', label: '원격 정밀 점검이 필요한 장비', accessibleLabel: '정밀 점검 필요 장비', value: 9 },
            { id: 'ready', label: '현장 복귀 준비가 완료된 장비', accessibleLabel: '복귀 준비 완료 장비', value: 18 },
          ]}
        />
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-narrow-charts]');
    if (!root || Math.round(root.getBoundingClientRect().width) > 320) {
      throw new Error('Narrow chart story must remain within the 320px target width.');
    }
    const chart = assertAccessibleChart(canvasElement, '장기 운영 단계별 건수');
    if (chart.getBoundingClientRect().width > root.getBoundingClientRect().width + 1) {
      throw new Error('장기 운영 단계별 건수 must not overflow the narrow chart column.');
    }
    const labels = root.querySelectorAll('[data-chart-label]');
    if (!labels.length || Array.from(labels).some((label) => getComputedStyle(label).whiteSpace === 'nowrap')) {
      throw new Error('Long chart labels must wrap instead of forcing horizontal overflow.');
    }
    // 줄바꿈된 라벨이 막대의 기준선이나 축척을 흔들지 않는지도 같이 본다.
    assertProportionalBars(canvasElement, '장기 운영 단계별 건수');
  },
};

export const EmptyDataset = {
  name: '변형·상태 · 빈 범주 데이터',
  parameters: storyDescription(
    '비교할 범주 데이터가 아직 없는 상황입니다. 빈 상태가 0 값과 구분되고 차트의 목적을 유지하는 설명이 제공되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ width: 'min(440px, 100%)' }}>
      <section style={{ minHeight: 190, padding: 'var(--space-4)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)' }}>
        <BarChart aria-label="빈 막대 차트" description="검색 조건에 맞는 항목이 없습니다." data={[]} height={150} emptyLabel="표시할 범주가 없습니다" />
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const chart = assertAccessibleChart(canvasElement, '빈 막대 차트');
    if (!chart.querySelector('[data-chart-empty]')) {
      throw new Error('빈 막대 차트 must expose a visible empty state.');
    }
  },
};
