import React from 'react';
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

export const RelationSelection = {
  name: '관계 선택',
  render: () => {
    const [value, setValue] = React.useState(['visionops']);
    return <SearchableMultiSelect label="연결 저장소" options={options} value={value} onChange={setValue} style={{ maxWidth: 520 }} />;
  },
};

export const ResourceStates = {
  name: 'Loading, error, empty, 최대 선택',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))' }}>
      <SearchableMultiSelect label="불러오는 관계" options={options} loading />
      <SearchableMultiSelect label="오류가 있는 관계" options={options} error="저장소 목록을 불러오지 못했습니다." />
      <SearchableMultiSelect label="빈 관계" options={[]} emptyLabel="선택 가능한 저장소가 없습니다." />
      <SearchableMultiSelect label="최대 선택" options={options} defaultValue={['deviceops']} maxSelections={1} />
      <SearchableMultiSelect label="비활성 관계" options={options} defaultValue={['visionops']} disabled />
    </main>
  ),
};

export const DisabledOptionNavigation = {
  name: '비활성 option 건너뛰기',
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
    input.focus();
    await new Promise((resolve) => setTimeout(resolve, 20));
    const firstActive = input.getAttribute('aria-activedescendant');
    if (!firstActive || firstActive.includes('restricted')) {
      throw new Error('The first disabled option must not become active.');
    }
  },
};

export const OpenedSelection = {
  name: '선택 유지·열린 option 목록',
  render: () => (
    <SearchableMultiSelect
      label="연결 저장소"
      options={options}
      defaultValue={['visionops']}
      style={{ width: '100%', maxWidth: 520 }}
    />
  ),
  play: async ({ canvasElement }) => {
    canvasElement.querySelector('[role="combobox"]')?.focus();
  },
};

export const MobileWidth = {
  name: '모바일 폭',
  render: () => (
    <div style={{ width: 340, maxWidth: '100%' }}>
      <SearchableMultiSelect label="연결 저장소" options={options} defaultValue={['visionops', 'mlops']} />
    </div>
  ),
};
