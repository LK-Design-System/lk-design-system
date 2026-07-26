import { userEvent } from 'storybook/test';
import { Radio, RadioGroup } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Selection and Input/Radio',
  tags: ['autodocs'],
  component: Radio,
  subcomponents: { RadioGroup },
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-selection-and-input-radio--radios',
      eyebrow: 'Core / Radio',
      title: '사용자가 서로 배타적인 옵션을 모두 보고 하나만 선택합니다',
      description:
        '비교해야 할 선택지가 적고 반드시 하나만 고르는 폼에 적합합니다. 여러 항목을 함께 선택하거나 옵션이 많아 공간을 줄여야 할 때는 Radio 대신 Checkbox 또는 Select를 사용하세요.',
    },
    docs: {
      description: {
        component: 'Radio와 Radio Group은 서로 배타적인 단일 선택, 공유 name, 상태와 focus 상호작용 계약을 함께 소유합니다.',
      },
    },
  },
};

export default meta;

export const Radios = {
  name: '개요',
  parameters: storyDescription(
    '사용자가 변경 내용을 즉시 적용할지 예약할지 한 가지 처리 방식을 선택하는 상황입니다. 모든 옵션과 설명이 동시에 보이고 한 항목만 선택되며 radiogroup 의미가 전달되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 620 }}>
      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 style={{ margin: 0, fontSize: 'var(--body1-size)', color: 'var(--color-semantic-label-strong)' }}>처리 방식</h2>
        <RadioGroup
          aria-label="처리 방식"
          defaultValue="now"
          name="apply-mode"
          options={[
            { value: 'now', label: '즉시 적용', description: '현재 선택한 항목에 바로 반영' },
            { value: 'schedule', label: '예약 적용', description: '지정 시간에 자동 반영' },
          ]}
        />
      </section>
      <Radio label="대표 항목" name="single-radio" value="primary" checked onChange={() => {}} />
    </main>
  ),
};

export const RadioStateContract = {
  name: 'Radio 상태 계약',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-3)', maxWidth: 360 }}>
      <Radio label="unchecked" name="radio-state" value="off" state="unchecked" />
      <Radio label="checked" name="radio-state" value="on" state="checked" />
      <Radio label="disabled" name="radio-disabled" value="disabled" state="checked" disabled />
      <Radio label="small tight" name="radio-tight" value="tight" state="checked" size="small" tight />
    </main>
  ),
};

export const RadioInteractionContract = {
  name: 'Radio 상호작용 계약',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-3)', maxWidth: 360 }}>
      <Radio label="normal" name="radio-interaction" value="normal" />
      <Radio label="hovered" name="radio-interaction" value="hovered" interaction="hovered" />
      <Radio label="focused" name="radio-interaction" value="focused" interaction="focused" />
      <Radio
        label="custom typography"
        name="radio-interaction"
        value="custom"
        checked
        onChange={() => {}}
        labelStyle={{ fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-primary-normal)' }}
      />
    </main>
  ),
};

export const RadioUncontrolledGroupContract = {
  name: '비제어 그룹 동기화',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-3)' }}>
      <Radio label="첫 번째" name="uncontrolled-radio-contract" value="first" defaultChecked />
      <Radio label="두 번째" name="uncontrolled-radio-contract" value="second" />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const radios = [...canvasElement.querySelectorAll('input[type="radio"][name="uncontrolled-radio-contract"]')];
    if (radios.length !== 2 || !radios[0].checked) throw new Error('The first uncontrolled radio must start selected.');
    await userEvent.click(radios[1]);
    if (radios[0].checked || !radios[1].checked) throw new Error('Native group selection must move to the second radio.');
    const firstIndicator = radios[0].nextElementSibling;
    const secondIndicator = radios[1].nextElementSibling;
    if (firstIndicator?.firstElementChild || !secondIndicator?.firstElementChild) {
      throw new Error('The custom indicators must stay synchronized with native radio selection.');
    }
  },
};
