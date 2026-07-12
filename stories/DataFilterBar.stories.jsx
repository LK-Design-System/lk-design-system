import React from 'react';
import { userEvent } from 'storybook/test';
import { Button, DateRangeField, FilterBar, FilterChip, Select } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const INITIAL_FILTERS = [
  { id: 'status', label: '상태', value: '점검 필요' },
  { id: 'owner', label: '담당 조직', value: '수도권 현장 운영팀' },
  { id: 'period', label: '기간', value: '2026. 07. 01–07. 11' },
];

const meta = {
  title: 'LDS Product/Data/Operations/Filter Bar',
  component: FilterBar,
  parameters: {
    layout: 'padded',
    storyGuide: {
      storyId: 'lds-product-data-operations-filter-bar--applied-filters-and-saved-view',
      eyebrow: 'Product / Data / Filter Bar',
      title: '사용자가 적용된 조건을 확인하고 결과 범위를 다시 조정합니다',
      description:
        '여러 필터 control과 적용 조건·결과 수·saved view를 한 흐름으로 관리할 때 적합합니다. 한두 개의 독립 옵션이나 단순 검색만 필요하면 Filter Bar 대신 Select 또는 Search Field를 사용하세요.',
    },
    docs: {
      description: {
        component: '필터 control과 적용된 조건의 개별 제거·전체 초기화, 결과 수, saved-view slot을 일관된 순서로 제공하는 데이터 패턴입니다.',
      },
    },
  },
};

export default meta;

function InteractiveFilterBar({ narrow = false }) {
  const [filters, setFilters] = React.useState(INITIAL_FILTERS);
  const [view, setView] = React.useState('operations');
  return (
    <div data-testid={narrow ? 'narrow-filter-surface' : 'filter-surface'} style={{ width: narrow ? 320 : 'min(100%, 1040px)', maxWidth: '100%', overflow: 'hidden', border: narrow ? 'var(--component-card-border)' : 0, borderRadius: narrow ? 'var(--component-card-radius)' : 0 }}>
      <FilterBar
        size="sm"
        variant={narrow ? 'embedded' : 'standalone'}
        controls={(
          <>
            <FilterChip size="sm" active>상태</FilterChip>
            <FilterChip size="sm">담당 조직</FilterChip>
            <DateRangeField
              value={{ start: '2026-07-01', end: '2026-07-11' }}
              showFieldLabels={false}
              style={{ flex: '1 1 410px', maxWidth: 440 }}
            />
          </>
        )}
        activeFilters={filters}
        onRemoveFilter={(id) => setFilters((current) => current.filter((filter) => filter.id !== id))}
        onClearFilters={() => setFilters([])}
        resultCount={filters.length ? 128 : 486}
        viewControl={(
          <Select
            value={view}
            onChange={setView}
            options={[
              { value: 'operations', label: '운영 기본 보기' },
              { value: 'maintenance', label: '점검 보기' },
            ]}
            size="sm"
            aria-label="저장된 보기"
            style={{ width: 176 }}
          />
        )}
        actions={<Button size="sm" variant="ghost">보기 저장</Button>}
      />
    </div>
  );
}

export const AppliedFiltersAndSavedView = {
  name: '개요',
  parameters: storyDescription(
    '여러 조건을 적용하고 개별 필터 제거·전체 초기화·saved view 전환을 사용하는 상황입니다. 적용 조건과 결과 수가 동기화되고 각 제거 action의 범위가 분명한지 확인하세요.',
  ),
  render: () => <InteractiveFilterBar />,
  play: async ({ canvasElement }) => {
    const remove = canvasElement.querySelector('button[aria-label="상태 점검 필요 필터 제거"]');
    if (!remove) throw new Error('Each applied filter must expose an individually named remove button.');
    await userEvent.click(remove);
    if (canvasElement.querySelector('button[aria-label="상태 점검 필요 필터 제거"]')) {
      throw new Error('Removing one filter must preserve the remaining controlled filters.');
    }
    const clear = [...canvasElement.querySelectorAll('button')].find((button) => button.textContent?.trim() === '모든 필터 지우기');
    if (!clear) throw new Error('Multiple filters must expose a clear-all action.');
    const result = canvasElement.querySelector('[role="status"]');
    if (!canvasElement.querySelector('[aria-label="적용된 필터"]') || result?.textContent?.trim() !== '128개 결과') {
      throw new Error('Removing one filter must retain the remaining summary, clear-all action and result status.');
    }
  },
};

export const NarrowWrapping = {
  name: '반응형 · 좁은 폭과 긴 필터',
  parameters: storyDescription(
    '320px 표면에서 긴 필터 값과 여러 control이 줄바꿈되는 상황입니다. 적용 필터가 잘리지 않고 control·결과 수·초기화 action의 읽기 순서가 유지되는지 확인하세요.',
  ),
  render: () => <InteractiveFilterBar narrow />,
  play: async ({ canvasElement }) => {
    const surface = canvasElement.querySelector('[data-testid="narrow-filter-surface"]');
    const bar = canvasElement.querySelector('[data-filter-bar-variant="embedded"]');
    if (!surface || !bar || surface.scrollWidth > surface.clientWidth + 1 || bar.scrollWidth > bar.clientWidth + 1) {
      throw new Error('FilterBar controls, actions and long applied filters must wrap inside 320px.');
    }
    if (!bar.querySelector('[aria-label="저장된 보기"]') || !bar.querySelector('[role="status"]')) {
      throw new Error('Narrow composition must retain saved-view and result-status semantics.');
    }
  },
};

export const ReadOnlyAppliedFilters = {
  name: '변형·상태 · 읽기 전용 필터',
  parameters: storyDescription(
    '사용자가 조건을 바꿀 수 없지만 현재 적용된 필터와 결과 수를 알아야 하는 상황입니다. 제거 affordance 없이 조건이 읽히고 편집 가능한 상태로 오해되지 않는지 확인하세요.',
  ),
  render: () => <FilterBar activeFilters={INITIAL_FILTERS.slice(0, 2)} resultCount={128} />,
  play: async ({ canvasElement }) => {
    const summary = canvasElement.querySelector('[aria-label="적용된 필터"]');
    const chips = summary?.querySelectorAll('[data-removable="false"]');
    if (!summary || chips?.length !== 2 || summary.querySelector('button') || summary.querySelector('svg')) {
      throw new Error('Filters without a removal callback must render as non-operable summaries without close icons.');
    }
  },
};
