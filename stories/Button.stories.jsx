import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Button, Icon } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Action/Button',
  component: Button,
  args: {
    children: '버튼',
    variant: 'solid',
    color: 'primary',
    size: 'medium',
    arrow: false,
    full: false,
    disabled: false,
    loading: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outlined', 'primary', 'secondary', 'signal', 'danger', 'dark', 'flat', 'ghost', 'on-dark'],
    },
    color: {
      control: 'inline-radio',
      options: ['primary', 'assistive'],
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-action-button--playground',
      eyebrow: 'Core / Action / Button',
      title: '명확한 한 번의 행동을 우선순위에 맞게 실행합니다',
      description:
        '폼 제출, 저장, 확인처럼 사용자가 결과를 예상할 수 있는 단일 행동에 적합합니다. 아이콘만 필요한 좁은 도구 영역은 Icon Button, 배경 없는 보조 행동은 Text Button, 켬·끔 상태를 유지해야 하면 Toggle Icon을 사용하세요.',
    },
    docs: {
      description: {
        component:
          'LDS Button의 variant, size, disabled, loading, 아이콘, full, 다크 서피스 사용을 확인합니다.',
      },
    },
  },
};

export default meta;

export const Playground = {
  name: '개요',
  parameters: storyDescription(
    '문맥에 맞는 버튼의 변형, 색상, 크기와 로딩·비활성 상태를 직접 조정하는 상황입니다. 행동의 우선순위가 시각적 강조와 일치하고 상태가 바뀌어도 레이블의 의미가 유지되는지 확인하세요.',
  ),
  render: (args) => <Button {...args} />,
};

