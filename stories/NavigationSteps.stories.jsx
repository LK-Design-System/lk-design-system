import {
  Steps,
  Wizard,
} from '../src/index.js';
import { StepsCard as StepsCardStory } from './NavigationFull.shared.jsx';

const meta = {
  title: 'WDS Core/3 Component/6 Navigation/Steps and Wizard',
  parameters: {
    docs: {
      description: {
        component: '선형 절차와 단계 진행을 안내하는 Steps, Wizard 패턴입니다.',
      },
    },
  },
};

export default meta;

export const StepsAndWizard = {
  name: '스텝과 위저드',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 760 }}>
      <Steps steps={['작성', '검토', '게시']} current={1} />
      <Wizard steps={['작성', '검토', '게시']} defaultCurrent={1} />
    </main>
  ),
};

export const StepsCard = { ...StepsCardStory, name: 'Steps card parity', tags: ['!dev', 'visual-parity'] };
