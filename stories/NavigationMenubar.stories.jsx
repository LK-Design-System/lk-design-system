import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Menubar } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const menuItems = [
  { label: '프로필 열기', shortcut: 'Enter', active: true },
  { label: '공유', description: '협업자에게 링크를 복사합니다', shortcut: 'S' },
  { divider: true },
  { label: '비활성 항목', disabled: true },
  { label: '삭제', danger: true, shortcut: 'Del' },
];

const meta = {
  title: 'LDS Product/Navigation/Menubar',
  component: Menubar,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-navigation-menubar--menubar-patterns',
      eyebrow: 'Product / Menubar',
      title: '사용자가 앱 수준의 명령 그룹을 가로 메뉴에서 탐색합니다',
      description:
        '파일·보기·도움말처럼 여러 command group을 항상 보이는 상단 메뉴로 제공할 때 적합합니다. 한 trigger에만 관련된 짧은 명령이나 화면 이동에는 Menubar 대신 Dropdown Menu 또는 Top Bar를 사용하세요.',
    },
    docs: {
      description: {
        component: '여러 command group과 submenu를 가로 방향 keyboard navigation으로 연결하는 LK Product Menubar입니다.',
      },
    },
  },
};

export default meta;

function MenubarPatternsDemo() {
  const [result, setResult] = React.useState('필터 변경 전');
  return (
    <main style={{ minHeight: 300, display: 'grid', alignContent: 'start', justifyItems: 'start', gap: 'var(--space-3)', width: '100%', maxWidth: 920, padding: 24 }}>
      <Menubar
        menus={[
          {
            label: '파일',
            items: menuItems,
            menuActionArea: true,
            onCancel: () => setResult('파일 설정 취소'),
            onApply: () => setResult('파일 설정 적용'),
          },
          { label: '보기', variant: 'radio', items: [{ label: '목록', checked: true }, { label: '그리드' }, { label: '미리보기', disabled: true }] },
          { label: '필터', variant: 'checkbox', items: [{ label: '진행 중', checked: true }, { label: '내 담당', checked: true }, { label: '보관됨' }] },
        ]}
        maxHeight={180}
      />
      <p aria-live="polite" style={{ margin: 0 }}>{result}</p>
    </main>
  );
}

export const MenubarPatterns = {
  name: '개요',
  parameters: storyDescription(
    '파일·보기·필터 command group을 normal·radio·checkbox submenu로 제공하는 상황입니다. top-level 그룹과 submenu의 선택·disabled·danger 상태가 구분되고 긴 목록이 안전하게 스크롤되는지 확인하세요.',
  ),
  render: () => <MenubarPatternsDemo />,
};

function MenubarKeyboardDemo() {
  const [actionResult, setActionResult] = React.useState('작업 전');
  return (
    <main style={{ minHeight: 320, display: 'grid', alignContent: 'start', justifyItems: 'start', gap: 'var(--space-4)', padding: 24 }}>
      <Menubar
        data-contract="keyboard"
        menus={[
          { label: '파일', items: [{ label: '새 파일' }, { label: '열기' }] },
          {
            label: '보기',
            items: [{ label: '목록' }, { label: '그리드' }],
            menuActionArea: true,
            onCancel: () => setActionResult('취소'),
            onApply: () => setActionResult('적용'),
          },
          { label: '도움말', items: [{ label: '문서' }, { label: '지원' }] },
          { label: '사용 불가', items: [{ label: '사용할 수 없는 명령', disabled: true }] },
        ]}
      />
      <p data-action-result aria-live="polite" style={{ margin: 0 }}>{actionResult}</p>
      <div style={{ position: 'fixed', right: 0, bottom: 0 }}>
        <Menubar
          data-contract="viewport-edge"
          menus={[
            {
              label: '가장자리',
              items: [
                { label: '긴 이름의 첫 번째 가장자리 명령' },
                { label: '긴 이름의 두 번째 가장자리 명령' },
              ],
            },
          ]}
        />
      </div>
    </main>
  );
}

