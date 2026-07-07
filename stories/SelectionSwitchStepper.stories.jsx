import {
  Stepper,
  Switch,
} from '../src/index.js';
import {
  StepperCard as StepperCardStory,
  SwitchCard as SwitchCardStory,
} from './SelectionStatus.shared.jsx';

const meta = {
  title: 'WDS Core/3 Component/3 Selection and Input/Switch and Stepper',
  parameters: {
    docs: {
      description: {
        component: '이진 설정과 작은 숫자 조절에 쓰는 Switch, Stepper 패턴입니다.',
      },
    },
  },
};

export default meta;

export const SwitchAndStepper = {
  name: '스위치와 스테퍼',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 420 }}>
      <Switch label="원격 제어 허용" defaultChecked />
      <Stepper defaultValue={3} min={0} max={10} />
    </main>
  ),
};

export const SwitchCard = { ...SwitchCardStory, name: 'Switch card parity', tags: ['!dev', 'visual-parity'] };
export const StepperCard = { ...StepperCardStory, name: 'Stepper card parity', tags: ['!dev', 'visual-parity'] };

