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
        component: 'Step and wizard navigation patterns for linear flows.',
      },
    },
  },
};

export default meta;

export const StepsAndWizard = {
  name: 'Steps and wizard',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 760 }}>
      <Steps steps={['Draft', 'Review', 'Publish']} current={1} />
      <Wizard steps={['Draft', 'Review', 'Publish']} defaultCurrent={1} />
    </main>
  ),
};

export const StepsCard = { ...StepsCardStory, name: 'Steps card parity', tags: ['!dev', 'visual-parity'] };
