import { ThemeToggle } from '../src/index.js';
import { ThemeToggleCard as ThemeToggleCardStory } from './SelectionStatus.shared.jsx';

const meta = {
  title: 'LDS Theme/Theme/Theme Toggle',
  parameters: {
    docs: {
      description: {
        component: '라이트, 다크 같은 시각 테마를 전환하는 ThemeToggle 패턴입니다.',
      },
    },
  },
};

export default meta;

export const ThemeTogglePattern = {
  name: '테마 토글',
  render: () => (
    <main style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
      <ThemeToggle target={null} persist={false} defaultValue="light" />
      <ThemeToggle target={null} persist={false} defaultValue="dark" showLabels={false} size="sm" />
    </main>
  ),
};

export const ThemeToggleCard = { ...ThemeToggleCardStory, name: 'ThemeToggle card parity', tags: ['!dev', 'visual-parity'] };

