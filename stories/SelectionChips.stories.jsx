import React from 'react';
import { userEvent } from 'storybook/test';
import {
  Chip,
  FilterChip,
  MultiSelectChip,
} from '../src/index.js';
import { ChipCard as ChipCardStory } from './Feedback.shared.jsx';
import {
  FilterChipCard as FilterChipCardStory,
  MultiSelectChipCard as MultiSelectChipCardStory,
} from './SelectionStatus.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Selection and Input/Chip',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-selection-and-input-chip--chip-selection',
      eyebrow: 'Core / Chip',
      title: '사용자가 짧은 속성과 필터 선택을 작은 토큰으로 조절합니다',
      description:
        '공간을 적게 쓰면서 선택·필터·다중 선택 상태를 반복해서 바꿀 때 적합합니다. 중요한 실행에는 Button을, 조작할 수 없는 상태 표기에는 Badge나 Tag를 사용하세요.',
    },
    docs: {
      description: {
        component: '기본 칩과 필터 적용, 다중 선택 상태를 작은 토큰으로 조절하는 Chip, FilterChip, MultiSelectChip 패턴입니다.',
      },
    },
  },
};

export default meta;

export const ChipSelection = {
  name: '개요',
  parameters: storyDescription(
    '기본 Chip, FilterChip, MultiSelectChip의 선택 의미를 한 흐름에서 비교하는 상황입니다. 링크·필터·다중 선택이 같은 모양 안에서도 역할과 활성 상태를 분명히 전달하는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center', maxWidth: 720 }}>
      <Chip selected>선택된 필터</Chip>
      <Chip as="a" href="#">링크 칩</Chip>
      <FilterChip active count={3}>활성</FilterChip>
      <FilterChip caret>그룹</FilterChip>
      <FilterChip>검토</FilterChip>
      <MultiSelectChip defaultSelected>중요</MultiSelectChip>
      <MultiSelectChip>게시</MultiSelectChip>
    </main>
  ),
};

export const DarkThemeSelection = {
  name: '변형·상태 · 다크 테마 선택',
  parameters: storyDescription(
    'Chip, FilterChip, MultiSelectChip의 선택 상태를 같은 다크 semantic theme에서 비교합니다. 선택 의미는 surface·border·pressed semantics로 유지하고 텍스트와 count는 현재 theme label foreground로 읽혀야 합니다.',
  ),
  render: () => (
    <main
      data-theme="dark"
      style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center', width: 'min(100%, 720px)', padding: 24, boxSizing: 'border-box', borderRadius: 'var(--radius-xl)', background: 'var(--color-semantic-background-normal-normal)' }}
    >
      <Chip data-contract="dark-chip" selected>선택된 필터</Chip>
      <FilterChip data-contract="dark-filter-chip" active count={3}>활성</FilterChip>
      <MultiSelectChip data-contract="dark-multi-chip" defaultSelected>중요</MultiSelectChip>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const darkTheme = canvasElement.querySelector('[data-theme="dark"]');
    const controls = [
      canvasElement.querySelector('[data-contract="dark-chip"]'),
      canvasElement.querySelector('[data-contract="dark-filter-chip"]'),
      canvasElement.querySelector('[data-contract="dark-multi-chip"]'),
    ];
    if (!darkTheme || controls.some((control) => !control)) throw new Error('Dark chip family contract targets are required.');
    const probe = canvasElement.ownerDocument.createElement('span');
    probe.style.color = 'var(--color-semantic-label-normal)';
    darkTheme.appendChild(probe);
    const expectedForeground = getComputedStyle(probe).color;
    probe.remove();
    controls.forEach((control) => {
      const styles = getComputedStyle(control);
      const scopedLabel = styles.getPropertyValue('--color-semantic-label-normal').trim();
      if (styles.color !== expectedForeground || !scopedLabel) {
        throw new Error(`Selected chip foreground must resolve to the dark theme label (${styles.color}, ${scopedLabel}).`);
      }
    });
  },
};