export const Variants = {
  name: '변형·상태 · 강조 단계',
  parameters: storyDescription(
    '주요 행동과 보조 행동을 solid·outlined 표면으로 구분해야 하는 상황입니다. 같은 화면에서 강조 단계가 과도하게 경쟁하지 않고 primary와 assistive의 역할이 분명한지 확인하세요.',
  ),
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      {['solid', 'outlined'].map((variant) => (
        <div key={variant} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {['primary', 'assistive'].map((color) => (
            <Button key={`${variant}-${color}`} variant={variant} color={color}>
              {variant} {color}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const ActionMatrix = {
  name: '변형·상태 · 크기별 강조 체계',
  parameters: storyDescription(
    '여러 크기와 강조 단계의 버튼을 한 화면에서 비교해 액션 체계를 검토하는 상황입니다. 크기별 높이와 아이콘 정렬, 위험 행동, 비활성 상태가 일관된 위계로 읽히는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 18, maxWidth: 760 }}>
      {['large', 'medium', 'small'].map((size) => (
        <section key={size} style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="solid" color="primary" size={size}>Primary</Button>
          <Button variant="solid" color="assistive" size={size}>Assistive</Button>
          <Button variant="outlined" color="primary" size={size}>Primary</Button>
          <Button variant="outlined" color="assistive" size={size}>Assistive</Button>
          <Button variant="danger" size={size}>Danger</Button>
          <Button variant="solid" color="primary" size={size} iconOnly aria-label={`${size} icon only`}>
            <Icon name="plus" size={size === 'small' ? 16 : 18} />
          </Button>
          <Button variant="solid" color="primary" size={size} disable>Disabled</Button>
        </section>
      ))}
    </main>
  ),
};

export const SizesAndStates = {
  name: '변형·상태 · 크기와 처리 상태',
  parameters: storyDescription(
    '공간 밀도와 처리 상태에 따라 버튼 크기, 로딩, 비활성, 아이콘, 전체 너비를 선택하는 상황입니다. 상태 변화 중에도 레이아웃이 흔들리지 않고 실행 가능 여부가 명확한지 확인하세요.',
  ),
  render: () => (
    <div style={{ display: 'grid', gap: 18, maxWidth: 720 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button size="small">Small</Button>
        <Button size="medium">Medium</Button>
        <Button size="large">Large</Button>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button disabled>Disabled</Button>
        <Button loading loadingLabel="저장 중">
          저장 중
        </Button>
        <Button variant="outlined" color="assistive">
          <Icon name="upload" size={18} />
          내보내기
        </Button>
      </div>
      <div style={{ width: 'min(360px, 100%)' }}>
        <Button full variant="solid" color="primary">
          Full width
        </Button>
      </div>
    </div>
  ),
};

function ButtonStateContractDemo() {
  const [activations, setActivations] = React.useState(0);
  return (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 760 }}>
      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
        <Button data-contract="interactive" onClick={() => setActivations((count) => count + 1)}>저장</Button>
        <Button data-contract="width-reference">저장</Button>
        <Button data-contract="loading" loading loadingLabel="저장 중">저장</Button>
        <Button data-contract="aria-disabled" aria-disabled="true" onClick={() => setActivations((count) => count + 1)}>
          권한 필요
        </Button>
        <Button variant="danger">삭제</Button>
      </div>
      <output data-contract="activations" aria-live="polite" style={{ color: 'var(--color-semantic-label-neutral)' }}>
        실행 횟수: {activations}
      </output>
    </main>
  );
}

export const InteractionContract = {
  name: '상호작용 · 상태와 처리',
  parameters: storyDescription(
    '일반·hover·pressed·loading·ARIA disabled·danger 상태를 한 흐름에서 검증하는 상황입니다. hover와 pressed는 위치를 바꾸지 않는 tone 변화이며 loading은 폭을 유지하고 aria-disabled는 focus 가능하지만 실행되지 않아야 합니다.',
  ),
  render: () => <ButtonStateContractDemo />,
  play: async ({ canvasElement }) => {
    const interactive = canvasElement.querySelector('[data-contract="interactive"]');
    const widthReference = canvasElement.querySelector('[data-contract="width-reference"]');
    const loading = canvasElement.querySelector('[data-contract="loading"]');
    const ariaDisabled = canvasElement.querySelector('[data-contract="aria-disabled"]');
    const activations = canvasElement.querySelector('[data-contract="activations"]');
    if (!interactive || !widthReference || !loading || !ariaDisabled || !activations) {
      throw new Error('Button state contract requires every target control.');
    }

    const restBackground = getComputedStyle(interactive).backgroundColor;
    await userEvent.hover(interactive);
    await waitFor(() => {
      if (getComputedStyle(interactive).backgroundColor === restBackground) {
        throw new Error('Button hover must provide calm tone feedback.');
      }
    });
    interactive.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    const hoverBackground = getComputedStyle(interactive).backgroundColor;
    await waitFor(() => {
      if (getComputedStyle(interactive).backgroundColor === hoverBackground) {
        throw new Error('Button pressed must be visually distinct from hover.');
      }
    });
    interactive.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

    const widthDelta = Math.abs(widthReference.getBoundingClientRect().width - loading.getBoundingClientRect().width);
    if (widthDelta > 0.5) throw new Error(`Button loading changed width by ${widthDelta}px.`);
    if (loading.getAttribute('aria-label') !== '저장 중') throw new Error('Button loading needs one accessible loading name.');

    ariaDisabled.focus();
    if (canvasElement.ownerDocument.activeElement !== ariaDisabled) throw new Error('aria-disabled Button must remain focusable.');
    await userEvent.click(ariaDisabled);
    if (activations.textContent?.trim() !== '실행 횟수: 0') throw new Error('aria-disabled Button must block activation.');
  },
};

export const OnDark = {
  name: '변형·상태 · 어두운 배경',
  parameters: {
    backgrounds: { default: 'Navy' },
    ...storyDescription(
      '어두운 서피스 위에 행동을 배치해야 하는 상황입니다. on-dark 변형이 충분한 대비와 명확한 포커스 표시를 유지하며 일반 밝은 배경용 변형과 혼용되지 않는지 확인하세요.',
    ),
  },
  render: () => (
    <div style={{ background: 'var(--color-semantic-inverse-background)', padding: 28, borderRadius: 'var(--radius-lg)' }}>
      <Button variant="on-dark">자세히 보기</Button>
    </div>
  ),
};

export const DarkThemeGhost = {
  name: '변형·상태 · 다크 테마 보조 버튼',
  parameters: storyDescription(
    '다크 semantic theme 안에서 낮은 강조의 ghost 행동을 배치하는 상황입니다. 투명한 표면과 얇은 보더가 위계를 낮추되, 텍스트는 현재 theme label foreground를 사용해 읽을 수 있어야 합니다.',
  ),
  render: () => (
    <main
      data-theme="dark"
      style={{ width: 'min(100%, 520px)', padding: 28, boxSizing: 'border-box', borderRadius: 'var(--radius-xl)', background: 'var(--color-semantic-background-normal-normal)' }}
    >
      <Button data-contract="dark-ghost" variant="ghost">세부 정보 보기</Button>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('[data-contract="dark-ghost"]');
    if (!button) throw new Error('Dark ghost Button contract target is required.');
    const styles = getComputedStyle(button);
    const foreground = styles.getPropertyValue('--component-button-ghost-fg').trim();
    const scopedLabel = styles.getPropertyValue('--color-semantic-label-normal').trim();
    if (foreground !== scopedLabel) {
      throw new Error(`Dark ghost foreground must resolve at the rendered theme scope (${foreground} !== ${scopedLabel}).`);
    }
  },
};
