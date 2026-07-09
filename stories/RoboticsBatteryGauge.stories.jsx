import { BatteryGauge } from '../src/index.js';

const meta = {
  title: 'LDS Robotics/Robotics/Battery Gauge',
  parameters: {
    docs: {
      description: {
        component: '배터리 잔량을 셸 + 레벨색 fill + % 표기로 보여주는 BatteryGauge 패턴입니다. 색은 잔량을 따릅니다: ≤20% red · ≤50% amber · else green.',
      },
    },
  },
};

export default meta;

export const BatteryLevels = {
  name: '배터리 잔량',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 480 }}>
      <section style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap', alignItems: 'center' }}>
        <BatteryGauge value={86} />
        <BatteryGauge value={47} />
        <BatteryGauge value={12} />
      </section>
      <section style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap', alignItems: 'center' }}>
        <BatteryGauge value={86} size="sm" />
        <BatteryGauge value={47} size="sm" />
        <BatteryGauge value={12} size="sm" showLabel={false} />
      </section>
    </main>
  ),
};
