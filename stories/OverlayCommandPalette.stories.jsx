import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Button, CommandPalette } from '../src/index.js';
import {
  CommandPaletteCard as CommandPaletteCardStory,
  CommandPaletteOpen as CommandPaletteOpenStory,
} from './Overlay.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Overlay/Command Palette',
  parameters: {
    storyGuide: {
      storyId: 'lds-product-overlay-command-palette--command-palette-open',
      eyebrow: 'Product / Command Palette',
      title: '사용자가 키보드로 명령을 검색하고 현재 작업을 빠르게 전환합니다',
      description:
        '명령과 이동 대상이 많고 이름으로 찾아 실행하는 숙련 사용자 흐름에 적합합니다. 선택지가 적거나 항상 보여야 하는 핵심 액션에는 CommandPalette 대신 Button, Menu 또는 명시적인 탐색을 사용하세요.',
    },
    docs: {
      description: {
        component: '키보드 중심 명령 검색과 빠른 이동을 제공하는 CommandPalette 패턴입니다.',
      },
    },
  },
};

export default meta;

export const CommandPaletteOpen = {
  ...CommandPaletteOpenStory,
  name: '개요',
  parameters: {
    ...CommandPaletteOpenStory.parameters,
    ...storyDescription(
      '명령 검색 표면이 열린 대표 상태입니다. 검색 입력, 결과 목록, 현재 선택, 실행 힌트가 한 흐름으로 읽히고 배경 작업과 분리되는지 확인하세요.',
    ),
  },
};

function CommandPaletteKeyboardDemo() {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState('없음');
  return (
    <div style={{ minHeight: 260, display: 'grid', placeItems: 'center', gap: 12 }}>
      <Button onClick={() => setOpen(true)}>명령 팔레트 열기</Button>
      <span data-selected-command>{selected}</span>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        commands={[
          { label: '제품 보기', onSelect: () => setSelected('제품 보기') },
          { label: '설정 열기', onSelect: () => setSelected('설정 열기') },
          { label: '도움말', onSelect: () => setSelected('도움말') },
        ]}
      />
    </div>
  );
}

export const CommandPaletteKeyboardContract = {
  name: '상호작용 · 키보드 탐색',
  parameters: storyDescription(
    '키보드만으로 팔레트를 열고 결과를 이동해 명령을 실행하는 상황입니다. 검색 필드 초기 초점, Arrow 이동, Enter 실행, 닫힌 뒤 트리거로의 초점 복원을 확인하세요.',
  ),
  render: () => <CommandPaletteKeyboardDemo />,
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    const trigger = [...canvasElement.querySelectorAll('button')].find((button) => button.textContent?.trim() === '명령 팔레트 열기');
    await userEvent.click(trigger);
    await waitFor(() => {
      if (ownerDocument.activeElement?.getAttribute('role') !== 'combobox') throw new Error('CommandPalette must focus its search field.');
    });
    await userEvent.tab();
    if (ownerDocument.activeElement?.getAttribute('role') !== 'combobox') throw new Error('CommandPalette Tab must remain inside the modal.');
    await userEvent.keyboard('{ArrowDown}');
    const activeId = ownerDocument.activeElement?.getAttribute('aria-activedescendant');
    if (!activeId || ownerDocument.getElementById(activeId)?.textContent?.trim() !== '설정 열기') throw new Error('ArrowDown must move the active command.');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      if (canvasElement.querySelector('[role="dialog"]')) throw new Error('CommandPalette must close after command execution.');
      if (canvasElement.querySelector('[data-selected-command]')?.textContent !== '설정 열기') throw new Error('Enter must execute the active command.');
      if (ownerDocument.activeElement !== trigger) throw new Error('CommandPalette must restore focus to its trigger.');
    });
  },
};
const manyCommands = [
  { label: '설정 열기' },
  ...Array.from({ length: 19 }, (_, i) => ({ label: `명령 ${i + 1}` })),
];

function CommandPaletteFilterDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ minHeight: 260, display: 'grid', placeItems: 'center' }}>
      <Button onClick={() => setOpen(true)}>명령 검색 열기</Button>
      <CommandPalette open={open} onClose={() => setOpen(false)} commands={manyCommands} />
    </div>
  );
}

export const CommandPaletteFilterContract = {
  name: '결과 알림과 Escape 레이어 계약',
  tags: ['!dev'],
  render: () => <CommandPaletteFilterDemo />,
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    const trigger = [...canvasElement.querySelectorAll('button')].find((button) => button.textContent?.trim() === '명령 검색 열기');
    if (!trigger) throw new Error('CommandPalette 계약 스토리에는 트리거가 필요합니다.');
    await userEvent.click(trigger);
    const input = await waitFor(() => {
      const current = canvasElement.querySelector('[role="combobox"]');
      if (!current || ownerDocument.activeElement !== current) throw new Error('CommandPalette must focus its search field.');
      return current;
    });
    const dialog = canvasElement.querySelector('[role="dialog"]');
    const live = dialog?.querySelector('[data-command-palette-live]');
    const listbox = dialog?.querySelector('[role="listbox"]');
    if (!live || !listbox) throw new Error('CommandPalette는 결과 알림 region과 listbox를 제공해야 합니다.');
    if (live.getAttribute('role') !== 'status' || live.getAttribute('aria-live') !== 'polite') {
      throw new Error('결과 수 알림은 polite status region이어야 합니다.');
    }
    if (live.textContent !== `명령 ${manyCommands.length}개`) {
      throw new Error('결과 알림은 현재 결과 수를 담아야 합니다.');
    }
    for (const child of listbox.children) {
      if (child.getAttribute('role') !== 'option') throw new Error('listbox의 자식은 option만 허용됩니다.');
    }

    /* aria-activedescendant는 초점을 옮기지 않으므로 활성 항목을 스크롤 밖으로
       내보내면 안 된다(APG listbox). */
    await userEvent.keyboard('{End}');
    await waitFor(() => {
      const active = ownerDocument.getElementById(input.getAttribute('aria-activedescendant') || '');
      if (active?.textContent?.trim() !== `명령 ${manyCommands.length - 1}`) throw new Error('End must activate the last command.');
      const viewport = listbox.parentElement;
      const viewportRect = viewport.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      if (activeRect.top < viewportRect.top - 1 || activeRect.bottom > viewportRect.bottom + 1) {
        throw new Error('활성 명령은 목록 스크롤 안에 보이는 상태를 유지해야 합니다.');
      }
    });

    await userEvent.type(input, '설정');
    await waitFor(() => {
      if (live.textContent !== '명령 1개') throw new Error('필터 결과 수가 바뀌면 알림도 갱신되어야 합니다.');
    });

    await userEvent.type(input, '없는값');
    await waitFor(() => {
      if (live.textContent !== '결과 없음') throw new Error('결과가 없을 때도 같은 region이 알려야 합니다.');
      const empty = dialog.querySelector('[data-command-palette-empty]');
      if (!empty || listbox.contains(empty)) throw new Error('결과 없음 문구는 listbox 바깥에 있어야 합니다.');
      if (listbox.children.length !== 0) throw new Error('결과가 없으면 listbox는 비어 있어야 합니다.');
    });

    /* ⌘K 관습: 1차 Escape는 검색어만 지우고 팔레트는 열린 채로 둔다. */
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (input.value !== '') throw new Error('첫 Escape는 검색어를 비워야 합니다.');
      if (!canvasElement.querySelector('[role="dialog"]')) throw new Error('첫 Escape가 팔레트를 닫으면 안 됩니다.');
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (canvasElement.querySelector('[role="dialog"]')) throw new Error('빈 검색어에서 누른 Escape는 팔레트를 닫아야 합니다.');
      if (ownerDocument.activeElement !== trigger) throw new Error('CommandPalette must restore focus to its trigger.');
    });
    trigger.blur();
  },
};

export const CommandPaletteCard = { ...CommandPaletteCardStory, name: 'CommandPalette card parity', tags: ['!dev', 'visual-parity'] };