export const MenubarKeyboardContract = {
  name: '상호작용 · 키보드 탐색',
  parameters: storyDescription(
    '키보드로 top-level command group 사이를 이동하고 활성 submenu의 항목을 탐색하는 상황입니다. ArrowRight·ArrowDown·Escape가 올바른 메뉴와 항목으로 focus를 이동·복귀하는지 확인하세요.',
  ),
  render: () => <MenubarKeyboardDemo />,
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    const menubar = canvasElement.querySelector('[data-contract="keyboard"]');
    if (!menubar) throw new Error('Menubar keyboard story requires a menubar.');
    const topItems = [...menubar.querySelectorAll(':scope > [role="none"] > [role="menuitem"]')];
    if (topItems.length < 2) throw new Error('Menubar keyboard story requires at least two top-level items.');
    topItems[0].focus();
    await userEvent.keyboard('{ArrowRight}');
    if (ownerDocument.activeElement !== topItems[1]) throw new Error('Menubar ArrowRight must move top-level focus.');
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => {
      if (ownerDocument.activeElement?.textContent?.trim() !== '목록') throw new Error('Menubar ArrowDown must open the active submenu.');
    });
    const submenu = menubar.querySelector('[role="menu"]');
    if (!submenu || submenu.getAttribute('aria-labelledby') !== topItems[1].id) {
      throw new Error('Menubar submenu must be labelled by its top-level item.');
    }
    await userEvent.keyboard('{ArrowDown}');
    if (ownerDocument.activeElement?.textContent?.trim() !== '그리드') throw new Error('Menubar submenu ArrowDown must move focus.');
    await userEvent.tab();
    if (ownerDocument.activeElement?.textContent?.trim() !== '취소' || ownerDocument.activeElement.closest('[role="menu"]')) {
      throw new Error('Menubar action area must be keyboard reachable outside menu semantics.');
    }
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (ownerDocument.activeElement !== topItems[1]) throw new Error('Menubar Escape must restore focus to its top-level item.');
    });

    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => {
      if (ownerDocument.activeElement?.textContent?.trim() !== '목록') throw new Error('Menubar must reopen at its first item.');
    });
    await userEvent.keyboard('{End}');
    await userEvent.tab();
    await userEvent.tab();
    if (ownerDocument.activeElement?.textContent?.trim() !== '적용') throw new Error('Apply must follow Cancel in the action area.');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      if (canvasElement.querySelector('[data-action-result]')?.textContent !== '적용') throw new Error('Menubar Apply must call onApply.');
      if (menubar.querySelector('[role="menu"]')) throw new Error('Menubar Apply must close the submenu.');
      if (ownerDocument.activeElement !== topItems[1]) throw new Error('Menubar Apply must restore top-level focus.');
    });

    topItems[3].focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => {
      if (!menubar.querySelector('[role="menu"]')) throw new Error('All-disabled Menubar submenu must open.');
      if (ownerDocument.activeElement !== topItems[3]) throw new Error('All-disabled Menubar submenu must retain trigger focus.');
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (menubar.querySelector('[role="menu"]')) throw new Error('Trigger Escape must close an all-disabled Menubar submenu.');
      if (ownerDocument.activeElement !== topItems[3]) throw new Error('Trigger Escape must preserve top-level focus.');
    });

    const edgeMenubar = canvasElement.querySelector('[data-contract="viewport-edge"]');
    const edgeTrigger = edgeMenubar?.querySelector('[role="menuitem"]');
    if (!edgeMenubar || !edgeTrigger) throw new Error('Viewport-edge Menubar contract target is required.');
    edgeTrigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    const edgeMenu = await waitFor(() => {
      const openedMenu = edgeMenubar.querySelector('[role="menu"]');
      const panel = openedMenu?.parentElement;
      if (!openedMenu || !panel) throw new Error('Viewport-edge Menubar submenu must open.');
      if (panel.dataset.placement !== 'top') throw new Error('A bottom-edge Menubar submenu must flip above its trigger.');
      return panel;
    });
    const view = ownerDocument.defaultView;
    await waitFor(() => {
      const rect = edgeMenu.getBoundingClientRect();
      if (rect.left < 15 || rect.right > view.innerWidth - 15) {
        throw new Error('Menubar submenu must remain within 16px viewport padding.');
      }
      if (ownerDocument.documentElement.scrollWidth > view.innerWidth + 1) {
        throw new Error('Menubar must not create horizontal viewport scrolling.');
      }
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (edgeMenubar.querySelector('[role="menu"]')) throw new Error('Viewport-edge Menubar submenu must close with Escape.');
    });
  },
};
