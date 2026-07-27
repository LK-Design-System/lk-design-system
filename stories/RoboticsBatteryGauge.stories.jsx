import { BatteryGauge } from '../src/index.js';

const meta = {
  title: 'LDS Product/Status/Battery Gauge',
  tags: ['autodocs'],
  component: BatteryGauge,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-status-battery-gauge--battery-levels',
      eyebrow: 'Product / Battery Gauge',
      title: '배터리 게이지는 잔량을 색과 숫자로 함께 알립니다',
      description:
        '배터리를 사용하는 장비의 잔량을 한눈에 판단할 때 적합합니다. 색은 잔량 구간을 보조하지만 % 숫자를 항상 함께 보여 주며, 시간에 따른 전력 추이에는 차트를 사용하세요.',
    },
    docs: {
      description: {
        component: '배터리 잔량을 셸 + 레벨색 fill + % 표기로 보여주는 Product 패턴입니다. 제품이 tone을 소유하고, 생략 시에만 기존 잔량 임계값을 호환 동작으로 사용합니다.',
      },
    },
  },
};

export default meta;

export const BatteryLevels = {
  name: '개요',
  parameters: {
    docs: {
      description: {
        story:
          '정상·주의·위험 구간과 sm 크기, 라벨 숨김을 봅니다. 저잔량이 색과 숫자로 동시에 읽히는지, 작은 크기에서도 값이 판독되는지 확인하세요.',
      },
    },
  },
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 720 }}>
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
      <section aria-label="제품이 결정한 상태" style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap', alignItems: 'center' }}>
        <BatteryGauge value={47} tone="positive" />
        <BatteryGauge value={47} tone="cautionary" />
        <BatteryGauge value={47} tone="negative" />
      </section>
    </main>
  ),
};
