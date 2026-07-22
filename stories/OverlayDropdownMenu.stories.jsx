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

function NestedSubmenuDemo() {
  const [picked, setPicked] = React.useState('선택 전');
  return (
    <main style={{ minHeight: 360, display: 'grid', alignContent: 'start', justifyItems: 'start', gap: 'var(--space-4)', padding: 24 }}>
      <DropdownMenu
        data-contract="submenu"
        trigger={<Button variant="ghost">문서 작업</Button>}
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
    await userEvent.keyboard('{ArrowDown}'); // 내보내기(서브 트리거)로 이동
    const branchTrigger = doc.activeElement;
    if (branchTrigger.getAttribute('aria-haspopup') !== 'menu' || branchTrigger.getAttribute('aria-expanded') !== 'false') {
      throw new Error('서브메뉴 트리거는 aria-haspopup="menu"와 닫힌 aria-expanded를 가져야 합니다.');
    }

    await userEvent.keyboard('{ArrowRight}'); // 서브 열고 첫 항목 진입
    await waitFor(() => {
      if (branchTrigger.getAttribute('aria-expanded') !== 'true') throw new Error('오른쪽 화살표로 서브메뉴가 열려야 합니다.');
      if (doc.activeElement?.textContent?.trim() !== 'PDF로 내보내기') throw new Error('서브메뉴 진입 시 첫 항목에 포커스해야 합니다.');
    });
    // 서브메뉴는 <body>로 portal되므로 document 기준으로 조회합니다.
    const submenu = [...doc.querySelectorAll('[data-menu-portal] [role="menu"]')].find((menu) => menu.getAttribute('aria-label') === '내보내기');
    if (!submenu) throw new Error('서브메뉴는 트리거 라벨로 이름 붙은 role="menu"여야 합니다.');

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
        trigger={<Button variant="ghost">문서 작업</Button>}
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
    '서브메뉴를 옆으로 펼치는 대신(flyout) 같은 패널이 하위 목록으로 전환되는 drill 모드입니다. 폭이 고정되어 깊은 계층에서도 가로로 늘어나지 않고, 상단 뒤로 컨트롤·왼쪽 화살표로 상위에 복귀합니다. 하위 명령을 고르면 전체 메뉴가 닫히는지 확인하세요.',
  ),
  render: () => <DrillSubmenuDemo />,
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const trigger = [...canvasElement.querySelectorAll('button')].find((button) => button.textContent?.trim() === '문서 작업');
    if (!trigger) throw new Error('드릴인 스토리에는 트리거가 필요합니다.');

    trigger.focus();
    await userEvent.keyboard('{ArrowDown}'); // 열고 첫 항목(이름 바꾸기)
    await waitFor(() => {
      if (doc.activeElement?.textContent?.trim() !== '이름 바꾸기') throw new Error('메뉴가 열리면 첫 항목에 포커스해야 합니다.');
    });
    await userEvent.keyboard('{ArrowDown}'); // 내보내기(서브 트리거)
    const branch = doc.activeElement;
    if (branch.getAttribute('aria-haspopup') !== 'menu') throw new Error('내보내기는 서브메뉴 트리거여야 합니다.');
    const panelWidthBefore = canvasElement.querySelector('[data-contract="drill"] [role="menu"]')?.getBoundingClientRect().width;

    await userEvent.keyboard('{ArrowRight}'); // 하위 목록으로 drill in (같은 패널 전환)
    await waitFor(() => {
      if (doc.activeElement?.textContent?.trim() !== 'PDF로 내보내기') throw new Error('drill in 후 하위 첫 항목에 포커스해야 합니다.');
    });
    // flyout과 달리 서브는 별도 패널(portal)이 아니라 같은 메뉴 안이어야 합니다.
    if (doc.querySelector('[data-menu-portal]')) throw new Error('drill 모드는 별도 서브 패널을 띄우지 않아야 합니다.');
    const back = canvasElement.querySelector('[data-contract="drill"] button[aria-label^="뒤로"]');
    if (!back) throw new Error('drill 하위 레벨에는 뒤로 컨트롤이 있어야 합니다.');
    const panelWidthAfter = canvasElement.querySelector('[data-contract="drill"] [role="menu"]')?.getBoundingClientRect().width;
    if (Math.abs(panelWidthAfter - panelWidthBefore) > 1) throw new Error('drill 전환은 패널 폭을 늘리지 않아야 합니다.');

    await userEvent.keyboard('{ArrowLeft}'); // 상위로 복귀
    await waitFor(() => {
      if (canvasElement.querySelector('[data-contract="drill"] button[aria-label^="뒤로"]')) throw new Error('왼쪽 화살표로 상위 레벨에 복귀해야 합니다.');
    });

    await userEvent.keyboard('{ArrowDown}'); // 내보내기로 다시 이동
    await userEvent.keyboard('{ArrowRight}'); // drill in
    await waitFor(() => {
      if (doc.activeElement?.textContent?.trim() !== 'PDF로 내보내기') throw new Error('다시 drill in 되어야 합니다.');
    });
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      if (canvasElement.querySelector('[data-picked]')?.textContent !== 'PDF') throw new Error('하위 명령 선택이 onClick을 호출해야 합니다.');
      if (canvasElement.querySelector('[data-contract="drill"] [role="menu"]')) throw new Error('하위 명령 선택은 전체 메뉴를 닫아야 합니다.');
    });
  },
};

export const DropdownMenuCard = { ...DropdownMenuCardStory, name: 'DropdownMenu card parity', tags: ['!dev', 'visual-parity'] };
