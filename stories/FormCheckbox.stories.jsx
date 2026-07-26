import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Checkbox, CheckboxGroup } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

/* 접근 이름은 aria-label이 없으면 감싸는 <label>에서 나온다. */
function accessibleName(input) {
  const aria = input.getAttribute('aria-label');
  if (aria != null) return aria.trim();
  return [...(input.labels ?? [])].map((node) => node.textContent).join(' ').replace(/\s+/g, ' ').trim();
}

function visualBox(input) {
  return input.parentElement?.querySelector('[aria-hidden="true"]');
}

const meta = {
  title: 'LDS Core/Components/Selection and Input/Checkbox',
  tags: ['autodocs'],
  component: Checkbox,
  subcomponents: { CheckboxGroup },
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-selection-and-input-checkbox--checkboxes',
      eyebrow: 'Core / Checkbox',
      title: '사용자가 서로 독립적인 옵션을 하나 이상 선택합니다',
      description:
        '여러 항목을 각각 켜거나 끌 수 있고 선택 조합이 허용될 때 적합합니다. 반드시 하나만 골라야 하거나 즉시 적용되는 단일 설정에는 Checkbox 대신 Radio 또는 Switch를 사용하세요.',
    },
    docs: {
      description: {
        component: 'Checkbox와 Checkbox Group은 독립적인 다중 선택, 혼합 상태, mark 표현과 상호작용 계약을 함께 소유합니다.',
      },
    },
  },
};

export default meta;

export const Checkboxes = {
  name: '개요',
  parameters: storyDescription(
    '사용자가 받을 알림 채널을 여러 개 선택하고 완료 후 요약 생성 여부를 별도로 정하는 상황입니다. 그룹의 다중 선택과 독립 Checkbox가 같은 mark·focus·disabled 언어를 공유하는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 620 }}>
      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 style={{ margin: 0, fontSize: 'var(--body1-size)', color: 'var(--color-semantic-label-strong)' }}>알림 옵션</h2>
        <CheckboxGroup
          aria-label="알림 옵션"
          defaultValue={['email', 'a11y']}
          options={[
            { value: 'email', label: '이메일 알림' },
            { value: 'log', label: '변경 로그' },
            { value: 'a11y', label: '접근성 검토' },
          ]}
        />
      </section>
      <Checkbox label="완료 후 요약 생성" defaultChecked />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[role="group"]');
    const options = [...(group?.querySelectorAll('input[type="checkbox"]') ?? [])];
    if (options.length !== 3) {
      throw new Error('CheckboxGroup must render one native checkbox input per option.');
    }

    const names = options.map(accessibleName);
    const expected = ['이메일 알림', '변경 로그', '접근성 검토'];
    expected.forEach((text, index) => {
      if (names[index] !== text) {
        throw new Error(`A CheckboxGroup option must be named by its visible JSX label, but option ${index} is named "${names[index]}".`);
      }
    });
    if (names.some((name) => name === 'checkbox' || name === '')) {
      throw new Error('A JSX label must never fall back to the literal accessible name "checkbox".');
    }
    if (options.some((option) => option.labels?.length !== 1)) {
      throw new Error('Every checkbox must be a labelable control associated with exactly one label element.');
    }

    if (options.map((option) => option.value).join(',') !== 'email,log,a11y') {
      throw new Error('CheckboxGroup options must carry their native form value.');
    }
    if (!options[0].checked || options[1].checked || !options[2].checked) {
      throw new Error('defaultValue must map onto the native checked state of each input.');
    }

    /* WCAG 2.5.8 — 시각 박스(18px)는 유지하고 상호작용 타깃만 24px 이상이어야 한다. */
    options.forEach((option, index) => {
      const target = option.getBoundingClientRect();
      if (target.width < 24 || target.height < 24) {
        throw new Error(`The interactive checkbox target must be at least 24x24, but option ${index} is ${Math.round(target.width)}x${Math.round(target.height)}.`);
      }
      const box = visualBox(option).getBoundingClientRect();
      if (Math.round(box.width) !== 18 || Math.round(box.height) !== 18) {
        throw new Error('The visible checkbox box must stay 18px while the hit area grows.');
      }
    });

    await userEvent.click(options[1]);
    await waitFor(() => {
      if (!options[1].checked || options[1].getAttribute('aria-checked') !== 'true') {
        throw new Error('Clicking an option must flip both the native and the exposed checked state.');
      }
    });
    /* 시각 스냅샷은 play 종료 상태를 캡처하므로 스토리의 이름난 상태로 복구한다. */
    await userEvent.click(options[1]);
    await waitFor(() => {
      if (options[1].checked) {
        throw new Error('The toggled option must be restored so the story finishes in its named state.');
      }
    });
    options[1].blur();

    const standalone = [...canvasElement.querySelectorAll('input[type="checkbox"]')].at(-1);
    if (accessibleName(standalone) !== '완료 후 요약 생성' || !standalone.checked) {
      throw new Error('A standalone Checkbox must be named by its label and start from defaultChecked.');
    }
  },
};

const matrixGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: 'var(--space-4)',
  alignItems: 'start',
};

const matrixCellStyle = {
  display: 'grid',
  gap: 'var(--space-3)',
  alignContent: 'start',
};

const matrixCaptionStyle = {
  fontSize: 13,
  fontWeight: 'var(--fw-bold)',
  color: 'var(--color-semantic-label-alternative)',
};

