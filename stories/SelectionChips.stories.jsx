import {
  FilterChip,
  MultiSelectChip,
} from '../src/index.js';
import {
  FilterChipCard as FilterChipCardStory,
  MultiSelectChipCard as MultiSelectChipCardStory,
} from './SelectionStatus.shared.jsx';

const meta = {
  title: 'WDS Core/3 Component/3 Selection and Input/Chip',
  parameters: {
    docs: {
      description: {
        component: '필터 적용과 다중 선택 상태를 작은 토큰으로 조절하는 FilterChip, MultiSelectChip 패턴입니다.',
      },
    },
  },
};

export default meta;

export const ChipSelection = {
  name: '칩 선택',
  render: () => (
    <main style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center', maxWidth: 720 }}>
      <FilterChip active count={3}>활성</FilterChip>
      <FilterChip caret>그룹</FilterChip>
      <FilterChip>검토</FilterChip>
      <MultiSelectChip defaultSelected>중요</MultiSelectChip>
      <MultiSelectChip>게시</MultiSelectChip>
    </main>
  ),
};

export const FilterChipCard = { ...FilterChipCardStory, name: 'FilterChip card parity', tags: ['!dev', 'visual-parity'] };
export const MultiSelectChipCard = { ...MultiSelectChipCardStory, name: 'MultiSelectChip card parity', tags: ['!dev', 'visual-parity'] };
