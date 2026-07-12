import { DonutChart } from '../src/index.js';
import { assertAccessibleChart } from './DataCharts.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Data/Visualization/Donut Chart',
  component: DonutChart,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-data-visualization-donut-chart--composition-ratio',
      eyebrow: 'Product / Data / Donut Chart',
      title: '사용자가 전체 안에서 각 범주가 차지하는 비율을 파악합니다',
      description:
        '합계가 의미 있는 소수 범주의 구성 비율과 중심 요약값을 보여 줄 때 적합합니다. 정확한 값 비교나 범주가 많을 때는 Donut Chart 대신 Bar Chart 또는 Table을 사용하세요.',
    },
    docs: {
      description: {
        component: '구성 비율을 링과 범례로 보여주는 DonutChart 패턴입니다.',
      },
    },
  },
};

export default meta;

export const CompositionRatio = {
  name: '개요',
  parameters: storyDescription(
    '정상·검토·중지 상태가 전체에서 차지하는 비율을 링과 범례로 보여 주는 상황입니다. 중심 요약과 각 segment의 라벨·값이 색 없이도 이해되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ width: 'min(440px, 100%)' }}>
      <section style={{ background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
        <DonutChart
          aria-label="운영 상태 비율"
          description="정상, 검토, 중지 상태의 구성 비율입니다."
          centerLabel="95%"
          segments={[
            { id: 'healthy', label: '정상', value: 72, color: 'var(--color-semantic-status-positive)' },
            { id: 'review', label: '검토', value: 18, color: 'var(--color-semantic-status-cautionary)' },
            { id: 'stopped', label: '중지', value: 5, color: 'var(--color-semantic-status-negative)' },
          ]}
        />
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    assertAccessibleChart(canvasElement, '운영 상태 비율');
  },
};

export const NarrowLongLegend = {
  name: '반응형 · 좁은 폭과 긴 범례',
  parameters: storyDescription(
    '320px 폭에서 긴 운영 상태 범례가 링 아래로 감싸지는 상황입니다. 범례가 잘리지 않고 segment와의 대응 및 접근 가능한 요약이 유지되는지 확인하세요.',
  ),
  render: () => (
    <main data-narrow-charts style={{ display: 'grid', gap: 'var(--space-4)', width: 320, maxWidth: '100%' }}>
      <section className="narrow-chart-surface" style={{ minWidth: 0, padding: 'var(--space-4)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)' }}>
        <DonutChart
          aria-label="장비 운영 상태의 긴 범례"
          description="긴 범례가 링 아래로 감싸지는 좁은 폭 예시입니다."
          size={112}
          thickness={15}
          segments={[
            { id: 'normal', label: '자동 주행을 정상 수행 중', accessibleLabel: '정상 자동 주행', value: 61 },
            { id: 'review', label: '운영자 확인과 재승인이 필요', accessibleLabel: '운영자 재승인 필요', value: 24 },
            { id: 'offline', label: '연결이 끊겨 원격 확인 불가', accessibleLabel: '연결 끊김', value: 15 },
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
    const chart = assertAccessibleChart(canvasElement, '장비 운영 상태의 긴 범례');
    if (chart.getBoundingClientRect().width > root.getBoundingClientRect().width + 1) {
      throw new Error('장비 운영 상태의 긴 범례 must not overflow the narrow chart column.');
    }
    const labels = root.querySelectorAll('[data-chart-label]');
    if (!labels.length || Array.from(labels).some((label) => getComputedStyle(label).whiteSpace === 'nowrap')) {
      throw new Error('Long chart labels must wrap instead of forcing horizontal overflow.');
    }
  },
};

export const ZeroSum = {
  name: '시나리오 · 합계가 0인 데이터',
  parameters: storyDescription(
    '모든 segment 값의 합계가 0인 상황입니다. 빈 링이 유효한 비율처럼 보이지 않고 데이터가 없다는 의미가 텍스트로 전달되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ width: 'min(440px, 100%)' }}>
      <section style={{ minHeight: 190, padding: 'var(--space-4)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)' }}>
        <DonutChart
          aria-label="0 합계 도넛 차트"
          description="등록된 상태는 있지만 현재 집계값은 모두 0입니다."
          segments={[
            { id: 'healthy', label: '정상', value: 0 },
            { id: 'warning', label: '주의', value: 0 },
          ]}
          size={116}
        />
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const zeroDonut = assertAccessibleChart(canvasElement, '0 합계 도넛 차트');
    const center = zeroDonut.querySelector('[data-chart-center-value]');
    const summary = zeroDonut.querySelector('[data-chart-summary]')?.textContent || '';
    if (center?.textContent?.trim() !== '0' || summary.includes('합계 1') || !summary.includes('합계 0')) {
      throw new Error('A zero-sum donut must expose the real total 0 and never invent total 1.');
    }
    if (zeroDonut.querySelectorAll('[data-donut-segment]').length !== 0) {
      throw new Error('A zero-sum donut must keep the neutral track without drawing false colored arcs.');
    }
  },
};
