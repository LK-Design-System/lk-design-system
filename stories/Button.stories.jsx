import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Button, Icon } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Action/Button',
  tags: ['autodocs'],
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
        <Button data-contract="loading" loading loadingLabel="저장 중" onClick={() => setActivations((count) => count + 1)}>저장</Button>
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
    '일반·hover·pressed·loading·ARIA disabled·danger 상태를 한 흐름에서 검증하는 상황입니다. hover와 pressed는 위치를 바꾸지 않는 tone 변화이며, loading은 폭과 초점을 유지한 채 실행만 차단하고, aria-disabled는 focus 가능하지만 실행되지 않아야 합니다. 로딩 스피너는 prefers-reduced-motion 설정을 항상 존중해야 합니다.',
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

    // Loading must not fold into native `disabled`: a focused control would lose
    // focus to <body> the instant it starts loading. Keep it focusable and block
    // activation through aria-disabled instead.
    if (loading.hasAttribute('disabled')) {
      throw new Error('A loading Button must stay focusable instead of using native disabled.');
    }
    if (loading.getAttribute('aria-disabled') !== 'true' || loading.getAttribute('aria-busy') !== 'true') {
      throw new Error('A loading Button must expose aria-disabled and aria-busy.');
    }
    loading.focus();
    loading.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    if (canvasElement.ownerDocument.activeElement !== loading) {
      throw new Error('A loading Button must remain focusable.');
    }
    await userEvent.click(loading);
    if (activations.textContent?.trim() !== '실행 횟수: 0') {
      throw new Error('A loading Button must block activation.');
    }

    // The loading spinner animation is applied inline, so the reduced-motion
    // override has to win with !important (WCAG 2.3.3).
    const spinnerKeyframes = canvasElement.ownerDocument.getElementById('lk-spin-kf');
    if (!spinnerKeyframes) throw new Error('The loading Button must inject the spinner keyframes.');
    const reducedMotionRule = spinnerKeyframes.textContent
      .split('@media (prefers-reduced-motion: reduce)')[1];
    if (!reducedMotionRule || !/\[data-lds-spinner-ring\]\s*\{[^}]*animation\s*:\s*none\s*!important/.test(reducedMotionRule)) {
      throw new Error('The spinner reduced-motion rule must use !important to beat the inline animation.');
    }

    ariaDisabled.focus();
    if (canvasElement.ownerDocument.activeElement !== ariaDisabled) throw new Error('aria-disabled Button must remain focusable.');
    await userEvent.click(ariaDisabled);
    if (activations.textContent?.trim() !== '실행 횟수: 0') throw new Error('aria-disabled Button must block activation.');
  },
};

export const OnDark = {
  name: '변형·상태 · 어두운 배경',
  parameters: storyDescription(
    '밝은 화면 안에 네이비 배너처럼 국소적인 역상 서피스가 놓인 상황입니다. 전역 테마를 바꾸지 않고 이 영역의 행동에만 on-dark 변형을 사용해 흰색 전경과 반투명 표면을 명시적으로 적용합니다.',
  ),
  render: () => (
    <main
      data-contract="on-dark-example"
      style={{
        width: 'min(100%, 720px)',
        padding: 'var(--space-6)',
        boxSizing: 'border-box',
        display: 'grid',
        gap: 'var(--space-6)',
        border: 'var(--border-thin) solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--color-semantic-background-normal-normal)',
      }}
    >
      <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <span className="type-caption1" style={{ color: 'var(--color-semantic-label-alternative)', fontWeight: 'var(--fw-semibold)' }}>
          밝은 화면의 일반 콘텐츠
        </span>
        <strong className="type-headline1" style={{ color: 'var(--color-semantic-label-normal)' }}>
          운영 요약
        </strong>
        <span className="type-body2" style={{ color: 'var(--color-semantic-label-neutral)' }}>
          일반 콘텐츠는 현재 라이트 테마의 semantic foreground를 사용합니다.
        </span>
      </div>
      <section
        data-contract="inverse-action-region"
        style={{
          padding: 'var(--space-6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-5)',
          flexWrap: 'wrap',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--color-semantic-inverse-background)',
        }}
      >
        <div style={{ display: 'grid', gap: 'var(--space-2)', flex: '1 1 260px' }}>
          <span className="type-caption1" style={{ color: 'var(--color-semantic-inverse-label-alternative-soft)', fontWeight: 'var(--fw-semibold)' }}>
            국소적인 역상 서피스
          </span>
          <strong className="type-headline1" style={{ color: 'var(--color-semantic-inverse-label)' }}>
            야간 점검 리포트
          </strong>
          <span className="type-body2" style={{ color: 'var(--color-semantic-inverse-label-neutral-soft)' }}>
            이 영역만 어둡기 때문에 버튼이 배경 문맥을 직접 선언합니다.
          </span>
        </div>
        <Button data-contract="on-dark-button" variant="on-dark">자세히 보기</Button>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const example = canvasElement.querySelector('[data-contract="on-dark-example"]');
    const region = canvasElement.querySelector('[data-contract="inverse-action-region"]');
    const button = canvasElement.querySelector('[data-contract="on-dark-button"]');
    if (!example || !region || !button) throw new Error('On-dark Button requires a localized inverse region inside a light page.');
    if (button.closest('[data-theme="dark"], .theme-dark')) {
      throw new Error('On-dark Button must demonstrate a localized dark surface without changing the page theme.');
    }
    if (getComputedStyle(example).backgroundColor === getComputedStyle(region).backgroundColor) {
      throw new Error('The on-dark example must make the local inverse surface visually distinct from the light page.');
    }
  },
};

