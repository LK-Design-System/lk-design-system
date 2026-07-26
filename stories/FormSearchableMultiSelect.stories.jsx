import React from 'react';
import { userEvent } from 'storybook/test';
import { SearchableMultiSelect } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Selection and Input/Searchable Multi Select',
  tags: ['autodocs'],
  component: SearchableMultiSelect,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-selection-and-input-searchable-multi-select--relation-selection',
      eyebrow: 'Product / Searchable Multi Select',
      title: '검색형 다중 선택은 큰 목록에서 여러 관계를 찾고 유지합니다',
      description:
        '저장소·사용자처럼 항목이 많고 검색 후 복수 값을 chip으로 남겨야 할 때 적합합니다. 선택지가 적거나 하나만 고르면 Checkbox Group 또는 Select를 사용하세요.',
    },
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

const longOptions = [
  ...options,
  {
    value: 'integration',
    label: 'lk_robotics_platform_integration_service',
    description: '로봇 플랫폼 통합과 배포 자동화 운영',
  },
];

function settle() {
  return new Promise((resolve) => setTimeout(resolve, 30));
}

export const RelationSelection = {
  name: '개요',
  parameters: storyDescription(
    '저장소 목록을 검색해 여러 관계를 chip으로 유지하는 기본 controlled 예제입니다. 검색 입력, 선택 목록, 제거 동작이 하나의 필드로 읽히는지 확인하세요.',
  ),
  render: () => {
    const [value, setValue] = React.useState(['visionops']);
    return <SearchableMultiSelect label="연결 저장소" helper="검색한 저장소를 여러 개 연결할 수 있습니다." options={options} value={value} onChange={setValue} style={{ maxWidth: 520 }} />;
  },
};

export const ResourceStates = {
  name: '변형·상태 · 불러오기 · 오류 · 빈 결과와 최대 선택',
  parameters: storyDescription(
    '원격 옵션의 loading, fetch error, 빈 목록, 최대 선택 도달 상태를 비교합니다. 상태마다 다음 행동과 입력 가능 여부가 명확히 달라지는지 확인하세요.',
  ),
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
    const status = canvasElement.querySelector('[role="status"]');
    if (listbox?.getAttribute('role') !== 'listbox' || listbox.querySelector('[role="option"]') || status?.textContent?.trim() !== '불러오는 중') {
      throw new Error('Loading must keep an empty controlled listbox and expose a separate status.');
    }
    await userEvent.keyboard('{Escape}');
  },
};

export const KeyboardSelectionContract = {
  name: '상호작용 · 키보드 선택과 제거',
  parameters: storyDescription(
    '키보드만으로 목록을 열고 첫 항목을 선택한 뒤 chip을 제거합니다. combobox의 확장·활성 항목·선택 값이 포커스 이동과 동기화되는지 확인하세요.',
  ),
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
  name: '변형·상태 · 비활성 항목 건너뛰기',
  parameters: storyDescription(
    '권한 없는 첫 옵션을 포함한 검색 목록입니다. 방향키가 비활성 항목을 건너뛰고 첫 사용 가능 항목에 활성 descendant를 두는지 확인하세요.',
  ),
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
  name: '사용법 · 선택 유지와 열린 항목 목록',
  parameters: storyDescription(
    '이미 선택한 저장소 chip을 유지한 채 옵션 목록을 연 상태입니다. 선택된 값이 목록에서도 구분되고 중복 선택으로 추가되지 않는지 확인하세요.',
  ),
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

export const OptionRowAlignment = {
  name: '반응형 · 옵션 제목과 설명 정렬',
  parameters: storyDescription(
    '기본 폭과 260px 좁은 폭에서 옵션 제목은 왼쪽, 설명은 오른쪽에 한 줄로 정렬됩니다. 긴 문자열은 서로 겹치거나 행 높이를 늘리지 않고 각 영역에서 말줄임되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-8)' }}>
      <SearchableMultiSelect data-option-row-width="normal" label="기본 폭 저장소" options={longOptions} style={{ width: 520, maxWidth: '100%' }} />
      <SearchableMultiSelect data-option-row-width="narrow" label="좁은 폭 저장소" options={longOptions} style={{ width: 260, maxWidth: '100%' }} />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll('[role="combobox"]');
    for (const input of inputs) {
      await userEvent.click(input);
      await settle();
    }
  },
};

export const MobileWidth = {
  name: '반응형 · 좁은 폭과 읽기 전용',
  parameters: storyDescription(
    '260px 폭에서 두 값을 읽기 전용으로 보여줍니다. chip이 겹치지 않고 입력이 열리지 않으며 기존 값은 끝까지 읽을 수 있는지 확인하세요.',
  ),
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
