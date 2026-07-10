import { LineChart } from '../src/index.js';

const meta = {
  title: 'LDS Product/Data/Line Chart',
  parameters: {
    docs: {
      description: {
        component:
          '학습 곡선·지표·텔레메트리를 시간축으로 보여주는 다중 시리즈 LineChart 패턴입니다. data family의 추이형 차트로 범례와 semantic token을 조합합니다.',
      },
    },
  },
};

export default meta;

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
  name: '라인 차트',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 680 }}>
      <section style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <h3 style={{ margin: 0, fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)', color: 'var(--color-semantic-label-strong)' }}>
          학습 손실
        </h3>
        <LineChart
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
          yLabel="mAP"
          xLabel="epoch"
          yDomain={[0, 1]}
          xTicks={[1, 5, 10, 15, 20]}
          series={[{ name: 'mAP', color: 'var(--color-semantic-status-positive)', points: mapCurve }]}
          referenceLines={[{ y: 0.8, label: '목표 80%', color: 'var(--color-semantic-status-cautionary)' }]}
          formatY={(value) => `${Math.round(value * 100)}%`}
        />
      </section>
    </main>
  ),
};

export const TelemetryReference = {
  name: '텔레메트리 기준선',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-2)', width: '100%', maxWidth: 680 }}>
      <h3 style={{ margin: 0, fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)', color: 'var(--color-semantic-label-strong)' }}>
        모터 상태 추이
      </h3>
      <LineChart
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
};

export const FixedDomainAndPoints = {
  name: '포인트와 고정 도메인',
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
  name: '라인 차트 데이터 없음',
  render: () => (
    <main style={{ width: '100%', maxWidth: 520 }}>
      <LineChart
        yLabel="value"
        xLabel="time"
        series={[]}
        emptyLabel="표시할 데이터가 없습니다"
      />
    </main>
  ),
};