export const DarkThemeGhost = {
  name: '변형·상태 · 다크 테마 보조 버튼',
  parameters: storyDescription(
    '같은 ghost 변형이 라이트·다크 semantic theme의 foreground와 border token을 각각 상속하는 상황입니다. 국소적인 어두운 배경을 위한 on-dark와 달리 버튼 자체의 변형은 바꾸지 않습니다.',
  ),
  render: () => (
    <main
      data-contract="ghost-theme-comparison"
      style={{ width: 'min(100%, 720px)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}
    >
      {[
        { theme: 'light', label: '라이트 semantic theme' },
        { theme: 'dark', label: '다크 semantic theme' },
      ].map(({ theme, label }) => (
        <section
          key={theme}
          data-theme={theme}
          data-contract={`${theme}-theme-panel`}
          style={{
            flex: '1 1 260px',
            minHeight: 220,
            padding: 'var(--space-6)',
            boxSizing: 'border-box',
            display: 'grid',
            alignContent: 'space-between',
            gap: 'var(--space-6)',
            border: 'var(--border-thin) solid var(--color-semantic-line-normal-normal)',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--color-semantic-background-normal-normal)',
          }}
        >
          <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            <span className="type-caption1" style={{ color: 'var(--color-semantic-label-alternative)', fontWeight: 'var(--fw-semibold)' }}>
              {label}
            </span>
            <strong className="type-headline1" style={{ color: 'var(--color-semantic-label-normal)' }}>
              프로젝트 설정
            </strong>
            <span className="type-body2" style={{ color: 'var(--color-semantic-label-neutral)' }}>
              동일한 ghost 버튼이 현재 테마의 semantic token을 따릅니다.
            </span>
          </div>
          <div>
            <Button data-contract={`${theme}-ghost`} variant="ghost">세부 정보 보기</Button>
          </div>
        </section>
      ))}
    </main>
  ),
  play: async ({ canvasElement }) => {
    const lightButton = canvasElement.querySelector('[data-contract="light-ghost"]');
    const darkButton = canvasElement.querySelector('[data-contract="dark-ghost"]');
    if (!lightButton || !darkButton) throw new Error('Ghost theme comparison requires both light and dark controls.');
    const lightStyles = getComputedStyle(lightButton);
    const darkStyles = getComputedStyle(darkButton);
    if (lightStyles.color === darkStyles.color) {
      throw new Error('The same ghost Button must resolve a different foreground in light and dark semantic themes.');
    }
    for (const styles of [lightStyles, darkStyles]) {
      const foreground = styles.getPropertyValue('--component-button-ghost-fg').trim();
      const scopedLabel = styles.getPropertyValue('--color-semantic-label-normal').trim();
      if (foreground !== scopedLabel) {
        throw new Error(`Ghost foreground must resolve at its rendered theme scope (${foreground} !== ${scopedLabel}).`);
      }
    }
  },
};
