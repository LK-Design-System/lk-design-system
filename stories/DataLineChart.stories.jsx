import { LineChart } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Data/Visualization/Line Chart',
  parameters: {
    storyGuide: {
      storyId: 'lds-product-data-visualization-line-chart--line-charts',
      eyebrow: 'Product / Data / Line Chart',
      title: '사용자가 시간이나 연속 구간에 따른 변화와 기준 이탈을 추적합니다',
      description:
        '학습 곡선·텔레메트리·성과 지표처럼 순서가 있는 값의 추세와 여러 series를 비교할 때 적합합니다. 이산 범주의 크기나 전체 구성 비율에는 Line Chart 대신 Bar Chart 또는 Donut Chart를 사용하세요.',
    },
    docs: {
      description: {
        component:
          '학습 곡선·지표·텔레메트리를 시간축으로 보여주는 다중 시리즈 LineChart 패턴입니다. data family의 추이형 차트로 범례와 semantic token을 조합합니다.',
      },
    },
  },
};

export default meta;

function lineSummary(canvasElement, label) {
  const chart = canvasElement.querySelector(`svg[role="img"][aria-label="${label}"]`);
  if (!chart) throw new Error(`${label} must expose a named image role.`);
  const ids = chart.getAttribute('aria-describedby')?.split(/\s+/).filter(Boolean) || [];
  const nodes = ids.map((id) => canvasElement.ownerDocument.getElementById(id));
  if (!nodes.length || nodes.some((node) => !node?.textContent?.trim())) {
    throw new Error(`${label} must reference non-empty description and summary text.`);
  }
  const summary = nodes.find((node) => node?.hasAttribute('data-chart-summary'));
  if (!summary) throw new Error(`${label} must reference a deterministic data summary.`);
  return { chart, summary: summary.textContent.trim() };
}

const epochs = Array.from({ length: 20 }, (_, index) => index + 1);
const train = epochs.map((epoch) => ({ x: epoch, y: 0.9 * Math.exp(-epoch / 6) + 0.06 }));
const val = epochs.map((epoch) => ({
  x: epoch,
  y: 0.9 * Math.exp(-epoch / 7) + 0.11 + (epoch % 3 === 0 ? 0.03 : 0),
}));
const mapCurve = epochs.map((epoch) => ({
  x: epoch,
  y: Math.min(0.92, 0.2 + 0.72 * (1 - Math.exp(-epoch / 5))),
}));
const temperature = Array.from({ length: 12 }, (_, index) => ({
  x: index * 10,
  y: 36 + Math.sin(index / 1.4) * 4 + index * 0.55,
}));
const currentDraw = Array.from({ length: 12 }, (_, index) => ({
  x: index * 10,
  y: 18 + Math.cos(index / 1.7) * 2.4 + index * 0.18,
}));
const sparse = [
  { x: 0, y: 12 },
  { x: 5, y: 18 },
  { x: 12, y: 15 },
  { x: 20, y: 23 },
  { x: 28, y: 19 },
  { x: 36, y: 27 },
];