export const CheckboxStateContract = {
  name: 'Checkbox 상태 계약',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-3)', maxWidth: 360 }}>
      <Checkbox label="unchecked" state="unchecked" />
      <Checkbox label="checked" state="checked" />
      <Checkbox label="indeterminate" state="indeterminate" />
      <Checkbox label="disabled" state="checked" disabled />
      <Checkbox label="small tight" size="small" tight state="checked" />
    </main>
  ),
};

export const CheckboxMarkContract = {
  name: 'Checkbox mark 계약',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 760 }}>
      <section style={matrixGridStyle}>
        <div style={matrixCellStyle}>
          <span style={matrixCaptionStyle}>State</span>
          <Checkbox variant="mark" label="unchecked" />
          <Checkbox variant="mark" label="checked" defaultChecked />
          <Checkbox variant="mark" label="negative" defaultChecked status="negative" />
          <Checkbox variant="mark" label="disabled" defaultChecked disabled />
        </div>
        <div style={matrixCellStyle}>
          <span style={matrixCaptionStyle}>Size and tight</span>
          <Checkbox variant="mark" label="small" size="sm" />
          <Checkbox variant="mark" label="small checked" size="sm" defaultChecked />
          <Checkbox variant="mark" label="tight label" size="sm" tight defaultChecked />
          <Checkbox variant="mark" aria-label="mark only checked" defaultChecked />
        </div>
        <div style={matrixCellStyle}>
          <span style={matrixCaptionStyle}>Interaction</span>
          <Checkbox variant="mark" label="normal" defaultChecked />
          <Checkbox variant="mark" label="hovered" defaultChecked interaction="hovered" />
          <Checkbox variant="mark" label="focused" defaultChecked interaction="focused" />
          <Checkbox
            variant="mark"
            label="custom label"
            defaultChecked
            labelStyle={{ fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-primary-normal)' }}
          />
        </div>
      </section>
    </main>
  ),
};

function CheckboxKeyboardFixture() {
  const [lastKey, setLastKey] = React.useState('');
  return (
    <main style={{ display: 'grid', gap: 'var(--space-3)', maxWidth: 360 }}>
      <Checkbox label="Space 토글" data-testid="space-toggle" />
      <Checkbox
        label="소비자 onKeyDown"
        data-testid="consumer-keydown"
        onKeyDown={(event) => setLastKey(event.key)}
      />
      <Checkbox label="작은 크기 타깃" size="sm" data-testid="small-target" />
      <Checkbox label="체크 + 혼합" indeterminate defaultChecked data-testid="mixed-checked" />
      <span data-testid="keydown-log" hidden>{lastKey}</span>
    </main>
  );
}

export const CheckboxKeyboardAndMixedContract = {
  name: '키보드와 혼합 상태 계약',
  tags: ['!dev'],
  render: () => <CheckboxKeyboardFixture />,
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const space = canvasElement.querySelector('[data-testid="space-toggle"]');
    if (space?.tagName !== 'INPUT' || space.type !== 'checkbox') {
      throw new Error('Checkbox must render a native input[type="checkbox"], not a synthetic role="checkbox" span.');
    }
    space.focus();
    /* 문서가 OS 포커스를 갖지 않은 환경에서는 focus()가 focus 이벤트를 내지 않으므로 직접 전달한다. */
    space.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    if (doc.activeElement !== space) throw new Error('An enabled checkbox must be focusable.');
    await userEvent.keyboard(' ');
    await waitFor(() => {
      if (!space.checked || space.getAttribute('aria-checked') !== 'true') {
        throw new Error('Space must toggle the checkbox.');
      }
    });

    const consumer = canvasElement.querySelector('[data-testid="consumer-keydown"]');
    const log = canvasElement.querySelector('[data-testid="keydown-log"]');
    consumer.focus();
    consumer.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await userEvent.keyboard(' ');
    await waitFor(() => {
      if (log.textContent !== ' ') {
        throw new Error('A consumer-supplied onKeyDown must run before the internal handlers.');
      }
      if (!consumer.checked || consumer.getAttribute('aria-checked') !== 'true') {
        throw new Error('A consumer-supplied onKeyDown must not silently kill Space toggling.');
      }
    });

    const small = canvasElement.querySelector('[data-testid="small-target"]');
    const smallTarget = small.getBoundingClientRect();
    const smallBox = visualBox(small).getBoundingClientRect();
    if (smallTarget.width < 24 || smallTarget.height < 24) {
      throw new Error(`The sm checkbox target must still reach 24x24, but it is ${Math.round(smallTarget.width)}x${Math.round(smallTarget.height)}.`);
    }
    if (Math.round(smallBox.width) !== 16 || Math.round(smallBox.height) !== 16) {
      throw new Error('The sm visual box must stay 16px while only the hit area grows.');
    }

    const mixed = canvasElement.querySelector('[data-testid="mixed-checked"]');
    if (!mixed.checked || !mixed.indeterminate || mixed.getAttribute('aria-checked') !== 'mixed') {
      throw new Error('indeterminate must stay independent of checked and keep exposing aria-checked="mixed".');
    }
    const mixedBox = visualBox(mixed);
    if (mixedBox.querySelector('svg') || !mixedBox.querySelector('span')) {
      throw new Error('The mixed state must keep the horizontal-bar visual instead of the check mark.');
    }
  },
};

export const CheckboxInteractionContract = {
  name: 'Checkbox 상호작용 계약',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-3)', maxWidth: 360 }}>
      <Checkbox label="normal" />
      <Checkbox label="hovered" interaction="hovered" />
      <Checkbox label="focused" interaction="focused" />
      <Checkbox
        label="custom typography"
        defaultChecked
        labelStyle={{ fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-primary-normal)' }}
      />
    </main>
  ),
};
