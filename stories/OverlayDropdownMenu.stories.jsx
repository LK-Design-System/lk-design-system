import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import {
  Button,
  DropdownMenu,
  Icon,
} from '../src/index.js';
import { DropdownMenuCard as DropdownMenuCardStory } from './Overlay.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const menuItems = [
  { label: '프로필 열기', shortcut: 'Enter', active: true },
  { label: '공유', description: '협업자에게 링크를 복사합니다', shortcut: 'S' },
  { divider: true },
  { label: '비활성 항목', disable: true },
  { label: '삭제', danger: true, shortcut: 'Del' },
];

const meta = {
  title: 'LDS Core/Components/Overlay/Dropdown Menu',
  component: DropdownMenu,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-overlay-dropdown-menu--dropdown-menu-patterns',
      eyebrow: 'Core / Dropdown Menu',
      title: '사용자가 현재 대상에 관련된 명령을 trigger에서 펼쳐 선택합니다',
      description:
        '버튼이나 항목에 연결된 짧은 명령 목록과 단일·다중 선택 메뉴를 제공할 때 적합합니다. 항상 보이는 앱 수준 메뉴나 즉시 노출해야 할 핵심 action에는 Dropdown Menu 대신 Menubar 또는 Button을 사용하세요.',
    },
    docs: {
      description: {
        component: 'normal·radio·checkbox 항목과 action area·scroll·keyboard focus를 지원하는 WDS DropdownMenu 패턴입니다.',
      },
    },
  },
};

export default meta;

function Section({ title, children }) {
  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <h3 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--color-semantic-label-normal)' }}>{title}</h3>
      {children}
    </section>
  );
}

function CheckboxActionMenuPreview() {
  const [result, setResult] = React.useState('선택 변경 전');
  return (
    <div style={{ minHeight: 300, display: 'grid', alignContent: 'start', gap: 'var(--space-3)' }}>
      <DropdownMenu
        trigger={<Button variant="ghost">Checkbox</Button>}
        variant="checkbox"
        verticalPadding="12px"
        items={[
          { label: '로봇', checked: true },
          { label: '설비', checked: true },
          { label: '배차', captionContent: '캡션 텍스트' },
          { label: '이벤트' },
          { label: '저장된 검색' },
          { label: '비활성', disable: true },
        ]}
        menuActionArea
        onCancel={() => setResult('변경 취소')}
        onApply={() => setResult('선택 적용')}
        maxHeight={260}
        defaultOpen
      />
      <p aria-live="polite" style={{ margin: 0 }}>{result}</p>
    </div>
  );
}

export const DropdownMenuPatterns = {
  name: '개요',
  parameters: storyDescription(
    '기본 명령과 normal·radio·checkbox 변형, 긴 목록의 action area를 비교하는 상황입니다. active·checked·disabled·danger 의미가 구분되고 스크롤 안에서도 항목과 action 영역이 안정적인지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 980 }}>
      <Section title="기본 명령 메뉴">
        <div style={{ minHeight: 72 }}>
          <DropdownMenu
            trigger={<Button variant="ghost">항목 작업</Button>}
            items={[
              { label: '항목 복제', icon: <Icon name="document" size={16} /> },
              { label: '삭제', icon: <Icon name="trash" size={16} />, danger: true },
            ]}
          />
        </div>
      </Section>

      <Section title="변형, 스크롤, 액션 영역">
        <div style={{ minHeight: 360, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28, alignItems: 'start' }}>
          <div style={{ minHeight: 300 }}>
            <DropdownMenu trigger={<Button variant="ghost">Normal</Button>} items={menuItems} open />
          </div>
          <div style={{ minHeight: 300 }}>
            <DropdownMenu trigger={<Button variant="ghost">Radio</Button>} variant="radio" cellPadding="8px" verticalPadding="8px" items={[{ label: '최신순', checked: true }, { label: '오래된순' }, { label: '조회순' }]} open />
          </div>
          <CheckboxActionMenuPreview />
        </div>
      </Section>
    </main>
  ),
};

