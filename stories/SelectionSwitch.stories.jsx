import { Switch } from '../src/index.js';
import { SwitchCard as SwitchCardStory } from './SelectionStatus.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Selection and Input/Switch',
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

export const SwitchCard = { ...SwitchCardStory, name: 'Switch card parity', tags: ['!dev', 'visual-parity'] };
