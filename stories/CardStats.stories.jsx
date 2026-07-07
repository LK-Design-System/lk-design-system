import {
  Card,
  Stat,
} from '../src/index.js';
import { StatCard as StatCardStory } from './CardsExtended.shared.jsx';

const meta = {
  title: 'LK Product Extension/Data/Stats',
  parameters: {
    docs: {
      description: {
        component: '핵심 숫자와 라벨을 빠르게 스캔하게 해주는 Stat 패턴입니다.',
      },
    },
  },
};

export default meta;

export const Stats = {
  name: '통계',
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', maxWidth: 620 }}>
      <Card elevation="sm" padding={22}>
        <Stat value="24" label="컴포넌트" accent="signal" />
      </Card>
      <Card elevation="sm" padding={22}>
        <Stat value="99.7%" label="검증 완료율" stacked />
      </Card>
    </main>
  ),
};

export const StatCard = { ...StatCardStory, name: 'Stat card parity', tags: ['!dev', 'visual-parity'] };
