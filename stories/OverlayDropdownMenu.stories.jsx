import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import {
  Button,
  DropdownMenu,
  Icon,
  Table,
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

function menuControlledBy(trigger) {
  const menuId = trigger?.getAttribute('aria-controls');
  return menuId ? trigger.ownerDocument.getElementById(menuId) : null;
}

function openMenusControlledInside(container) {
  return [...container.querySelectorAll('[aria-haspopup="menu"][aria-expanded="true"][aria-controls]')]
    .map(menuControlledBy)
    .filter(Boolean);
}

const meta = {
  title: 'LDS Core/Components/Overlay/Dropdown Menu',
  tags: ['autodocs'],
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
        component: 'normal·radio·checkbox 항목과 action area·scroll·keyboard focus를 지원하는 LDS DropdownMenu 패턴입니다.',
      },
    },
  },
};

export default meta;

function Section({ title, children }) {
  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <h2 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--color-semantic-label-normal)' }}>{title}</h2>
      {children}
    </section>
  );
}

function CheckboxMenuPreview() {
  return (
    <div style={{ minHeight: 300 }}>
      <DropdownMenu
        trigger={<Button variant="ghost">Checkbox</Button>}
        variant="checkbox"
        items={[
          { label: '로봇', checked: true },
          { label: '설비', checked: true },
          { label: '배차', captionContent: '캡션 텍스트' },
          { label: '이벤트' },
          { label: '저장된 검색' },
          { label: '비활성', disable: true },
        ]}
        maxHeight={260}
        defaultOpen
      />
    </div>
  );
}

