import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Icon, SplitButton } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Action/Split Button',
  tags: ['autodocs'],
  component: SplitButton,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-action-split-button--split-buttons',
      eyebrow: 'Product / Split Button',
      title: '사용자가 기본 실행은 바로 하고 관련된 대안만 필요할 때 펼칩니다',
      description:
        '반복해서 쓰는 기본 액션 하나와 같은 결과 계열의 보조 실행을 함께 제공할 때 적합한 LK Product 확장입니다. 서로 무관하거나 우선순위가 같은 작업에는 분할 실행 대신 개별 버튼이나 메뉴를 사용하세요.',
    },
    docs: {
      description: {
        component: '이 LK Product 확장은 핵심 버튼 두 영역과 메뉴 계약을 조합해 기본 액션과 관련 대안을 하나의 연결된 컨트롤로 제공합니다.',
      },
    },
  },
};

export default meta;

function SplitButtonDemo() {
  const [lastAction, setLastAction] = React.useState('아직 실행하지 않음');

  return (
    <main style={{ display: 'grid', gap: 'var(--space-4)', justifyItems: 'start', maxWidth: 640 }}>
      <SplitButton
        variant="signal"
        onClick={() => setLastAction('변경 내용 저장')}
        items={[
          {
            label: '초안으로 저장',
            icon: <Icon name="document" size={16} aria-hidden="true" />,
            onClick: () => setLastAction('초안으로 저장'),
          },
          {
            label: '예약 저장',
            icon: <Icon name="calendar" size={16} aria-hidden="true" />,
            onClick: () => setLastAction('예약 저장'),
          },
        ]}
      >
        저장
      </SplitButton>
      <p aria-live="polite" style={{ margin: 0, color: 'var(--color-semantic-label-neutral)' }}>
        최근 실행: <strong style={{ color: 'var(--color-semantic-label-strong)' }}>{lastAction}</strong>
      </p>
    </main>
  );
}

export const SplitButtons = {
  name: '개요',
  parameters: storyDescription(
    '변경 내용을 즉시 저장하면서 초안·예약 저장을 관련 대안으로 제공하는 상황입니다. 주 버튼과 펼침 버튼의 역할이 구분되고 선택한 항목이 실행된 뒤 메뉴가 닫히는지 확인하세요.',
  ),
  render: () => <SplitButtonDemo />,
};

function SplitButtonContractDemo() {
  return (
    <main style={{ display: 'grid', gap: 'var(--space-5)', justifyItems: 'start', maxWidth: 720 }}>
      <section style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
        {['sm', 'md', 'lg'].map((size) => (
          <SplitButton
            key={size}
            size={size}
            data-contract={`size-${size}`}
            menuLabel={`${size} 저장 대안 열기`}
            items={[{ label: '초안으로 저장' }]}
          >
            저장
          </SplitButton>
        ))}
      </section>
      <section style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
        <SplitButton
          data-contract="keyboard"
          menuLabel="저장 대안 열기"
          items={[
            { label: '초안으로 저장' },
            { label: '사용할 수 없는 대안', disabled: true },
            { label: '예약 저장' },
          ]}
        >
          저장
        </SplitButton>
        <SplitButton data-contract="loading" loading loadingLabel="저장 중" items={[]}>저장</SplitButton>
        <SplitButton disabled items={[]}>비활성 저장</SplitButton>
        <SplitButton
          data-contract="all-disabled"
          menuLabel="사용할 수 없는 저장 대안 열기"
          items={[{ label: '현재 사용할 수 없는 대안', disabled: true }]}
        >
          저장
        </SplitButton>
      </section>
      <div style={{ position: 'fixed', right: 0, bottom: 0 }}>
        <SplitButton
          data-contract="viewport-edge"
          menuLabel="화면 가장자리 저장 대안 열기"
          items={[{ label: '긴 이름의 초안으로 저장' }, { label: '긴 이름의 예약 저장' }]}
        >
          저장
        </SplitButton>
      </div>
    </main>
  );
}

