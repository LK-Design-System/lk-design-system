import { Stepper } from '../src/index.js';
import { StepperCard as StepperCardStory } from './SelectionStatus.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Selection and Input/Stepper',
  parameters: {
    docs: {
      description: {
        component: '작은 숫자 조절에 쓰는 Stepper 패턴입니다.',
      },
    },
  },
};

export default meta;

export const StepperControl = {
  name: '스테퍼',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 420 }}>
      <Stepper defaultValue={3} min={0} max={10} />
      <Stepper defaultValue={0} min={0} max={5} />
    </main>
  ),
};

export const StepperCard = { ...StepperCardStory, name: 'Stepper card parity', tags: ['!dev', 'visual-parity'] };
