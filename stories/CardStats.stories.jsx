import { StatCard as StatCardStory } from './CardsExtended.shared.jsx';

const meta = {
  title: 'LDS Product/Data/Dashboard Metrics',
  parameters: {
    docs: {
      description: {
        component: 'Stat primitive의 시각 회귀 검증은 Dashboard Metrics 하위의 숨김 parity story로 유지합니다.',
      },
    },
  },
};

export default meta;

export const StatCard = { ...StatCardStory, name: 'Stat card parity', tags: ['!dev', 'visual-parity'] };