function ChipSemanticsFixture() {
  const [pinned, setPinned] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <main style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center', maxWidth: 720 }}>
      <Chip data-contract="chip-toggle" selected={pinned} onClick={() => setPinned((on) => !on)}>고정</Chip>
      <Chip data-contract="chip-static" selected>선택된 필터</Chip>
      <Chip data-contract="chip-link" as="a" href="#chip-link">링크 칩</Chip>
      <FilterChip data-contract="filter-toggle" active>활성 패싯</FilterChip>
      <FilterChip data-contract="filter-disclosure" caret expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>산업 전체</FilterChip>
      <MultiSelectChip data-contract="multi-toggle">비전 AI</MultiSelectChip>
    </main>
  );
}

export const ChipSemanticsContract = {
  name: '칩 역할·선택 계약',
  tags: ['!dev'],
  parameters: storyDescription(
    '클릭 가능한 칩이 실제 버튼인지, 선택 상태가 색 외의 수단으로 전달되는지, 메뉴를 여는 필터가 토글이 아닌 disclosure로 노출되는지 검증합니다.',
  ),
  render: () => <ChipSemanticsFixture />,
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const toggle = canvasElement.querySelector('[data-contract="chip-toggle"]');
    const staticChip = canvasElement.querySelector('[data-contract="chip-static"]');
    const link = canvasElement.querySelector('[data-contract="chip-link"]');
    const filterToggle = canvasElement.querySelector('[data-contract="filter-toggle"]');
    const disclosure = canvasElement.querySelector('[data-contract="filter-disclosure"]');
    const multi = canvasElement.querySelector('[data-contract="multi-toggle"]');
    if (!toggle || !staticChip || !link || !filterToggle || !disclosure || !multi) {
      throw new Error('Chip semantics contract targets are required.');
    }

    // An interactive Chip is a real button with a toggle state.
    if (toggle.tagName !== 'BUTTON') throw new Error('A Chip with onClick must render a real button.');
    if (toggle.getAttribute('aria-pressed') !== 'false') {
      throw new Error('An unselected toggle Chip must expose aria-pressed="false".');
    }
    toggle.focus();
    if (doc.activeElement !== toggle) throw new Error('An interactive Chip must be reachable by keyboard.');
    await userEvent.keyboard('{Enter}');
    if (toggle.getAttribute('aria-pressed') !== 'true') {
      throw new Error('Enter must toggle an interactive Chip and update aria-pressed.');
    }

    // A static selected Chip cannot own aria-pressed, so selection must still
    // reach assistive tech through text rather than colour alone.
    if (staticChip.tagName !== 'SPAN') throw new Error('A Chip without onClick must stay a plain span.');
    if (!staticChip.textContent.includes('선택됨')) {
      throw new Error('A non-interactive selected Chip must not convey selection by colour alone.');
    }
    if (link.tagName !== 'A') throw new Error('as="a" must still win over the interactive default.');

    // FilterChip: toggle vs disclosure semantics are kept apart.
    if (filterToggle.getAttribute('aria-pressed') !== 'true' || filterToggle.hasAttribute('aria-expanded')) {
      throw new Error('A plain FilterChip must be a toggle, not a disclosure.');
    }
    if (disclosure.hasAttribute('aria-pressed')) {
      throw new Error('A caret FilterChip opens a menu and must not claim aria-pressed.');
    }
    if (disclosure.getAttribute('aria-haspopup') !== 'menu' || disclosure.getAttribute('aria-expanded') !== 'false') {
      throw new Error('A caret FilterChip must expose aria-haspopup and a collapsed aria-expanded.');
    }
    await userEvent.click(disclosure);
    if (disclosure.getAttribute('aria-expanded') !== 'true') {
      throw new Error('Opening the menu must update aria-expanded.');
    }
    if (multi.getAttribute('aria-pressed') !== 'false') {
      throw new Error('MultiSelectChip must keep toggle semantics.');
    }
  },
};

export const ChipCard = { ...ChipCardStory, name: 'Chip card parity', tags: ['!dev', 'visual-parity'] };
export const FilterChipCard = { ...FilterChipCardStory, name: 'FilterChip card parity', tags: ['!dev', 'visual-parity'] };
export const MultiSelectChipCard = { ...MultiSelectChipCardStory, name: 'MultiSelectChip card parity', tags: ['!dev', 'visual-parity'] };
