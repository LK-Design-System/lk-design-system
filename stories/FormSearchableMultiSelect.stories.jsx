import React from 'react';
import { userEvent } from 'storybook/test';
import { SearchableMultiSelect } from '../src/index.js';

const meta = {
  title: 'LDS Product/Selection and Input/Searchable Multi Select',
  component: SearchableMultiSelect,
  parameters: {
    docs: {
      description: {
        component: '큰 관계 목록을 검색하고 여러 값을 chip으로 선택하는 controlled multi-select입니다.',
      },
    },
  },
};

export default meta;

const options = [
  { value: 'deviceops', label: 'lk_deviceops', description: '보드와 서비스 운영' },
  { value: 'visionops', label: 'lk_visionops', description: '비전 모듈 운영' },
  { value: 'mlops', label: 'lk_mlops', description: '데이터와 모델 실행' },
  { value: 'context', label: 'lk_context_hub', description: '개발 컨텍스트' },
];

function settle() {
  return new Promise((resolve) => setTimeout(resolve, 30));
}

export const RelationSelection = {
  name: '관계 선택',
  render: () => {
    const [value, setValue] = React.useState(['visionops']);
    return <SearchableMultiSelect label="연결 저장소" helper="검색한 저장소를 여러 개 연결할 수 있습니다." options={options} value={value} onChange={setValue} style={{ maxWidth: 520 }} />;
  },
};

export const ResourceStates = {
  name: '불러오기·오류·빈 결과·최대 선택',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))' }}>
      <SearchableMultiSelect data-testid="loading-root" aria-busy="false" label="불러오는 관계" options={options} loading />
      <SearchableMultiSelect label="오류가 있는 관계" options={options} error="저장소 목록을 불러오지 못했습니다." />
      <SearchableMultiSelect label="빈 관계" options={[]} emptyLabel="선택 가능한 저장소가 없습니다." />
      <SearchableMultiSelect label="최대 선택" options={options} defaultValue={['deviceops']} maxSelections={1} />
      <SearchableMultiSelect label="읽기 전용 관계" options={options} defaultValue={['deviceops', 'visionops']} readOnly />
      <SearchableMultiSelect label="비활성 관계" options={options} defaultValue={['visionops']} disabled />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-testid="loading-root"]');
    const input = root?.querySelector('[role="combobox"]');
    if (!root || !input) throw new Error('The loading combobox is missing.');
    if (root.getAttribute('aria-busy') !== 'true') {
      throw new Error('Consumer props must not override the component loading state.');
    }

    await userEvent.click(input);
    await settle();
    const popupId = input.getAttribute('aria-controls');
    const listbox = popupId ? canvasElement.ownerDocument.getElementById(popupId) : null;
    const status = listbox?.parentElement?.querySelector('[role="status"]');
    if (listbox?.getAttribute('role') !== 'listbox' || listbox.querySelector('[role="option"]') || status?.textContent?.trim() !== '불러오는 중') {
      throw new Error('Loading must keep an empty controlled listbox and expose a separate status.');
    }
    await userEvent.keyboard('{Escape}');
  },
};

export const KeyboardSelectionContract = {
  name: '키보드 선택·제거 동작',
  render: function Example() {
    const [value, setValue] = React.useState([]);
    return <SearchableMultiSelect label="키보드 저장소" options={options} value={value} onChange={setValue} style={{ maxWidth: 520 }} />;
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('[role="combobox"]');
    if (!input) throw new Error('SearchableMultiSelect combobox is missing.');

    await userEvent.click(input);
    await settle();
    await userEvent.keyboard('{Enter}');
    await settle();
    if (!canvasElement.querySelector('button[aria-label="lk_deviceops 선택 해제"]')) {
      throw new Error('Enter must select the active option and expose an accessible remove action.');
    }

    await userEvent.keyboard('{Backspace}');
    await settle();
    if (canvasElement.querySelector('button[aria-label="lk_deviceops 선택 해제"]')) {
      throw new Error('Backspace must remove the last chip when the search value is empty.');
    }

    await userEvent.keyboard('{Escape}');
    await settle();
    if (input.getAttribute('aria-expanded') !== 'false') {
      throw new Error('Escape must collapse the popup while focus stays on the input.');
    }
  },
};

export const DisabledOptionNavigation = {
  name: '비활성 항목 건너뛰기',
  render: () => (
    <SearchableMultiSelect
      label="접근 가능한 저장소"
      options={[
        { value: 'restricted', label: '권한 없는 저장소', disabled: true },
        ...options,
      ]}
      style={{ maxWidth: 520 }}
    />
  ),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('[role="combobox"]');
    if (!input) throw new Error('SearchableMultiSelect combobox is missing.');
    await userEvent.click(input);
    await new Promise((resolve) => setTimeout(resolve, 20));
    const firstActive = input.getAttribute('aria-activedescendant');
    if (!firstActive || firstActive.includes('restricted')) {
      throw new Error('The first disabled option must not become active.');
    }
  },
};

export const OpenedSelection = {
  name: '선택 유지·열린 항목 목록',
  render: () => (
    <SearchableMultiSelect
      label="연결 저장소"
      options={options}
      defaultValue={['visionops']}
      style={{ width: '100%', maxWidth: 520 }}
    />
  ),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('[role="combobox"]');
    if (input) await userEvent.click(input);
  },
};

export const MobileWidth = {
  name: '좁은 폭·읽기 전용',
  render: () => (
    <div style={{ width: 260, maxWidth: '100%' }}>
      <SearchableMultiSelect label="연결 저장소" helper="값은 읽을 수 있지만 변경할 수 없습니다." options={options} defaultValue={['visionops', 'mlops']} readOnly />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('[role="combobox"]');
    if (!input?.readOnly) throw new Error('The read-only state must reach the native input.');
    await userEvent.click(input);
    await settle();
    if (input.getAttribute('aria-expanded') !== 'false' || canvasElement.querySelector('button[aria-label$="선택 해제"]')) {
      throw new Error('Read-only values must stay focusable without opening or exposing remove actions.');
    }
  },
};
