import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import {
  FormField,
  NumberField,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Selection and Input/Number Field',
  tags: ['autodocs'],
  component: NumberField,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-selection-and-input-number-field--number-input',
      eyebrow: 'Product / Number Field',
      title: '숫자 필드는 허용 범위와 증감 단위를 함께 제어합니다',
      description:
        '수량·속도처럼 최소·최대와 일정한 step이 있는 값을 입력할 때 적합합니다. 범위가 없거나 숫자 외 형식을 함께 받는 값에는 Number Field 대신 Input을 사용하세요.',
    },
    docs: {
      description: {
        component: '증감 스텝과 범위를 가진 숫자 입력 NumberField 제품 확장 컴포넌트입니다.',
      },
    },
  },
};

export default meta;

export const NumberInput = {
  name: '개요',
  parameters: storyDescription(
    '0~20대 범위의 로봇 투입 수를 증감하는 Number Field입니다. helper의 단위·한계와 step 제어가 같은 값 계약을 설명하는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 520 }}>
      <FormField label="투입 대수" helper="한 번에 투입할 로봇 수, 최대 20대" htmlFor="robot-batch-size">
        <NumberField id="robot-batch-size" aria-label="투입 대수" defaultValue={5} min={0} max={20} />
      </FormField>
    </main>
  ),
};

function NumberFieldContractExample() {
  const [value, setValue] = React.useState(5);
  return (
    <div data-testid="number-contract" style={{ display: 'grid', gap: 'var(--space-4)', width: 'fit-content' }}>
      <NumberField
        label="투입 대수"
        helper="한 번에 투입할 로봇 수, 최대 20대"
        value={value}
        onChange={setValue}
        min={0}
        max={20}
      />
      <button type="button" hidden data-testid="reset-number-field" onClick={() => setValue(5)}>초기화</button>
    </div>
  );
}

export const NumberFieldContract = {
  name: '스핀버튼·클램프 계약',
  tags: ['!dev'],
  render: () => <NumberFieldContractExample />,
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const root = canvasElement.querySelector('[data-testid="number-contract"]');
    const input = root?.querySelector('input');
    const label = root?.querySelector('label');
    const increase = root?.querySelector('button[aria-label="투입 대수 값 증가"]');
    const decrease = root?.querySelector('button[aria-label="투입 대수 값 감소"]');
    if (!input || !label || !increase || !decrease) {
      throw new Error('NumberField must render a labelled input with both inline step actions.');
    }

    // WCAG 1.3.1 / 3.3.2: the visible label owns the input programmatically.
    if (!input.id || label.getAttribute('for') !== input.id) {
      throw new Error('The visible NumberField label must be linked to the input with htmlFor.');
    }
    // React.useId ids are not valid CSS selectors, so resolve them by id.
    const describedBy = input.getAttribute('aria-describedby');
    if (!describedBy || !doc.getElementById(describedBy)?.textContent?.includes('최대 20대')) {
      throw new Error('The helper text must be linked to the input with aria-describedby.');
    }

    // APG Spinbutton: the native control owns the role and the range.
    if (input.type !== 'number'
      || input.getAttribute('min') !== '0'
      || input.getAttribute('max') !== '20'
      || input.getAttribute('step') !== '1') {
      throw new Error('The native number input must own spinbutton semantics and expose min/max/step.');
    }
    for (const stepper of [increase, decrease]) {
      if (stepper.getAttribute('type') !== 'button' || stepper.getAttribute('tabindex') !== '-1') {
        throw new Error('Inline steppers are secondary actions: explicit type="button" and outside the Tab order.');
      }
    }

    // Editing may hold an out-of-range value; clamping happens on commit.
    await userEvent.type(input, '25');
    await waitFor(() => {
      if (!(Number(input.value) > 20)) {
        throw new Error('NumberField must not clamp on every keystroke — intermediate values belong to the user.');
      }
    });
    input.blur();
    input.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    await waitFor(() => {
      if (input.value !== '20') throw new Error('Leaving the field must clamp the value into [min, max].');
    });
    if (!increase.disabled || decrease.disabled) {
      throw new Error('At max only the decrease action may stay enabled.');
    }

    await userEvent.click(decrease);
    await waitFor(() => {
      if (input.value !== '19') throw new Error('A step action must commit a clamped value.');
    });

    // Return to the named state.
    root.querySelector('[data-testid="reset-number-field"]')?.click();
    input.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    doc.activeElement?.blur?.();
    await waitFor(() => {
      if (input.value !== '5' || increase.disabled) {
        throw new Error('The contract fixture must end on its named state.');
      }
    });
  },
};
