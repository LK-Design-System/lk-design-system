import React from 'react';
import { userEvent } from 'storybook/test';
import { ChoiceCard, Icon } from '../src/index.js';
import { ChoiceCardCard as ChoiceCardCardStory } from './SelectionStatus.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Selection and Input/Card Selection',
  tags: ['autodocs'],
  component: ChoiceCard,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-selection-and-input-card-selection--choice-cards',
      eyebrow: 'Core / Card Selection',
      title: '카드 선택은 설명이 필요한 후보를 하나의 비교 단위로 보여 줍니다',
      description:
        '제목, 설명, 아이콘을 함께 읽어야 올바른 결정을 할 수 있는 플랜·구성 선택에 적합합니다. 짧은 라벨만으로 비교할 수 있다면 이 카드 대신 Radio나 Checkbox가 더 간결합니다.',
    },
  },
};

export default meta;

export const ChoiceCards = {
  name: '개요',
  parameters: storyDescription(
    '단일 선택은 radio 그룹으로 항상 하나의 값을 유지하고, 다중 선택은 checkbox로 각 카드를 독립적으로 켜고 끌 수 있습니다.',
  ),
  render: function Example() {
    const [plan, setPlan] = React.useState('standard');
    const [extras, setExtras] = React.useState(['audit']);
    const toggleExtra = (value, selected) => {
      setExtras((current) => selected
        ? [...new Set([...current, value])]
        : current.filter((item) => item !== value));
    };
    return (
      <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 760 }}>
        <section aria-labelledby="plan-choice-label" style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <h2 id="plan-choice-label" style={{ margin: 0, fontSize: 'var(--body1-size)' }}>플랜 선택</h2>
          <div role="radiogroup" aria-labelledby="plan-choice-label" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
            <ChoiceCard name="plan" inputValue="standard" selected={plan === 'standard'} onSelect={() => setPlan('standard')} icon={<Icon name="document" />} title="기본 플랜" description="필수 설정으로 시작" />
            <ChoiceCard name="plan" inputValue="review" selected={plan === 'review'} onSelect={() => setPlan('review')} icon={<Icon name="layers" />} title="검토 플랜" description="승인 절차를 포함" />
          </div>
        </section>
        <section aria-labelledby="extra-choice-label" style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <h2 id="extra-choice-label" style={{ margin: 0, fontSize: 'var(--body1-size)' }}>추가 옵션</h2>
          <div role="group" aria-labelledby="extra-choice-label" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
            <ChoiceCard multiple name="extras" inputValue="audit" selected={extras.includes('audit')} onSelect={(selected) => toggleExtra('audit', selected)} icon={<Icon name="check" />} title="검사 기록" description="변경 이력을 보존" />
            <ChoiceCard multiple name="extras" inputValue="notice" selected={extras.includes('notice')} onSelect={(selected) => toggleExtra('notice', selected)} icon={<Icon name="bell" />} title="완료 알림" description="처리 결과를 전송" />
          </div>
        </section>
      </main>
    );
  },
};

export const ChoiceCardStates = {
  name: '상태와 좁은 너비',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-3)', width: 280, maxWidth: '100%' }}>
      <ChoiceCard selected title="선택됨" description="단일 선택 표시" />
      <ChoiceCard multiple selected title="다중 선택됨" description="checkbox 표시" />
      <ChoiceCard disabled title="비활성" description="선택할 수 없음" />
      <ChoiceCard data-contract="disabled-selected-radio" selected disabled onSelect={() => {}} title="선택 후 비활성" description="현재 값은 유지하지만 변경할 수 없음" />
      <ChoiceCard data-contract="disabled-selected-checkbox" multiple selected disabled onSelect={() => {}} title="선택된 다중 옵션 비활성" description="선택 여부와 사용 불가 상태를 함께 표시" />
      <ChoiceCard title="긴 설명이 있는 선택지" description="좁은 화면에서도 제목, 설명, 선택 표시가 서로 겹치지 않아야 합니다." />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const disabledRadio = canvasElement.querySelector('[data-contract="disabled-selected-radio"]');
    const disabledCheckbox = canvasElement.querySelector('[data-contract="disabled-selected-checkbox"]');
    const radioInput = disabledRadio?.querySelector('input[type="radio"]');
    const checkboxInput = disabledCheckbox?.querySelector('input[type="checkbox"]');
    const radioIndicator = disabledRadio?.querySelector('[data-choice-indicator]');
    if (!radioInput?.checked || !radioInput.disabled || !checkboxInput?.checked || !checkboxInput.disabled) {
      throw new Error('Disabled selected cards must preserve native checked state while blocking interaction.');
    }
    if (!radioIndicator?.firstElementChild || getComputedStyle(radioIndicator).color !== getComputedStyle(disabledRadio).color) {
      throw new Error('Disabled selected ChoiceCard must use a neutral disabled selection marker.');
    }
  },
};