function DropdownMenuKeyboardDemo() {
  const [actionResult, setActionResult] = React.useState('작업 전');
  return (
    <main style={{ minHeight: 320, display: 'grid', alignContent: 'start', justifyItems: 'start', gap: 'var(--space-4)', padding: 24 }}>
      <DropdownMenu
        data-contract="keyboard"
        trigger={<Button variant="ghost">명령 메뉴</Button>}
        items={[
          { label: '열기' },
          { label: '사용 불가', disabled: true },
          { label: '복제' },
          { label: '삭제', danger: true },
        ]}
        menuActionArea
        onCancel={() => setActionResult('취소')}
        onApply={() => setActionResult('적용')}
      />
      <DropdownMenu
        data-contract="all-disabled"
        trigger={<Button variant="ghost">사용 불가 메뉴</Button>}
        items={[{ label: '사용할 수 없는 명령', disabled: true }]}
      />
      <p data-action-result aria-live="polite" style={{ margin: 0 }}>{actionResult}</p>
    </main>
  );
}

export const DropdownMenuKeyboardContract = {
  name: '상호작용 · 키보드 탐색',
  parameters: storyDescription(
    '키보드로 trigger에서 메뉴를 열고 disabled 항목을 건너뛰어 처음·마지막 명령으로 이동하는 상황입니다. Arrow·End·Escape가 예상 항목에 focus를 옮기고 닫힌 뒤 trigger로 복귀하는지 확인하세요.',
  ),
  render: () => <DropdownMenuKeyboardDemo />,
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    const dropdownTrigger = [...canvasElement.querySelectorAll('button')].find((button) => button.textContent?.trim() === '명령 메뉴');
    if (!dropdownTrigger) throw new Error('DropdownMenu keyboard story requires its trigger.');
    dropdownTrigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => {
      if (ownerDocument.activeElement?.textContent?.trim() !== '열기') throw new Error('DropdownMenu must focus its first item.');
    });
    const menu = canvasElement.querySelector('[role="menu"]');
    if (!menu || menu.getAttribute('aria-labelledby') !== dropdownTrigger.id) {
      throw new Error('DropdownMenu must label its menu from the trigger.');
    }
    await userEvent.keyboard('{ArrowDown}');
    if (ownerDocument.activeElement?.textContent?.trim() !== '복제') throw new Error('DropdownMenu must skip disabled items.');
    await userEvent.keyboard('{End}');
    if (ownerDocument.activeElement?.textContent?.trim() !== '삭제') throw new Error('DropdownMenu End must focus the last item.');
    await userEvent.tab();
    if (ownerDocument.activeElement?.textContent?.trim() !== '취소' || ownerDocument.activeElement.closest('[role="menu"]')) {
      throw new Error('DropdownMenu action area must be reachable outside menu semantics.');
    }
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (ownerDocument.activeElement !== dropdownTrigger) throw new Error('DropdownMenu must restore focus to its trigger.');
    });

    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => {
      if (ownerDocument.activeElement?.textContent?.trim() !== '열기') throw new Error('DropdownMenu must reopen at its first item.');
    });
    await userEvent.keyboard('{End}');
    await userEvent.tab();
    await userEvent.tab();
    if (ownerDocument.activeElement?.textContent?.trim() !== '적용') throw new Error('Apply must follow Cancel in the action area.');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      if (canvasElement.querySelector('[data-action-result]')?.textContent !== '적용') throw new Error('Apply must call onApply.');
      if (canvasElement.querySelector('[data-contract="keyboard"] [role="menu"]')) throw new Error('Apply must close the menu.');
      if (ownerDocument.activeElement !== dropdownTrigger) throw new Error('Apply must restore trigger focus.');
    });

    const allDisabled = canvasElement.querySelector('[data-contract="all-disabled"]');
    const allDisabledTrigger = allDisabled?.querySelector('[aria-haspopup="menu"]');
    if (!allDisabled || !allDisabledTrigger) throw new Error('All-disabled DropdownMenu target is required.');
    allDisabledTrigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => {
      if (!allDisabled.querySelector('[role="menu"]')) throw new Error('All-disabled DropdownMenu must open.');
      if (ownerDocument.activeElement !== allDisabledTrigger) throw new Error('All-disabled DropdownMenu must retain trigger focus.');
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (allDisabled.querySelector('[role="menu"]')) throw new Error('Trigger Escape must close an all-disabled DropdownMenu.');
      if (ownerDocument.activeElement !== allDisabledTrigger) throw new Error('Trigger Escape must preserve focus.');
    });
  },
};

export const DropdownMenuCard = { ...DropdownMenuCardStory, name: 'DropdownMenu card parity', tags: ['!dev', 'visual-parity'] };
