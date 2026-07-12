import { Stepper } from '../src/index.js';
import { StepperCard as StepperCardStory } from './SelectionStatus.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Selection and Input/Stepper',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-selection-and-input-stepper--stepper-control',
      eyebrow: 'Core / Stepper',
      title: '사용자가 제한된 작은 정수 값을 한 단계씩 조절합니다',
      description:
        '수량이나 반복 횟수처럼 범위가 짧고 증감 단위가 분명할 때 적합합니다. 임의 숫자를 빠르게 입력해야 하면 Number Field를, 넓은 연속 범위를 탐색하면 Slider를 사용하세요.',
    },
    docs: {
      description: {
        component: '작은 숫자 조절에 쓰는 Stepper 패턴입니다.',
      },
    },
  },
};

export default meta;

export const StepperControl = {
  name: '개요',
  parameters: storyDescription(
    '서로 다른 최소·최대 범위를 가진 Stepper를 조절하는 상황입니다. 경계에서 감소·증가 동작이 막히고 현재 값이 두 버튼 사이에서 안정적으로 읽히는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 420 }}>
      <Stepper defaultValue={3} min={0} max={10} />
      <Stepper defaultValue={0} min={0} max={5} />
    </main>
  ),
};

export const StepperCard = { ...StepperCardStory, name: 'Stepper card parity', tags: ['!dev', 'visual-parity'] };
