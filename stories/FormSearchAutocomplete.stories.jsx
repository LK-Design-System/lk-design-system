import { userEvent } from 'storybook/test';
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
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Selection and Input/Search and Autocomplete',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-selection-and-input-search-and-autocomplete--search-and-autocomplete',
      eyebrow: 'Core / Search and Autocomplete',
      title: '검색과 제안은 사용자가 많은 후보에서 필요한 값을 빠르게 찾도록 돕습니다',
      description:
        '자유 검색어를 전송할 때는 SearchField, 입력 중 단일 후보를 제안할 때는 AutoComplete, 정해진 후보 여러 개를 고를 때는 Combobox를 사용하세요. 간단한 고정 목록은 Select가 더 적합합니다.',
    },
    docs: {
      description: {
        component: '검색어 입력, 단일 제안, 다중 선택을 각각 다른 상호작용 계약으로 제공합니다.',
      },
    },
  },
};

export default meta;

const options = ['물류 로봇', '용접 로봇', '서빙 로봇', '방역 로봇'];

export const SearchAndAutocomplete = {
  name: '개요',
  parameters: storyDescription(
    '정확한 목적이 다른 네 가지 입력을 비교합니다. 보이는 라벨, 설명, 키보드 제안, 선택값 표시가 서로 어떻게 다른지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 760 }}>
      <SearchField label="로봇 검색" helper="Enter를 누르면 현재 검색어를 전송합니다." defaultValue="서빙" placeholder="이름 검색" />
      <AutoComplete label="로봇 제안" helper="입력하면 일치하는 단일 후보를 제안합니다." options={options} defaultValue="물류 로봇" placeholder="이름 입력" />
      <Combobox label="로봇 유형" helper="정해진 후보에서 여러 개를 선택합니다." options={options} defaultValue={['물류 로봇', '서빙 로봇']} />
      <TagInput label="관리 태그" defaultValue={['중요', '검사']} />
    </main>
  ),
};

export const SearchAndAutocompleteStates = {
  name: '상태와 좁은 너비',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: 280, maxWidth: '100%' }}>
      <SearchField label="비활성 검색" defaultValue="수정 불가" disabled />
      <SearchField label="읽기 전용 검색" defaultValue="고정 값" readOnly />
      <AutoComplete label="오류 제안" options={options} status="negative" error="목록에서 항목을 선택해 주세요." />
      <AutoComplete label="비활성 제안" options={options} defaultValue="서빙 로봇" disabled />
      <AutoComplete label="빈 제안" options={[]} emptyLabel="제안할 항목이 없습니다." />
      <Combobox label="완료된 선택" options={options} defaultValue={['용접 로봇']} status="positive" helper="선택이 저장되었습니다." />
    </main>
  ),
};

export const AutocompleteKeyboardContract = {
  name: '제안 키보드 계약',
  tags: ['!dev'],
  render: () => <AutoComplete label="키보드 로봇" options={options} style={{ maxWidth: 360 }} />,
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('[role="combobox"]');
    if (!input) throw new Error('AutoComplete must expose a combobox input.');
    input.focus();
    await userEvent.keyboard('{ArrowDown}');
    if (input.getAttribute('aria-expanded') !== 'true' || !input.getAttribute('aria-activedescendant')) {
      throw new Error('ArrowDown must open the listbox and expose the active option.');
    }
    await userEvent.keyboard('{Enter}');
    if (input.value !== '물류 로봇' || input.getAttribute('aria-expanded') !== 'false') {
      throw new Error('Enter must commit the active option and close the listbox.');
    }
    await userEvent.keyboard('{ArrowDown}{Escape}');
    if (input.getAttribute('aria-expanded') !== 'false') throw new Error('Escape must close the listbox.');
  },
};

export const SearchFieldCard = { ...SearchFieldCardStory, name: 'SearchField card parity', tags: ['!dev', 'visual-parity'] };
export const AutoCompleteCard = { ...AutoCompleteCardStory, name: 'AutoComplete card parity', tags: ['!dev', 'visual-parity'] };
