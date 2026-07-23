import { userEvent, waitFor } from 'storybook/test';
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
      <Stepper label="도입 대수" defaultValue={3} min={0} max={10} />
      <Stepper label="예비 부품" defaultValue={0} min={0} max={5} />
    </main>
  ),
};

export const StepperAccessibilityContract = {
  name: '경계와 키보드 계약',
  tags: ['!dev'],
  parameters: storyDescription(
    '개요 스토리가 주장하는 경계 동작(감소·증가가 막힘)과 spinbutton 키보드 계약을 실제로 검증합니다. 경계에 도달해도 버튼이 포커스를 잃지 않아야 합니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 420 }}>
      <Stepper data-contract="stepper" label="도입 대수" defaultValue={0} min={0} max={2} valueText={(v) => `${v}대`} />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[data-contract="stepper"]');
    if (!group || group.getAttribute('role') !== 'group' || group.getAttribute('aria-label') !== '도입 대수') {
      throw new Error('Stepper must expose a labelled group.');
    }
    const spin = group.querySelector('[role="spinbutton"]');
    const [decrease, increase] = group.querySelectorAll('button');
    if (!spin || !decrease || !increase) throw new Error('Stepper must expose a spinbutton and two step buttons.');

    // Contextual Korean button names, linked to what they adjust.
    if (decrease.getAttribute('aria-label') !== '도입 대수 감소' || increase.getAttribute('aria-label') !== '도입 대수 증가') {
      throw new Error('Step buttons must carry contextual Korean names.');
    }
    if (spin.getAttribute('aria-valuenow') !== '0'
      || spin.getAttribute('aria-valuemin') !== '0'
      || spin.getAttribute('aria-valuemax') !== '2'
      || spin.getAttribute('aria-valuetext') !== '0대') {
      throw new Error('The spinbutton must expose its current value and range.');
    }

    // At the lower bound the decrease button stays focusable (aria-disabled),
    // so keyboard focus is never dropped to <body>.
    if (decrease.getAttribute('aria-disabled') !== 'true' || decrease.disabled) {
      throw new Error('A Stepper at its minimum must use aria-disabled, not native disabled.');
    }
    decrease.focus();
    if (canvasElement.ownerDocument.activeElement !== decrease) {
      throw new Error('A bounded step button must remain focusable.');
    }
    await userEvent.click(decrease);
    if (spin.getAttribute('aria-valuenow') !== '0' || canvasElement.ownerDocument.activeElement === canvasElement.ownerDocument.body) {
      throw new Error('Activating a bounded step button must be a no-op that keeps focus.');
    }

    // Pointer activation steps exactly once (pointerdown steps, the trailing
    // click is swallowed).
    await userEvent.click(increase);
    await waitFor(() => {
      if (spin.getAttribute('aria-valuenow') !== '1') throw new Error('One click must step exactly once.');
    });

    // APG spinbutton keyboard contract.
    spin.focus();
    await userEvent.keyboard('{ArrowUp}');
    if (spin.getAttribute('aria-valuenow') !== '2') throw new Error('ArrowUp must increase by one step.');
    await userEvent.keyboard('{ArrowUp}');
    if (spin.getAttribute('aria-valuenow') !== '2') throw new Error('ArrowUp must clamp at max.');
    if (increase.getAttribute('aria-disabled') !== 'true' || increase.disabled) {
      throw new Error('A Stepper at its maximum must use aria-disabled, not native disabled.');
    }
    await userEvent.keyboard('{Home}');
    if (spin.getAttribute('aria-valuenow') !== '0') throw new Error('Home must jump to min.');
    await userEvent.keyboard('{PageUp}');
    if (spin.getAttribute('aria-valuenow') !== '2') throw new Error('PageUp must jump by the large step and clamp at max.');
    await userEvent.keyboard('{PageDown}');
    if (spin.getAttribute('aria-valuenow') !== '0') throw new Error('PageDown must jump back and clamp at min.');
    await userEvent.keyboard('{End}');
    if (spin.getAttribute('aria-valuenow') !== '2') throw new Error('End must jump to max.');
    await userEvent.keyboard('{ArrowDown}');
    if (spin.getAttribute('aria-valuenow') !== '1') throw new Error('ArrowDown must decrease by one step.');
    if (canvasElement.ownerDocument.activeElement !== spin) {
      throw new Error('Keyboard stepping must keep focus on the spinbutton.');
    }
  },
};

export const StepperCard = { ...StepperCardStory, name: 'Stepper card parity', tags: ['!dev', 'visual-parity'] };