export const DropdownMenuPatterns = {
  name: '개요',
  parameters: storyDescription(
    '기본 명령과 normal·radio·checkbox 변형을 비교하는 상황입니다. active·checked·disabled·danger 의미가 구분되고 긴 목록의 스크롤에서도 항목 밀도가 안정적인지 확인하세요.',
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

      <Section title="변형과 스크롤">
        <div style={{ minHeight: 360, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-8)', alignItems: 'start' }}>
          <div style={{ minHeight: 300 }}>
            <DropdownMenu trigger={<Button variant="ghost">Normal</Button>} items={menuItems} open />
          </div>
          <div style={{ minHeight: 300 }}>
            <DropdownMenu trigger={<Button variant="ghost">Radio</Button>} variant="radio" items={[{ label: '최신순', checked: true }, { label: '오래된순' }, { label: '조회순' }]} open />
          </div>
          <CheckboxMenuPreview />
        </div>
      </Section>

    </main>
  ),
  play: async ({ canvasElement }) => {
    const menus = openMenusControlledInside(canvasElement);
    if (menus.length !== 3) throw new Error('DropdownMenu patterns must render all three open variants.');

    for (const menu of menus) {
      const panelStyle = getComputedStyle(menu.parentElement);
      if (panelStyle.paddingTop !== '8px' || panelStyle.paddingRight !== '8px') {
        throw new Error(`Every default DropdownMenu panel must use the shared 8px shell padding; received ${panelStyle.paddingTop}/${panelStyle.paddingRight}.`);
      }
      const singleLineItems = [...menu.querySelectorAll('[role^="menuitem"]')]
        .filter((item) => !item.querySelector('span > span + span'));
      if (singleLineItems.some((item) => {
        const style = getComputedStyle(item);
        return style.minHeight !== '40px'
          || style.fontSize !== '14px'
          || style.lineHeight !== '20px'
          || style.paddingLeft !== '16px';
      })) {
        throw new Error('Every default single-line DropdownMenu item must use the shared 14px/40px desktop density.');
      }
      const describedItems = [...menu.querySelectorAll('[role^="menuitem"]')]
        .filter((item) => item.querySelector('span > span + span'));
      if (describedItems.some((item) => item.scrollHeight > item.clientHeight)) {
        throw new Error('DropdownMenu items with descriptions must grow instead of overflowing their row.');
      }
    }

    const panelWidths = menus.map((menu) => menu.parentElement.getBoundingClientRect().width);
    if (panelWidths.some((width) => width < 175.5 || width > 320.5)) {
      throw new Error('Adaptive DropdownMenu panels must stay within the shared 176–320px bounds.');
    }
    if (Math.max(...panelWidths) - Math.min(...panelWidths) < 8) {
      throw new Error('Default DropdownMenu panels must adapt to content instead of sharing one fixed width.');
    }
    if (panelWidths[0] <= panelWidths[1]) {
      throw new Error('The described command menu must grow wider than the short radio menu.');
    }

    await waitFor(() => {
      const scrollingMenu = menus.find((menu) => menu.scrollHeight > menu.clientHeight);
      const scrollingItem = scrollingMenu?.querySelector('[role^="menuitem"]');
      if (!scrollingMenu || !scrollingItem) {
        throw new Error('DropdownMenu patterns must include a constrained scrolling menu.');
      }
      const scrollingStyle = getComputedStyle(scrollingMenu);
      const scrollbarStart = scrollingMenu.getBoundingClientRect().left + scrollingMenu.clientWidth;
      const scrollbarGap = scrollbarStart - scrollingItem.getBoundingClientRect().right;
      if (scrollingStyle.scrollbarGutter !== 'stable' || scrollingStyle.paddingRight !== '4px' || scrollbarGap < 3.5) {
        throw new Error('Scrollable DropdownMenu items must retain a stable 4px gap before the scrollbar.');
      }

      const nonScrollingMenus = menus.filter((menu) => menu.scrollHeight <= menu.clientHeight);
      const reservesUnusedGutter = nonScrollingMenus.some((menu) => {
        const menuStyle = getComputedStyle(menu);
        return menuStyle.scrollbarGutter !== 'auto' || menuStyle.paddingRight !== '0px';
      });
      if (reservesUnusedGutter) {
        throw new Error('DropdownMenu must not reserve scrollbar spacing when its items do not overflow.');
      }
    });

  },
};

export const DropdownMenuTableOverflowContract = {
  name: '계약 · 스크롤 컨테이너 탈출',
  tags: ['!dev'],
  render: () => (
    <main style={{ minHeight: 320, padding: 24 }}>
      <Table
        data-contract="dropdown-table-overflow"
        tableLabel="문서 목록"
        columns={[
          { key: 'name', label: '이름' },
          {
            key: 'actions',
            label: '작업',
            align: 'right',
            width: 96,
            render: () => (
              <DropdownMenu
                align="right"
                density="compact"
                trigger={<Button variant="ghost" size="sm">더보기</Button>}
                items={[{ label: '새 버전' }, { divider: true }, { label: '삭제', danger: true }]}
              />
            ),
          },
        ]}
        rows={[{ id: 'document-1', name: '문서 하나' }]}
        style={{ maxWidth: 520 }}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const tableScroller = canvasElement.querySelector('[data-contract="dropdown-table-overflow"]');
    if (!tableScroller) throw new Error('The clipped-container DropdownMenu contract requires a Table scroll container.');
    const tableTrigger = [...tableScroller.querySelectorAll('button')]
      .find((button) => button.textContent?.trim() === '더보기');
    if (!tableTrigger) throw new Error('The clipped-container DropdownMenu contract requires a table trigger.');
    const scrollHeightBefore = tableScroller.scrollHeight;
    await userEvent.click(tableTrigger);
    await waitFor(() => {
      const tableMenu = menuControlledBy(tableTrigger);
      if (!tableMenu) throw new Error('The table row action menu must open.');
      const panel = tableMenu.parentElement;
      if (!panel.matches('[data-dropdown-menu-portal]') || panel.parentElement !== tableScroller.ownerDocument.body) {
        throw new Error('The root DropdownMenu panel must portal to the owner document body.');
      }
      if (getComputedStyle(panel).position !== 'fixed' || getComputedStyle(panel).opacity !== '1') {
        throw new Error('The portalled root DropdownMenu panel must use a visible fixed position.');
      }
    });
    if (Math.abs(tableScroller.scrollHeight - scrollHeightBefore) > 1) {
      throw new Error('Opening a row action menu must not increase the Table scroll container height.');
    }
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (menuControlledBy(tableTrigger)) throw new Error('Escape must close the portalled row action menu.');
      if (tableTrigger.ownerDocument.activeElement !== tableTrigger) throw new Error('Escape must restore the row action trigger focus.');
    });
  },
};

