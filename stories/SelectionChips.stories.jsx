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

export const ChipCard = { ...ChipCardStory, name: 'Chip card parity', tags: ['!dev', 'visual-parity'] };
export const FilterChipCard = { ...FilterChipCardStory, name: 'FilterChip card parity', tags: ['!dev', 'visual-parity'] };
export const MultiSelectChipCard = { ...MultiSelectChipCardStory, name: 'MultiSelectChip card parity', tags: ['!dev', 'visual-parity'] };