export const ChoiceCardInputContract = {
  name: '단일·다중 선택 계약',
  tags: ['!dev'],
  render: function Contract() {
    const [single, setSingle] = React.useState('one');
    const [multiple, setMultiple] = React.useState(false);
    return (
      <main style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <div role="radiogroup" aria-label="단일 선택">
          <ChoiceCard name="choice-contract" inputValue="one" title="첫 번째" selected={single === 'one'} onSelect={() => setSingle('one')} />
          <ChoiceCard name="choice-contract" inputValue="two" title="두 번째" selected={single === 'two'} onSelect={() => setSingle('two')} />
        </div>
        <ChoiceCard multiple name="choice-contract-extra" inputValue="extra" title="추가 선택" selected={multiple} onSelect={setMultiple} />
      </main>
    );
  },
  play: async ({ canvasElement }) => {
    const radios = [...canvasElement.querySelectorAll('input[type="radio"][name="choice-contract"]')];
    const checkbox = canvasElement.querySelector('input[type="checkbox"]');
    if (radios.length !== 2 || !radios[0].checked || !checkbox) throw new Error('Native radio and checkbox inputs are required.');
    await userEvent.click(radios[1]);
    if (radios[0].checked || !radios[1].checked) throw new Error('Single selection must move between cards.');
    await userEvent.click(radios[1]);
    if (!radios[1].checked) throw new Error('Clicking the selected radio card must not clear the group.');
    await userEvent.click(checkbox);
    if (!checkbox.checked) throw new Error('The multiple card must toggle independently.');
    await userEvent.click(checkbox);
    if (checkbox.checked) throw new Error('The multiple card must support deselection.');
  },
};

export const ChoiceCardNamingContract = {
  name: '이름·설명·밀도 계약',
  tags: ['!dev'],
  parameters: storyDescription(
    '카드의 제목이 이름을, 설명이 힌트(aria-describedby)가 되는지 확인하고 sm·기본 padding 및 고정된 본문 줄 높이를 함께 검증합니다.',
  ),
  render: function Naming() {
    const [plan, setPlan] = React.useState('standard');
    return (
      <main style={{ display: 'grid', gap: 'var(--space-3)', maxWidth: 420 }}>
        <div role="radiogroup" aria-label="플랜">
          <ChoiceCard
            data-contract="named-card"
            name="naming-plan"
            inputValue="standard"
            title="기본 플랜"
            description="필수 설정으로 시작합니다."
            padding="sm"
            selected={plan === 'standard'}
            onSelect={() => setPlan('standard')}
          />
          <ChoiceCard
            data-contract="labelled-card"
            name="naming-plan"
            inputValue="review"
            aria-label="검토 플랜 직접 지정"
            title="검토 플랜"
            description="승인 절차를 포함합니다."
            selected={plan === 'review'}
            onSelect={() => setPlan('review')}
          />
        </div>
      </main>
    );
  },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[data-contract="named-card"]');
    const input = card?.querySelector('input[type="radio"]');
    if (!input) throw new Error('ChoiceCard must render a native radio.');
    if (!input.checked) throw new Error('The initially selected ChoiceCard must preserve native checked state.');
    if (getComputedStyle(card).paddingTop !== '12px') {
      throw new Error('padding="sm" must compute to 12px for the choice presentation.');
    }
    if (input.hasAttribute('aria-label')) {
      throw new Error('A string title must not be forced onto the input as aria-label.');
    }
    const labelledBy = input.getAttribute('aria-labelledby');
    const describedBy = input.getAttribute('aria-describedby');
    const titleNode = labelledBy ? canvasElement.ownerDocument.getElementById(labelledBy) : null;
    const descriptionNode = describedBy ? canvasElement.ownerDocument.getElementById(describedBy) : null;
    if (titleNode?.textContent?.trim() !== '기본 플랜') {
      throw new Error('The title element must supply the accessible name.');
    }
    if (descriptionNode?.textContent?.trim() !== '필수 설정으로 시작합니다.') {
      throw new Error('The description must reach the input as aria-describedby.');
    }
    if (getComputedStyle(titleNode).lineHeight !== getComputedStyle(titleNode).getPropertyValue('--body2-line').trim()) {
      throw new Error('The ChoiceCard title must use the body2 line-height token.');
    }
    if (getComputedStyle(descriptionNode).lineHeight !== getComputedStyle(descriptionNode).getPropertyValue('--label2-line').trim()) {
      throw new Error('The ChoiceCard description must use the label2 line-height token.');
    }

    const explicitCard = canvasElement.querySelector('[data-contract="labelled-card"]');
    const explicit = explicitCard?.querySelector('input[type="radio"]');
    if (getComputedStyle(explicitCard).paddingTop !== '16px') {
      throw new Error('The default md padding must remain 16px for the choice presentation.');
    }
    if (explicit?.getAttribute('aria-label') !== '검토 플랜 직접 지정' || explicit.hasAttribute('aria-labelledby')) {
      throw new Error('An explicit aria-label must win over the title element.');
    }
    if (!explicit.getAttribute('aria-describedby')) {
      throw new Error('An explicitly named card must still expose its description.');
    }
    await userEvent.click(explicit);
    if (input.checked || !explicit.checked) {
      throw new Error('Padding and typography must not change native single-selection behavior.');
    }
  },
};

export const ChoiceCardCard = {
  ...ChoiceCardCardStory,
  name: 'ChoiceCard card parity',
  tags: ['!dev', 'visual-parity'],
};
