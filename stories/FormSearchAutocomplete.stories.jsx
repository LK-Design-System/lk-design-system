import {
  AutoComplete,
  Combobox,
  SearchField,
  TagInput,
} from '../src/index.js';
import {
  AutoCompleteCard as AutoCompleteCardStory,
  SearchFieldCard as SearchFieldCardStory,
} from './FormsFull.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Selection and Input/Search and Autocomplete',
  parameters: {
    docs: {
      description: {
        component: '검색어 입력, 후보 제안, 다중 선택, 태그 입력에 쓰는 검색형 폼 요소입니다.',
      },
    },
  },
};

export default meta;

const options = ['물류 로봇', '용접 로봇', '순찰 로봇', '방역 로봇'];

export const SearchAndAutocomplete = {
  name: '검색과 자동완성',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 760 }}>
      <SearchField defaultValue="토큰" placeholder="항목 검색" />
      <AutoComplete options={options} defaultValue="물류 로봇" placeholder="항목 검색" />
      <Combobox options={options} defaultValue={['물류 로봇', '순찰 로봇']} />
      <TagInput defaultValue={['중요', '검토']} />
    </main>
  ),
};

export const SearchFieldCard = { ...SearchFieldCardStory, name: 'SearchField card parity', tags: ['!dev', 'visual-parity'] };
export const AutoCompleteCard = { ...AutoCompleteCardStory, name: 'AutoComplete card parity', tags: ['!dev', 'visual-parity'] };