export const LineCharts = {
  name: '개요',
  parameters: storyDescription(
    '학습 epoch에 따른 train·validation 손실과 성능 향상을 여러 series로 비교하는 상황입니다. 축·범례·요약이 series 차이를 설명하고 선만으로도 추세를 따라갈 수 있는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 680 }}>
      <section style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <h3 style={{ margin: 0, fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)', color: 'var(--color-semantic-label-strong)' }}>
          학습 손실
        </h3>
        <LineChart
          aria-label="학습 손실 추이"
          yLabel="loss"
          xLabel="epoch"
          xTicks={[1, 5, 10, 15, 20]}
          series={[
            { name: 'train', points: train },
            { name: 'val', dashed: true, points: val },
          ]}
          description="train과 validation loss를 epoch 기준으로 비교합니다."
        />
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <h3 style={{ margin: 0, fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)', color: 'var(--color-semantic-label-strong)' }}>
          mAP@0.5
        </h3>
        <LineChart
          aria-label="mAP 목표 추이"
          yLabel="mAP"
          xLabel="epoch"
          yDomain={[0, 1]}
          xTicks={[1, 5, 10, 15, 20]}
          series={[{ name: 'mAP', color: 'var(--color-semantic-status-positive)', points: mapCurve }]}
          referenceLines={[{ y: 0.8, label: '목표 80%', color: 'var(--color-semantic-status-cautionary)' }]}
          formatY={(value) => `${Math.round(value * 100)}%`}
          summary="mAP은 20 epoch 동안 상승하며 마지막 값은 목표 80%를 넘습니다."
        />
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const automatic = lineSummary(canvasElement, '학습 손실 추이').summary;
    if (!automatic.includes('train: 20개 점') || !automatic.includes('val: 20개 점') || !automatic.includes('시작') || !automatic.includes('마지막')) {
      throw new Error('LineChart must generate a deterministic summary for every populated series.');
    }
    const overridden = lineSummary(canvasElement, 'mAP 목표 추이').summary;
    if (overridden !== 'mAP은 20 epoch 동안 상승하며 마지막 값은 목표 80%를 넘습니다.') {
      throw new Error('The explicit LineChart summary must replace the automatic summary.');
    }
  },
};

export const TelemetryReference = {
  name: '시나리오 · 원격 측정 기준선',
  parameters: storyDescription(
    '시간에 따른 온도와 전류를 기준선과 함께 모니터링하는 상황입니다. 단위와 기준값이 분명하고 series가 기준을 넘는 시점을 접근 가능한 요약에서도 확인할 수 있는지 보세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-2)', width: '100%', maxWidth: 680 }}>
      <h3 style={{ margin: 0, fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)', color: 'var(--color-semantic-label-strong)' }}>
        모터 상태 추이
      </h3>
      <LineChart
        aria-label="모터 상태 추이"
        yLabel="value"
        xLabel="sec"
        xTicks={[0, 30, 60, 90, 110]}
        yDomain={[0, 50]}
        showPoints
        referenceLines={[
          { y: 42, label: '주의', color: 'var(--color-semantic-status-cautionary)' },
          { y: 46, label: '위험', color: 'var(--color-semantic-status-negative)' },
        ]}
        series={[
          { name: 'temperature', color: 'var(--color-semantic-status-cautionary)', points: temperature },
          { name: 'current', color: 'var(--color-semantic-primary-normal)', dashed: true, points: currentDraw },
        ]}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const { chart, summary } = lineSummary(canvasElement, '모터 상태 추이');
    if (!summary.includes('temperature: 12개 점') || !summary.includes('current: 12개 점')) {
      throw new Error('A multi-series telemetry chart must summarize each populated series.');
    }
    /* 기준선은 role="img" SVG 안 텍스트로만 존재하므로, 텍스트 대안이 임계값과
       그 선을 넘긴 시리즈까지 말하지 않으면 AT 사용자는 이탈을 알 수 없다. */
    if (chart.querySelectorAll('line[stroke-dasharray]').length < 2) {
      throw new Error('The telemetry fixture must draw both reference lines.');
    }
    if (!summary.includes('기준선 2개.')) {
      throw new Error('Reference lines must be part of the accessible summary, not only of the drawing.');
    }
    if (!summary.includes('주의 42: temperature 초과.') || !summary.includes('위험 46: temperature 초과.')) {
      throw new Error('The summary must name each threshold and which series crossed it.');
    }
    if (summary.includes('current 초과')) {
      throw new Error('A series that stays under every threshold must not be reported as crossing one.');
    }
  },
};

export const FixedDomainAndPoints = {
  name: '시나리오 · 데이터 점과 고정 범위',
  parameters: storyDescription(
    '불규칙한 x 간격의 관측값을 고정된 축 범위와 point marker로 보여 주는 상황입니다. 실제 간격이 보존되고 작은 데이터셋에서도 포인트와 값의 맥락이 읽히는지 확인하세요.',
  ),
  render: () => (
    <main style={{ width: '100%', maxWidth: 520 }}>
      <LineChart
        yLabel="score"
        xLabel="step"
        height={220}
        xDomain={[0, 40]}
        yDomain={[0, 32]}
        xTicks={[0, 10, 20, 30, 40]}
        showPoints
        showLegend={false}
        series={[{ name: 'score', points: sparse }]}
      />
    </main>
  ),
};

export const Empty = {
  name: '변형·상태 · 데이터 없음',
  parameters: storyDescription(
    '표시할 시계열 데이터가 아직 없는 상황입니다. 빈 차트가 0 값 추세로 오해되지 않고 데이터 부재를 명확히 설명하는지 확인하세요.',
  ),
  render: () => (
    <main style={{ width: '100%', maxWidth: 520 }}>
      <LineChart
        aria-label="빈 라인 차트"
        yLabel="value"
        xLabel="time"
        series={[]}
        emptyLabel="표시할 데이터가 없습니다"
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const { chart, summary } = lineSummary(canvasElement, '빈 라인 차트');
    if (!chart.querySelector('[data-chart-empty]') || summary !== '표시할 데이터가 없습니다') {
      throw new Error('An empty LineChart must expose the visible empty label as its text summary.');
    }
  },
};