function DropdownMenuKeyboardDemo() {
  return (
    <main style={{ minHeight: 320, display: 'grid', alignContent: 'start', justifyItems: 'start', gap: 'var(--space-4)', padding: 24 }}>
      <DropdownMenu
        data-contract="keyboard"
        trigger={<Button variant="ghost">명령 메뉴</Button>}
        items={[
          { label: '열기' },
          { label: '사용 불가', disabled: true },
          { label: '복제' },
          { label: '복사본 만들기' },
          { label: '삭제', danger: true },
        ]}
      />
      <DropdownMenu
        data-contract="multi-selection"
        trigger={<Button variant="ghost">다중 선택 메뉴</Button>}
        variant="checkbox"
        items={[
          { label: '로봇', checked: true },
          { label: '설비', checked: true },
          { label: '배차' },
        ]}
      />
      <DropdownMenu
        data-contract="all-disabled"
        trigger={<Button variant="ghost">사용 불가 메뉴</Button>}
        items={[{ label: '사용할 수 없는 명령', disabled: true }]}
      />
    </main>
  );
}

export const DropdownMenuKeyboardContract = {
  name: '상호작용 · 키보드 탐색',
  parameters: storyDescription(
    '명령과 체크 항목은 선택 즉시 반영합니다. Arrow·End·Tab·Escape가 항목 사이를 이동하고 메뉴를 닫은 뒤 다음 control 또는 trigger로 focus를 올바르게 옮기는지 확인하세요.',
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
    const menu = menuControlledBy(dropdownTrigger);
    if (!menu || menu.getAttribute('aria-labelledby') !== dropdownTrigger.id) {
      throw new Error('DropdownMenu must label its menu from the trigger.');
    }
    await userEvent.keyboard('{ArrowDown}');
    if (ownerDocument.activeElement?.textContent?.trim() !== '복제') throw new Error('DropdownMenu must skip disabled items.');
    await userEvent.keyboard('{End}');
    if (ownerDocument.activeElement?.textContent?.trim() !== '삭제') throw new Error('DropdownMenu End must focus the last item.');

    // APG typeahead: characters typed in one burst accumulate into a single
    // search string. "복" alone can only reach 복제; the second character has to
    // narrow the match to 복사본 만들기.
    const flushTypeahead = () => new Promise((resolve) => { setTimeout(resolve, 600); });
    await userEvent.keyboard('복사');
    await waitFor(() => {
      if (ownerDocument.activeElement?.textContent?.trim() !== '복사본 만들기') {
        throw new Error('Multi-character typeahead must narrow the match past the first 복 item.');
      }
    });
    // After the idle timeout the buffer starts over, so a single 복 matches again.
    await flushTypeahead();
    await userEvent.keyboard('복');
    await waitFor(() => {
      if (ownerDocument.activeElement?.textContent?.trim() !== '복제') {
        throw new Error('The typeahead buffer must reset after its timeout.');
      }
    });

    await userEvent.tab();
    const multiSelection = canvasElement.querySelector('[data-contract="multi-selection"]');
    const multiTrigger = multiSelection?.querySelector('[aria-haspopup="menu"]');
    if (!multiSelection || !multiTrigger || ownerDocument.activeElement !== multiTrigger) {
      throw new Error('Tab from an immediate command menu must close it and continue to the next control.');
    }
    await waitFor(() => {
      if (menuControlledBy(dropdownTrigger)) {
        throw new Error('Immediate command menu must close when Tab leaves it.');
      }
    });

    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => {
      if (ownerDocument.activeElement?.textContent?.trim() !== '로봇') {
        throw new Error('Multi-selection menu must focus its first item.');
      }
    });
    await userEvent.keyboard('{End}');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (menuControlledBy(multiTrigger)) throw new Error('Escape must close the multi-selection menu.');
      if (ownerDocument.activeElement !== multiTrigger) throw new Error('Escape must restore multi-selection trigger focus.');
    });

    const allDisabled = canvasElement.querySelector('[data-contract="all-disabled"]');
    const allDisabledTrigger = allDisabled?.querySelector('[aria-haspopup="menu"]');
    if (!allDisabled || !allDisabledTrigger) throw new Error('All-disabled DropdownMenu target is required.');
    allDisabledTrigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => {
      if (!menuControlledBy(allDisabledTrigger)) throw new Error('All-disabled DropdownMenu must open.');
      if (ownerDocument.activeElement !== allDisabledTrigger) throw new Error('All-disabled DropdownMenu must retain trigger focus.');
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (menuControlledBy(allDisabledTrigger)) throw new Error('Trigger Escape must close an all-disabled DropdownMenu.');
      if (ownerDocument.activeElement !== allDisabledTrigger) throw new Error('Trigger Escape must preserve focus.');
    });
  },
};

