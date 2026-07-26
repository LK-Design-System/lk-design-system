import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Menubar } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

// userEvent dispatches a single keydown; under CI load the ArrowDown can land
// before focus settles on the trigger and be dropped, and a plain waitFor only
// re-reads the DOM — it never re-fires the key, so the submenu never opens and
// the wait times out (flaky "submenu must open"). Retry focus+ArrowDown until a
// [role="menu"] appears in the scoped container, then stop firing so later focus
// and close assertions see exactly one open. Re-fires only while the menu is
// absent, so the happy path fires exactly once.
async function openSubmenu(trigger, container, message) {
  let lastError;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    try {
      await waitFor(
        () => {
          if (!container.querySelector('[role="menu"]')) throw new Error(message);
        },
        { timeout: 700 },
      );
      return;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

const menuItems = [
  { label: '프로필 열기', shortcut: 'Enter', active: true },
  { label: '공유', description: '협업자에게 링크를 복사합니다', shortcut: 'S' },
  { divider: true },
  { label: '비활성 항목', disabled: true },
  { label: '삭제', danger: true, shortcut: 'Del' },
];

const meta = {
  title: 'LDS Product/Navigation/Menubar',
  tags: ['autodocs'],
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
    await openSubmenu(topItems[1], menubar, 'Menubar ArrowDown must open the active submenu.');
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

    await openSubmenu(topItems[1], menubar, 'Menubar must reopen at its first item.');
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

    await openSubmenu(topItems[3], menubar, 'All-disabled Menubar submenu must open.');
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
    await openSubmenu(edgeTrigger, edgeMenubar, 'Viewport-edge Menubar submenu must open.');
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

function MenubarNestedDemo() {
  const [picked, setPicked] = React.useState('선택 전');
  return (
    <main style={{ minHeight: 360, display: 'grid', alignContent: 'start', justifyItems: 'start', gap: 'var(--space-4)', padding: 24 }}>
      <Menubar
        data-testid="nested-bar"
        menus={[
          {
            label: '파일',
            items: [
              { label: '새로 만들기' },
              {
                label: '내보내기',
                items: [
                  { label: 'PDF로 내보내기', onClick: () => setPicked('PDF') },
                  {
                    label: '고급 형식',
                    items: [{ label: 'SVG로 내보내기', onClick: () => setPicked('SVG') }],
                  },
                ],
              },
            ],
          },
        ]}
      />
      <p data-picked aria-live="polite" style={{ margin: 0 }}>{picked}</p>
    </main>
  );
}

function MenubarDrillDemo() {
  const [picked, setPicked] = React.useState('선택 전');
  return (
    <main style={{ minHeight: 360, display: 'grid', alignContent: 'start', justifyItems: 'start', gap: 'var(--space-4)', padding: 24 }}>
      <Menubar
        data-testid="drill-bar"
        submenuMode="drill"
        menus={[
          {
            label: '파일',
            items: [
              { label: '새로 만들기' },
              {
                label: '내보내기',
                items: [
                  { label: 'PDF로 내보내기', onClick: () => setPicked('PDF') },
                  { label: '고급 형식', items: [{ label: 'SVG로 내보내기', onClick: () => setPicked('SVG') }] },
                ],
              },
            ],
          },
        ]}
      />
      <p data-picked aria-live="polite" style={{ margin: 0 }}>{picked}</p>
    </main>
  );
}

export const DrillSubmenus = {
  name: '상호작용 · 드릴인 서브메뉴',
  parameters: storyDescription(
    'Menubar 드롭다운에서 서브메뉴를 옆으로 펼치는 대신 같은 패널이 하위 목록으로 전환되는 drill 모드입니다. 폭이 고정되어 깊은 계층에서도 가로로 늘어나지 않고, 상단 뒤로 컨트롤·왼쪽 화살표로 상위에 복귀합니다.',
  ),
  render: () => <MenubarDrillDemo />,
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const bar = canvasElement.querySelector('[data-testid="drill-bar"]');
    const fileTrigger = bar?.querySelector('[role="menuitem"]');
    if (!fileTrigger) throw new Error('drill Menubar 스토리에는 최상위 트리거가 필요합니다.');

    await openSubmenu(fileTrigger, bar, '파일 메뉴가 열려야 합니다.');
    await waitFor(() => {
      if (doc.activeElement?.textContent?.trim() !== '새로 만들기') throw new Error('메뉴가 열리면 첫 항목에 포커스해야 합니다.');
    });
    await userEvent.keyboard('{ArrowDown}'); // 내보내기(서브 트리거)
    let branch;
    await waitFor(() => {
      branch = doc.activeElement;
      if (branch?.getAttribute('aria-haspopup') !== 'menu') throw new Error('내보내기는 서브메뉴 트리거여야 합니다.');
      if (branch.getAttribute('aria-expanded') !== 'false') throw new Error('drill 서브메뉴 트리거는 flyout처럼 aria-expanded를 노출해야 합니다.');
    });
    const widthBefore = bar.querySelector('[role="menu"]')?.getBoundingClientRect().width;

    await userEvent.keyboard('{ArrowRight}'); // drill in (같은 패널 전환)
    await waitFor(() => {
      if (doc.activeElement?.textContent?.trim() !== 'PDF로 내보내기') throw new Error('drill in 후 하위 첫 항목에 포커스해야 합니다.');
    });
    if (doc.querySelector('[data-menu-portal]')) throw new Error('drill 모드는 별도 서브 패널을 띄우지 않아야 합니다.');
    const backControl = bar.querySelector('button[aria-label^="뒤로"]');
    if (!backControl) throw new Error('drill 하위 레벨에는 뒤로 컨트롤이 있어야 합니다.');
    if (backControl.getAttribute('role') !== 'menuitem' || backControl.closest('[role="menu"]') !== bar.querySelector('[role="menu"]')) {
      throw new Error('drill 뒤로 컨트롤은 menu 안의 role="menuitem"이어야 합니다.');
    }
    const widthAfter = bar.querySelector('[role="menu"]')?.getBoundingClientRect().width;
    if (Math.abs(widthAfter - widthBefore) > 1) throw new Error('drill 전환은 패널 폭을 늘리지 않아야 합니다.');

    await userEvent.keyboard('{ArrowUp}'); // 첫 명령 위로 순회
    await waitFor(() => {
      if (doc.activeElement !== backControl) throw new Error('뒤로 컨트롤은 다른 항목처럼 화살표 roving 탐색으로 도달해야 합니다.');
    });
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => {
      if (doc.activeElement?.textContent?.trim() !== 'PDF로 내보내기') throw new Error('뒤로 컨트롤에서 아래 화살표로 첫 명령에 복귀해야 합니다.');
    });

    await userEvent.keyboard('{ArrowLeft}'); // 상위 복귀
    await waitFor(() => {
      if (bar.querySelector('button[aria-label^="뒤로"]')) throw new Error('왼쪽 화살표로 상위 레벨에 복귀해야 합니다.');
    });
  },
};

export const NestedSubmenus = {
  name: '상호작용 · 중첩 서브메뉴',
  parameters: storyDescription(
    '메뉴 항목에 하위 명령이 있을 때 서브메뉴로 계층을 표현하는 상황입니다. "내보내기"가 오른쪽 화살표·hover로 펼쳐지고 "고급 형식"이 다시 서브메뉴를 엽니다. 오른쪽 화살표로 진입·왼쪽 화살표로 복귀하고, 하위 명령을 고르면 전체 메뉴가 닫히는지 확인하세요.',
  ),
  render: () => <MenubarNestedDemo />,
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const bar = canvasElement.querySelector('[data-testid="nested-bar"]');
    const fileTrigger = bar?.querySelector('[role="menuitem"]');
    if (!fileTrigger) throw new Error('Menubar 서브메뉴 스토리에는 최상위 트리거가 필요합니다.');

    await openSubmenu(fileTrigger, bar, '파일 메뉴가 열려야 합니다.');
    await waitFor(() => {
      if (doc.activeElement?.textContent?.trim() !== '새로 만들기') throw new Error('메뉴가 열리면 첫 항목에 포커스해야 합니다.');
    });
    await userEvent.keyboard('{ArrowDown}'); // 새로 만들기 → 내보내기(서브 트리거)
    let branchTrigger;
    await waitFor(() => {
      branchTrigger = doc.activeElement;
      if (branchTrigger?.getAttribute('aria-haspopup') !== 'menu' || branchTrigger.getAttribute('aria-expanded') !== 'false') {
        throw new Error('내보내기는 닫힌 서브메뉴 트리거(aria-haspopup="menu")여야 합니다.');
      }
    });

    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => {
      if (branchTrigger.getAttribute('aria-expanded') !== 'true') throw new Error('오른쪽 화살표로 서브메뉴가 열려야 합니다.');
      if (doc.activeElement?.textContent?.trim() !== 'PDF로 내보내기') throw new Error('서브 진입 시 첫 항목에 포커스해야 합니다.');
    });
    const submenu = [...doc.querySelectorAll('[data-menu-portal] [role="menu"]')].find((menu) => menu.getAttribute('aria-label') === '내보내기');
    if (!submenu) throw new Error('서브메뉴는 트리거 라벨로 이름 붙은 role="menu"여야 합니다.');

    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => {
      if (branchTrigger.getAttribute('aria-expanded') !== 'false') throw new Error('왼쪽 화살표로 서브메뉴가 닫혀야 합니다.');
      if (doc.activeElement !== branchTrigger) throw new Error('서브메뉴를 닫으면 부모 트리거로 포커스가 복귀해야 합니다.');
    });

    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => {
      if (doc.activeElement?.textContent?.trim() !== 'PDF로 내보내기') throw new Error('서브메뉴가 다시 열려야 합니다.');
    });
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      if (canvasElement.querySelector('[data-picked]')?.textContent !== 'PDF') throw new Error('하위 명령 선택이 onClick을 호출해야 합니다.');
      if (doc.querySelector('[role="menu"]')) throw new Error('하위 명령 선택은 최상위·서브 메뉴를 모두 닫아야 합니다.');
    });
  },
};
