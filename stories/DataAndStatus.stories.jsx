import { Icon, MetricCard } from '../src/index.js';

const metricGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 'var(--space-4)',
  width: 'min(960px, 100%)',
};

const meta = {
  title: 'LDS Product/Data/Dashboard Metrics',
  parameters: {
    docs: {
      description: {
        component: '대시보드와 현황판에서 핵심 KPI를 같은 카드 구조로 보여주는 지표 패턴입니다.',
      },
    },
  },
};

export default meta;

export const Metrics = {
  name: '지표',
  render: () => (
    <main style={metricGridStyle}>
      <MetricCard
        label="컴포넌트"
        value="156"
        delta={4.3}
        caption="공개 export 기준"
        icon={<Icon name="layers" size={22} />}
      />
      <MetricCard
        label="공개 스토리"
        value="102"
        delta="stable"
        deltaTone="flat"
        caption="Storybook sidebar"
        icon={<Icon name="document" size={22} />}
      />
      <MetricCard
        label="검증 통과율"
        value="99.7%"
        delta={1.8}
        caption="최근 check:storybook"
        icon={<Icon name="circle-check" size={22} />}
      />
      <MetricCard
        label="대기 항목"
        value="14"
        delta={-2}
        caption="parity audit queue"
        icon={<Icon name="triangle-exclamation" size={22} />}
      />
    </main>
  ),
};
