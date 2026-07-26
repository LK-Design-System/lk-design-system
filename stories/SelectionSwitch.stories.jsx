import { userEvent, waitFor } from 'storybook/test';
import { Switch } from '../src/index.js';
import { SwitchCard as SwitchCardStory } from './SelectionStatus.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

/* 접근 이름은 aria-label이 없으면 감싸는 <label>에서 나온다. */
function accessibleName(input) {
  const aria = input.getAttribute('aria-label');
  if (aria != null) return aria.trim();
  return [...(input.labels ?? [])].map((node) => node.textContent).join(' ').replace(/\s+/g, ' ').trim();
}

function knobOf(input) {
  return input.parentElement?.querySelector('[aria-hidden="true"]')?.firstElementChild;
}

const meta = {
  title: 'LDS Core/Components/Selection and Input/Switch',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-selection-and-input-switch--switch-control',
      eyebrow: 'Core / Switch',
      title: '사용자가 즉시 적용되는 이진 설정을 켜거나 끕니다',
      description:
        '변경 즉시 시스템 상태나 설정이 적용되는 on/off 제어에 적합합니다. 제출 시 한꺼번에 적용되는 동의·선택에는 Checkbox를, 실행 명령에는 Button을 사용하세요.',
    },
    docs: {
      description: {
        component: '이진 설정에 쓰는 Switch 패턴입니다.',
      },
    },
  },
};

export default meta;

export const SwitchControl = {
  name: '개요',
  parameters: storyDescription(
    '원격 제어와 야간 모드처럼 독립적인 이진 설정을 전환하는 상황입니다. 레이블과 현재 on/off 상태가 함께 읽히고 포인터·키보드 입력 뒤 즉시 갱신되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 420 }}>
      <Switch label="원격 제어 허용" defaultChecked />
      <Switch label="야간 모드" />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const switches = [...canvasElement.querySelectorAll('input[role="switch"]')];
    if (switches.length !== 2 || switches.some((node) => node.type !== 'checkbox')) {
      throw new Error('Switch must render a native input[type="checkbox"] carrying role="switch".');
    }

    const names = switches.map(accessibleName);
    if (names[0] !== '원격 제어 허용' || names[1] !== '야간 모드') {
      throw new Error(`A Switch must be named by its visible label, but the names are "${names.join('", "')}".`);
    }
    if (names.some((name) => name === 'switch' || name === '')) {
      throw new Error('A JSX label must never fall back to the literal accessible name "switch".');
    }
    if (switches.some((node) => node.labels?.length !== 1)) {
      throw new Error('Every switch must be a labelable control associated with exactly one label element.');
    }

    if (!switches[0].checked || switches[0].getAttribute('aria-checked') !== 'true' || switches[1].checked) {
      throw new Error('defaultChecked must map onto the native checked state.');
    }

    await userEvent.click(switches[1]);
    await waitFor(() => {
      if (!switches[1].checked || switches[1].getAttribute('aria-checked') !== 'true') {
        throw new Error('Activating a switch must flip both the native and the exposed checked state.');
      }
      /* 색 이외의 신호 — 노브 위치가 함께 움직여야 한다. */
      if (knobOf(switches[1])?.style.transform !== 'translateX(20px)') {
        throw new Error('The knob must move as the non-colour on/off signal.');
      }
    });
  },
};

export const SwitchPlatformMatrix = {
  name: '스위치 플랫폼',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 560 }}>
      <section style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <strong style={{ fontSize: 13, color: 'var(--color-semantic-label-alternative)' }}>Normal</strong>
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
          <Switch size="sm" label="sm off" aria-label="normal small off" />
          <Switch size="sm" label="sm on" defaultChecked aria-label="normal small on" />
          <Switch label="md off" aria-label="normal medium off" />
          <Switch label="md on" defaultChecked aria-label="normal medium on" />
        </div>
      </section>
      <section style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <strong style={{ fontSize: 13, color: 'var(--color-semantic-label-alternative)' }}>iOS</strong>
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
          <Switch platform="ios" size="sm" label="sm off" aria-label="ios small off" />
          <Switch platform="ios" size="sm" label="sm on" defaultChecked aria-label="ios small on" />
          <Switch platform="ios" label="md off" aria-label="ios medium off" />
          <Switch platform="ios" label="md on" defaultChecked aria-label="ios medium on" />
        </div>
      </section>
      <section style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <strong style={{ fontSize: 13, color: 'var(--color-semantic-label-alternative)' }}>Disabled</strong>
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
          <Switch disabled label="off" aria-label="disabled off" />
          <Switch disabled label="on" defaultChecked aria-label="disabled on" />
        </div>
      </section>
    </main>
  ),
};