function NestedSubmenuDemo() {
  const [picked, setPicked] = React.useState('선택 전');
  return (
    <main style={{ minHeight: 360, display: 'grid', alignContent: 'start', justifyItems: 'start', gap: 'var(--space-4)', padding: 24 }}>
      <DropdownMenu
        data-contract="submenu"
        trigger={(
          <Button variant="ghost">
            문서 작업
            <Icon name="chevron-down-small" size={16} aria-hidden="true" />
          </Button>
        )}
        items={[
          { label: '이름 바꾸기' },
          {
            label: '내보내기',
            icon: <Icon name="document" size={16} />,
            items: [
              { label: 'PDF로 내보내기', onClick: () => setPicked('PDF') },
              { label: 'PNG로 내보내기', onClick: () => setPicked('PNG') },
              {
                label: '고급 형식',
                items: [
                  { label: 'SVG로 내보내기', onClick: () => setPicked('SVG') },
                  { label: 'CSV로 내보내기', onClick: () => setPicked('CSV') },
                ],
              },
            ],
          },
          { divider: true },
          { label: '삭제', icon: <Icon name="trash" size={16} />, danger: true },
        ]}
      />
      <p data-picked aria-live="polite" style={{ margin: 0 }}>{picked}</p>
    </main>
  );
}

export const NestedSubmenus = {
  name: '상호작용 · 중첩 서브메뉴',
  parameters: storyDescription(
    '항목에 하위 명령이 있을 때 서브메뉴로 계층을 표현하는 상황입니다. "내보내기"는 오른쪽 화살표·hover·클릭으로 펼쳐지고, 그 안의 "고급 형식"이 다시 서브메뉴를 엽니다. 오른쪽 화살표로 진입·왼쪽 화살표로 복귀하고, 하위 명령을 고르면 전체 메뉴가 닫히는지 확인하세요.',
  ),
  render: () => <NestedSubmenuDemo />,
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const trigger = [...canvasElement.querySelectorAll('button')].find((button) => button.textContent?.trim() === '문서 작업');
    if (!trigger) throw new Error('서브메뉴 스토리에는 트리거가 필요합니다.');

    trigger.focus();
    await userEvent.keyboard('{ArrowDown}'); // 열고 첫 항목(이름 바꾸기)
    await waitFor(() => {
      if (doc.activeElement?.textContent?.trim() !== '이름 바꾸기') throw new Error('메뉴가 열리면 첫 항목에 포커스해야 합니다.');
    });
    await userEvent.keyboard('{ArrowDown}'); // 내보내기(서브 트리거)로 이동
    let branchTrigger;
    await waitFor(() => {
      branchTrigger = doc.activeElement;
      if (branchTrigger?.getAttribute('aria-haspopup') !== 'menu' || branchTrigger.getAttribute('aria-expanded') !== 'false') {
        throw new Error('서브메뉴 트리거는 aria-haspopup="menu"와 닫힌 aria-expanded를 가져야 합니다.');
      }
    });

    await userEvent.keyboard('{ArrowRight}'); // 서브 열고 첫 항목 진입
    await waitFor(() => {
      if (branchTrigger.getAttribute('aria-expanded') !== 'true') throw new Error('오른쪽 화살표로 서브메뉴가 열려야 합니다.');
      if (doc.activeElement?.textContent?.trim() !== 'PDF로 내보내기') throw new Error('서브메뉴 진입 시 첫 항목에 포커스해야 합니다.');
    });
    // 서브메뉴는 <body>로 portal되므로 document 기준으로 조회합니다.
    const submenu = [...doc.querySelectorAll('[data-menu-portal] [role="menu"]')].find((menu) => menu.getAttribute('aria-label') === '내보내기');
    if (!submenu) throw new Error('서브메뉴는 트리거 라벨로 이름 붙은 role="menu"여야 합니다.');
    // 서브 트리거도 최상위 trigger와 같은 ARIA 3종을 갖습니다.
    if (!submenu.id || branchTrigger.getAttribute('aria-controls') !== submenu.id) {
      throw new Error('서브메뉴 트리거는 열린 패널을 aria-controls로 가리켜야 합니다.');
    }

    await userEvent.keyboard('{ArrowLeft}'); // 서브 닫고 트리거로 복귀
    await waitFor(() => {
      if (branchTrigger.getAttribute('aria-expanded') !== 'false') throw new Error('왼쪽 화살표로 서브메뉴가 닫혀야 합니다.');
      if (doc.activeElement !== branchTrigger) throw new Error('서브메뉴를 닫으면 부모 트리거로 포커스가 돌아와야 합니다.');
    });

    // 다시 열고 하위 항목 선택 → 전체 닫힘
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => {
      if (doc.activeElement?.textContent?.trim() !== 'PDF로 내보내기') throw new Error('서브메뉴가 다시 열려야 합니다.');
    });
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      if (canvasElement.querySelector('[data-picked]')?.textContent !== 'PDF') throw new Error('하위 명령 선택이 onClick을 호출해야 합니다.');
      if (doc.querySelector('[role="menu"]')) throw new Error('하위 명령 선택은 최상위·서브 메뉴를 모두 닫아야 합니다.');
      if (doc.activeElement !== trigger) throw new Error('선택 후 최상위 트리거로 포커스가 복귀해야 합니다.');
    });
  },
};