export const KeyboardAndStateContract = {
  name: '상호작용 · 키보드와 처리 상태',
  parameters: storyDescription(
    '분할 버튼의 32·40·48px 크기, 로딩·비활성 상태와 메뉴 키보드 이동을 함께 검증하는 상황입니다. 펼침 버튼은 메뉴 관계를 알리고 Arrow·Home·End로 사용 가능한 항목만 이동하며 Escape 뒤에는 초점이 펼침 버튼으로 돌아와야 합니다.',
  ),
  render: () => <SplitButtonContractDemo />,
  play: async ({ canvasElement }) => {
    const split = canvasElement.querySelector('[data-contract="keyboard"]');
    const trigger = split?.querySelector('[aria-haspopup="menu"]');
    const loading = canvasElement.querySelector('[data-contract="loading"] > button');
    if (!split || !trigger || !loading) throw new Error('SplitButton contract targets are required.');
    if (trigger.getAttribute('aria-expanded') !== 'false') throw new Error('Closed SplitButton must expose aria-expanded=false.');
    if (!trigger.getAttribute('aria-controls')) throw new Error('SplitButton trigger must control its menu.');
    if (loading.getAttribute('aria-label') !== '저장 중' || loading.getAttribute('aria-busy') !== 'true') {
      throw new Error('Loading SplitButton needs one busy accessible name.');
    }

    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    const menu = await waitFor(() => {
      const openedMenu = split.querySelector('[role="menu"]');
      if (!openedMenu) throw new Error('ArrowDown must open the SplitButton menu.');
      return openedMenu;
    });
    const menuItems = Array.from(menu.querySelectorAll('[role="menuitem"]'));
    if (menuItems.length !== 3 || !menuItems[1].disabled) throw new Error('Menu item disabled state is missing.');
    await waitFor(() => {
      if (canvasElement.ownerDocument.activeElement !== menuItems[0]) throw new Error('ArrowDown must focus the first enabled item.');
    });
    await userEvent.keyboard('{ArrowDown}');
    if (canvasElement.ownerDocument.activeElement !== menuItems[2]) throw new Error('ArrowDown must skip disabled items.');
    await userEvent.keyboard('{Home}');
    if (canvasElement.ownerDocument.activeElement !== menuItems[0]) throw new Error('Home must focus the first enabled item.');
    await userEvent.keyboard('{End}');
    if (canvasElement.ownerDocument.activeElement !== menuItems[2]) throw new Error('End must focus the last enabled item.');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (split.querySelector('[role="menu"]')) throw new Error('Escape must close the menu.');
      if (canvasElement.ownerDocument.activeElement !== trigger) throw new Error('Escape must restore focus to the menu trigger.');
    });

    const allDisabled = canvasElement.querySelector('[data-contract="all-disabled"]');
    const allDisabledTrigger = allDisabled?.querySelector('[aria-haspopup="menu"]');
    if (!allDisabled || !allDisabledTrigger) throw new Error('All-disabled SplitButton contract target is required.');
    allDisabledTrigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => {
      if (!allDisabled.querySelector('[role="menu"]')) throw new Error('An all-disabled menu must still open.');
      if (canvasElement.ownerDocument.activeElement !== allDisabledTrigger) {
        throw new Error('An all-disabled menu must keep focus on its trigger.');
      }
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (allDisabled.querySelector('[role="menu"]')) throw new Error('Trigger Escape must close an all-disabled menu.');
      if (canvasElement.ownerDocument.activeElement !== allDisabledTrigger) {
        throw new Error('Trigger Escape must preserve focus for an all-disabled menu.');
      }
    });

    const edge = canvasElement.querySelector('[data-contract="viewport-edge"]');
    const edgeTrigger = edge?.querySelector('[aria-haspopup="menu"]');
    if (!edge || !edgeTrigger) throw new Error('Viewport-edge SplitButton contract target is required.');
    // The step above closes a menu with Escape, and closing restores focus to
    // the trigger it came from. Calling focus() here and typing immediately
    // raced that restore, so the key could arrive at the previous trigger and
    // this menu never opened — the failure read as the edge menu refusing to
    // open when nothing had asked it to.
    edgeTrigger.focus();
    await waitFor(() => {
      if (canvasElement.ownerDocument.activeElement !== edgeTrigger) {
        throw new Error('The viewport-edge trigger must hold focus before it is driven.');
      }
    });
    await userEvent.keyboard('{ArrowDown}');
    const edgeMenu = await waitFor(() => {
      const openedMenu = edge.querySelector('[role="menu"]');
      if (!openedMenu) throw new Error('Viewport-edge menu must open.');
      if (openedMenu.dataset.placement !== 'top') throw new Error('A bottom-edge SplitButton menu must flip above its trigger.');
      return openedMenu;
    });
    const view = canvasElement.ownerDocument.defaultView;
    await waitFor(() => {
      const rect = edgeMenu.getBoundingClientRect();
      if (rect.left < 15 || rect.right > view.innerWidth - 15) {
        throw new Error('SplitButton menu must remain within 16px viewport padding.');
      }
      if (canvasElement.ownerDocument.documentElement.scrollWidth > view.innerWidth + 1) {
        throw new Error('SplitButton must not create horizontal viewport scrolling.');
      }
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (edge.querySelector('[role="menu"]')) throw new Error('Viewport-edge menu must close with Escape.');
    });
  },
};
