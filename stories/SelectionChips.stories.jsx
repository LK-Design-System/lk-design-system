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

export const ChipCard = { ...ChipCardStory, name: 'Chip card parity', tags: ['!dev', 'visual-parity'] };
export const FilterChipCard = { ...FilterChipCardStory, name: 'FilterChip card parity', tags: ['!dev', 'visual-parity'] };
export const MultiSelectChipCard = { ...MultiSelectChipCardStory, name: 'MultiSelectChip card parity', tags: ['!dev', 'visual-parity'] };