export const SwitchInteractionMatrix = {
  name: 'Switch interaction',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 640 }}>
      <section style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <strong style={{ fontSize: 13, color: 'var(--color-semantic-label-alternative)' }}>State</strong>
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
          <Switch label="off" />
          <Switch label="on" defaultChecked />
          <Switch label="hovered" interaction="hovered" />
          <Switch label="focused" interaction="focused" />
          <Switch label="read only" defaultChecked readOnly interaction="hovered" />
          <Switch label="disabled" disabled />
        </div>
      </section>
      <section style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <strong style={{ fontSize: 13, color: 'var(--color-semantic-label-alternative)' }}>iOS resource</strong>
        <div style={{ display: 'grid', gap: 'var(--space-3)', width: 'fit-content' }}>
          <Switch platform="ios" size="sm" label="small off" />
          <Switch platform="ios" size="sm" label="small on" defaultChecked />
          <Switch platform="ios" label="medium focus" interaction="focused" />
          <Switch platform="ios" label="disabled on" defaultChecked disabled />
        </div>
      </section>
    </main>
  ),
};

export const SwitchKeyboardContract = {
  name: '키보드와 읽기 전용 계약',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-3)', maxWidth: 360 }}>
      <Switch label="키보드 토글" data-testid="switch-keyboard" />
      <Switch label="읽기 전용" defaultChecked readOnly data-testid="switch-readonly" />
      <Switch label="비활성" disabled data-testid="switch-disabled" />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const keyboard = canvasElement.querySelector('[data-testid="switch-keyboard"]');
    if (keyboard?.getAttribute('role') !== 'switch' || accessibleName(keyboard) !== '키보드 토글') {
      throw new Error('The keyboard fixture must be a role="switch" input named by its label.');
    }
    keyboard.focus();
    /* 문서가 OS 포커스를 갖지 않은 환경에서는 focus()가 focus 이벤트를 내지 않으므로 직접 전달한다. */
    keyboard.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    if (doc.activeElement !== keyboard) throw new Error('An enabled switch must be focusable.');

    await userEvent.keyboard(' ');
    await waitFor(() => {
      if (!keyboard.checked || keyboard.getAttribute('aria-checked') !== 'true') {
        throw new Error('Space must toggle the switch.');
      }
    });
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      if (keyboard.checked || keyboard.getAttribute('aria-checked') !== 'false') {
        throw new Error('Enter must toggle the switch — the Switch contract keeps both Space and Enter.');
      }
    });

    const readOnly = canvasElement.querySelector('[data-testid="switch-readonly"]');
    readOnly.focus();
    readOnly.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    if (doc.activeElement !== readOnly || readOnly.getAttribute('aria-readonly') !== 'true') {
      throw new Error('A readOnly switch must stay focusable and expose aria-readonly.');
    }
    await userEvent.keyboard(' ');
    await userEvent.keyboard('{Enter}');
    await userEvent.click(readOnly);
    if (!readOnly.checked || readOnly.getAttribute('aria-checked') !== 'true') {
      throw new Error('A readOnly switch must keep its value through keyboard and pointer input.');
    }

    const off = canvasElement.querySelector('[data-testid="switch-disabled"]');
    off.focus();
    if (doc.activeElement === off || !off.disabled || off.tabIndex !== -1) {
      throw new Error('A disabled switch must stay out of the tab order and reject focus.');
    }
  },
};

export const SwitchCard = { ...SwitchCardStory, name: 'Switch card parity', tags: ['!dev', 'visual-parity'] };