function DrillSubmenuDemo() {
  const [picked, setPicked] = React.useState('선택 전');
  return (
    <main style={{ minHeight: 360, display: 'grid', alignContent: 'start', justifyItems: 'start', gap: 'var(--space-4)', padding: 24 }}>
      <DropdownMenu
        data-contract="drill"
        submenuMode="drill"
        trigger={(
          <Button variant="ghost">
            문서 작업
            <Icon name="chevron-down-small" size={16} aria-hidden="true" />
          </Button>
        )}
        items={[
          { label: '이름 바꾸기' },
          {
            label: '내보내기',
            icon: <Icon name="document" size={16} />,
            items: [
              { label: 'PDF로 내보내기', onClick: () => setPicked('PDF') },
              { label: 'PNG로 내보내기', onClick: () => setPicked('PNG') },
              {
                label: '고급 형식',
                items: [
                  { label: 'SVG로 내보내기', onClick: () => setPicked('SVG') },
                ],
              },
            ],
          },
          { divider: true },
          { label: '삭제', icon: <Icon name="trash" size={16} />, danger: true },
        ]}
      />
      <p data-picked aria-live="polite" style={{ margin: 0 }}>{picked}</p>
    </main>
  );
}

export const DrillSubmenus = {
  name: '상호작용 · 드릴인 서브메뉴',
  parameters: storyDescription(
    '서브메뉴를 옆으로 펼치는 대신(flyout) 같은 패널이 하위 목록으로 전환되는 drill 모드입니다. 각 단계는 공통 176–320px 적응형 폭을 사용하고, 상단 뒤로 컨트롤·왼쪽 화살표로 상위에 복귀합니다. 하위 명령을 고르면 전체 메뉴가 닫히는지 확인하세요.',
  ),
  render: () => <DrillSubmenuDemo />,
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const trigger = [...canvasElement.querySelectorAll('button')].find((button) => button.textContent?.trim() === '문서 작업');
    if (!trigger) throw new Error('드릴인 스토리에는 트리거가 필요합니다.');
    if (!trigger.querySelector('svg')) throw new Error('텍스트 메뉴 트리거는 trailing disclosure chevron을 제공해야 합니다.');

    trigger.focus();
    await userEvent.keyboard('{ArrowDown}'); // 열고 첫 항목(이름 바꾸기)
    await waitFor(() => {
      if (doc.activeElement?.textContent?.trim() !== '이름 바꾸기') throw new Error('메뉴가 열리면 첫 항목에 포커스해야 합니다.');
    });
    await userEvent.keyboard('{ArrowDown}'); // 내보내기(서브 트리거)
    let branch;
    await waitFor(() => {
      branch = doc.activeElement;
      if (branch?.getAttribute('aria-haspopup') !== 'menu') throw new Error('내보내기는 서브메뉴 트리거여야 합니다.');
    });
    const rootMenu = menuControlledBy(trigger);
    const panelWidthBefore = rootMenu?.parentElement?.getBoundingClientRect().width;

    await userEvent.keyboard('{ArrowRight}'); // 하위 목록으로 drill in (같은 패널 전환)
    await waitFor(() => {
      if (doc.activeElement?.textContent?.trim() !== 'PDF로 내보내기') throw new Error('drill in 후 하위 첫 항목에 포커스해야 합니다.');
    });
    // flyout과 달리 서브는 별도 패널(portal)이 아니라 같은 메뉴 안이어야 합니다.
    if (doc.querySelector('[data-submenu-portal]')) throw new Error('drill 모드는 별도 서브 패널을 띄우지 않아야 합니다.');
    const back = rootMenu.querySelector('button[aria-label^="뒤로"]');
    if (!back) throw new Error('drill 하위 레벨에는 뒤로 컨트롤이 있어야 합니다.');
    // 뒤로 컨트롤은 role="menu"의 직계 자식이므로 menuitem 계열 role을 가져야 하고
    // (ARIA required children), roving 대상에 포함되어 키보드로 도달할 수 있어야 합니다.
    if (back.getAttribute('role') !== 'menuitem') {
      throw new Error('drill 뒤로 컨트롤은 role="menuitem"이어야 합니다.');
    }
    const backStyle = getComputedStyle(back);
    if (
      backStyle.minHeight !== '40px'
      || backStyle.fontSize !== '14px'
      || backStyle.lineHeight !== '20px'
      || backStyle.fontWeight !== '600'
      || backStyle.paddingLeft !== '16px'
      || backStyle.marginBottom !== '0px'
      || Number.parseFloat(backStyle.borderBottomWidth) < 0.5
    ) {
      throw new Error('drill 뒤로 행은 14px/40px 위계와 한 줄 divider만 사용해야 합니다.');
    }
    const drillMenu = menuControlledBy(trigger);
    const nonMenuChildren = [...drillMenu.children].filter((child) => {
      const role = child.getAttribute('role');
      return role !== 'menuitem' && role !== 'menuitemradio' && role !== 'menuitemcheckbox' && role !== 'separator' && role !== 'none' && role !== 'presentation' && role !== 'group';
    });
    if (nonMenuChildren.length > 0) {
      throw new Error('role="menu"의 직계 자식은 모두 menuitem 계열이어야 합니다.');
    }
    const panelWidthAfter = drillMenu?.parentElement?.getBoundingClientRect().width;
    if (
      panelWidthBefore < 175.5 || panelWidthBefore > 320.5
      || panelWidthAfter < 175.5 || panelWidthAfter > 320.5
    ) {
      throw new Error('drill의 각 단계도 176–320px 적응형 폭 규약을 지켜야 합니다.');
    }

    // Arrow Up으로 뒤로 컨트롤에 도달(포인터 전용이 아님) 후 다시 첫 명령으로 복귀합니다.
    await userEvent.keyboard('{ArrowUp}');
    await waitFor(() => {
      if (doc.activeElement !== back) throw new Error('Arrow Up으로 뒤로 컨트롤에 도달할 수 있어야 합니다.');
    });
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => {
      if (doc.activeElement?.textContent?.trim() !== 'PDF로 내보내기') throw new Error('뒤로 컨트롤에서 Arrow Down으로 첫 명령에 돌아와야 합니다.');
    });

    await userEvent.keyboard('{ArrowLeft}'); // 상위로 복귀
    await waitFor(() => {
      if (menuControlledBy(trigger)?.querySelector('button[aria-label^="뒤로"]')) throw new Error('왼쪽 화살표로 상위 레벨에 복귀해야 합니다.');
      // roving 엔진이 상위 첫 항목에 포커스를 되돌린 뒤에만 키 입력을 이어간다
      // (포커스 정착 전에 ArrowDown을 보내면 재진입이 레이스로 실패한다).
      if (doc.activeElement?.textContent?.trim() !== '이름 바꾸기') throw new Error('drill 복귀 후 상위 첫 항목에 포커스해야 합니다.');
    });

    await userEvent.keyboard('{ArrowDown}'); // 내보내기로 다시 이동
    await userEvent.keyboard('{ArrowRight}'); // drill in
    await waitFor(() => {
      if (doc.activeElement?.textContent?.trim() !== 'PDF로 내보내기') throw new Error('다시 drill in 되어야 합니다.');
    });
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      if (canvasElement.querySelector('[data-picked]')?.textContent !== 'PDF') throw new Error('하위 명령 선택이 onClick을 호출해야 합니다.');
      if (menuControlledBy(trigger)) throw new Error('하위 명령 선택은 전체 메뉴를 닫아야 합니다.');
    });
  },
};

export const DropdownMenuCard = { ...DropdownMenuCardStory, name: 'DropdownMenu card parity', tags: ['!dev', 'visual-parity'] };
