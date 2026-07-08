import {
  Steps,
  Wizard,
} from '../src/index.js';
import { StepsCard as StepsCardStory } from './NavigationFull.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Navigation/Steps and Wizard',
  parameters: {
    docs: {
      description: {
        component: '선형 흐름을 위한 Steps, Wizard 내비게이션 패턴입니다.',
      },
    },
  },
};

export default meta;

export const StepsAndWizard = {
  name: 'Steps and wizard',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 760 }}>
      <Steps steps={['작성', '검토', '게시']} current={1} />
      <Wizard steps={['작성', '검토', '게시']} defaultCurrent={1} />
    </main>
  ),
};

export const StepsCard = { ...StepsCardStory, name: 'Steps card parity', tags: ['!dev', 'visual-parity'] };
