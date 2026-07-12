import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Icon, IconButton } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Action/Icon Button',
  component: IconButton,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-action-icon-button--icon-button-variants',
      eyebrow: 'Core / Action / Icon Button',
      title: '익숙한 아이콘으로 공간을 아끼며 즉시 행동합니다',
      description:
        '툴바의 검색·설정·닫기처럼 의미가 익숙하고 짧은 레이블을 시각적으로 숨겨야 하는 행동에 적합합니다. 의미가 모호하거나 중요한 결정에는 텍스트가 보이는 Button을, 켬·끔 상태를 유지하는 행동에는 Toggle Icon을 사용하세요.',
    },
    docs: {
      description: {
        component: '아이콘만으로 즉시 실행되는 IconButton입니다. WDS 원본 축(variant, round, size, disable)을 따르며 항상 접근 가능한 label을 요구합니다.',
      },
    },
  },
};

export default meta;

export const IconButtonVariants = {
  name: '개요',
  parameters: storyDescription(
    '제한된 도구 영역에서 검색, 설정, 알림, 닫기 같은 아이콘 행동을 배치하는 상황입니다. 각 아이콘에 접근 가능한 이름이 있고 크기·표면·비활성 상태에서도 클릭 목표와 의미가 분명한지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 640 }}>
      <section style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <IconButton label="검색">
          <Icon name="search" size={19} />
        </IconButton>
        <IconButton label="설정" variant="solid">
          <Icon name="setting" size={19} />
        </IconButton>
        <IconButton label="알림" variant="signal" round>
          <Icon name="bell" size={19} />
        </IconButton>
        <IconButton label="닫기" variant="ghost">
          <Icon name="close" size={16} />
        </IconButton>
      </section>
      <section style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <IconButton label="검색" size="small"><Icon name="search" size={18} /></IconButton>
        <IconButton label="추가" size="medium" variant="solid"><Icon name="plus" size={18} /></IconButton>
        <IconButton label="삭제" disabled><Icon name="trash" size={18} /></IconButton>
      </section>
    </main>
  ),
};

function IconButtonStateDemo() {
  const [activations, setActivations] = React.useState(0);
  return (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 640 }}>
      <section style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
        <IconButton data-contract="interactive" label="검색" onClick={() => setActivations((count) => count + 1)}>
          <Icon name="search" size={18} aria-hidden="true" />
        </IconButton>
        <IconButton data-contract="aria-disabled" label="권한이 필요한 설정" aria-disabled="true" onClick={() => setActivations((count) => count + 1)}>
          <Icon name="setting" size={18} aria-hidden="true" />
        </IconButton>
        <IconButton label="비활성 삭제" disabled>
          <Icon name="trash" size={18} aria-hidden="true" />
        </IconButton>
      </section>
      <output data-contract="activations" aria-live="polite">실행 횟수: {activations}</output>
    </main>
  );
}

export const InteractionAndDisabledContract = {
  name: '상호작용 · 아이콘 행동 계약',
  parameters: storyDescription(
    '아이콘만 있는 행동의 hover·pressed·비활성 상태와 접근 가능한 이름을 검증하는 상황입니다. 상태 피드백은 위치 변화 없이 표면 색조로 구분하고, aria-disabled는 초점을 유지하면서 실행을 차단합니다.',
  ),
  render: () => <IconButtonStateDemo />,
  play: async ({ canvasElement }) => {
    const interactive = canvasElement.querySelector('[data-contract="interactive"]');
    const ariaDisabled = canvasElement.querySelector('[data-contract="aria-disabled"]');
    const activations = canvasElement.querySelector('[data-contract="activations"]');
    if (!interactive || !ariaDisabled || !activations) throw new Error('IconButton contract targets are required.');
    if (interactive.getAttribute('aria-label') !== '검색') throw new Error('IconButton needs an accessible name.');

    const restBackground = getComputedStyle(interactive).backgroundColor;
    await userEvent.hover(interactive);
    await waitFor(() => {
      if (getComputedStyle(interactive).backgroundColor === restBackground) throw new Error('IconButton hover feedback is missing.');
    });
    const hoverBackground = getComputedStyle(interactive).backgroundColor;
    interactive.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await waitFor(() => {
      if (getComputedStyle(interactive).backgroundColor === hoverBackground) throw new Error('IconButton pressed feedback must differ from hover.');
    });
    interactive.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

    ariaDisabled.focus();
    if (canvasElement.ownerDocument.activeElement !== ariaDisabled) throw new Error('aria-disabled IconButton must remain focusable.');
    await userEvent.click(ariaDisabled);
    if (activations.textContent?.trim() !== '실행 횟수: 0') throw new Error('aria-disabled IconButton must block activation.');
  },
};
