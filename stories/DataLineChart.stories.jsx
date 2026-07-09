import { LineChart } from '../src/index.js';

const meta = {
  title: 'LDS Product/Data/Line Chart',
  parameters: {
    docs: {
      description: {
        component: '학습 곡선·지표·텔레메트리를 시간축으로 보여주는 다중 시리즈 LineChart 패턴입니다. data 패밀리의 라인 보완재입니다.',
      },
    },
  },
};

export default meta;

const epochs = Array.from({ length: 20 }, (_, i) => i + 1);
const train = epochs.map((e) => ({ x: e, y: 0.9 * Math.exp(-e / 6) + 0.06 }));
const val = epochs.map((e) => ({ x: e, y: 0.9 * Math.exp(-e / 7) + 0.11 + (e % 3 === 0 ? 0.03 : 0) }));
const mapCurve = epochs.map((e) => ({ x: e, y: Math.min(0.92, 0.2 + 0.72 * (1 - Math.exp(-e / 5))) }));

export const LineCharts = {
  name: '라인 차트',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 620 }}>
      <section style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <h3 style={{ margin: 0, fontSize: 14, color: 'var(--color-semantic-label-strong)' }}>학습 손실 (train vs val)</h3>
        <LineChart
          yLabel="loss"
          xLabel="epoch"
          series={[
            { name: 'train', points: train },
            { name: 'val', dashed: true, points: val },
          ]}
        />
      </section>
      <section style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <h3 style={{ margin: 0, fontSize: 14, color: 'var(--color-semantic-label-strong)' }}>mAP@0.5</h3>
        <LineChart yLabel="mAP" xLabel="epoch" series={[{ name: 'mAP', color: 'var(--color-semantic-status-positive)', points: mapCurve }]} formatY={(v) => `${Math.round(v * 100)}%`} />
      </section>
    </main>
  ),
};
