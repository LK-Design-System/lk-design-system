import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
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
    if (remove.hasAttribute('aria-pressed')) {
      throw new Error('"…필터 제거"는 토글이 아니라 액션 버튼이므로 aria-pressed를 가지면 안 됩니다(APG Button).');
    }
    await userEvent.click(remove);
    if (canvasElement.querySelector('button[aria-label="상태 점검 필요 필터 제거"]')) {
      throw new Error('Removing one filter must preserve the remaining controlled filters.');
    }
    await waitFor(() => {
      if (canvasElement.ownerDocument.activeElement !== canvasElement.querySelector('button[aria-label="담당 조직 수도권 현장 운영팀 필터 제거"]')) {
        throw new Error('칩을 제거하면 포커스가 같은 자리의 다음 칩으로 이동해야 합니다(WCAG 2.4.3).');
      }
    });
    const clear = [...canvasElement.querySelectorAll('button')].find((button) => button.textContent?.trim() === '모든 필터 지우기');
    if (!clear) throw new Error('Multiple filters must expose a clear-all action.');
    const result = canvasElement.querySelector('[role="status"]');
    if (!canvasElement.querySelector('[role="group"][aria-label="적용된 필터"]') || result?.textContent?.trim() !== '128개 결과') {
      throw new Error('Removing one filter must retain the remaining summary, clear-all action and result status.');
    }
    canvasElement.ownerDocument.activeElement?.blur?.();
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
    const summary = canvasElement.querySelector('[role="group"][aria-label="적용된 필터"]');
    const chips = [...(summary?.querySelectorAll('[data-removable="false"]') ?? [])];
    if (!summary || chips.length !== 2 || summary.querySelector('button') || summary.querySelector('svg')) {
      throw new Error('Filters without a removal callback must render as non-operable summaries without close icons.');
    }
    if (chips.some((chip) => chip.hasAttribute('aria-pressed') || chip.textContent?.includes('선택됨'))) {
      throw new Error('읽기 전용 요약 chip은 선택 상태를 주장하지 않아야 합니다. 적용된 조건일 뿐 토글이 아닙니다.');
    }
  },
};

function FilterFocusContractDemo() {
  const [filters, setFilters] = React.useState(INITIAL_FILTERS);
  return (
    <div data-testid="filter-focus-surface" style={{ width: 'min(100%, 720px)', maxWidth: '100%' }}>
      <FilterBar
        size="sm"
        activeFilters={filters}
        onRemoveFilter={(id) => setFilters((current) => current.filter((filter) => filter.id !== id))}
        onClearFilters={() => setFilters([])}
        resultCount={filters.length ? 128 : 486}
      />
    </div>
  );
}

export const FilterRemovalFocusContract = {
  name: '필터 제거 포커스와 상태 계약',
  tags: ['!dev'],
  parameters: storyDescription(
    '적용된 조건을 하나씩 제거할 때의 포커스 이동과 결과 수 라이브 리전의 수명 계약입니다. 포커스가 body로 떨어지지 않고, 결과 리전이 상태 전환마다 새로 마운트되지 않는지 확인합니다.',
  ),
  render: () => <FilterFocusContractDemo />,
  play: async ({ canvasElement }) => {
    const removeButton = (label) => canvasElement.querySelector(`button[aria-label="${label} 필터 제거"]`);
    const clickRemove = async (label) => {
      const button = removeButton(label);
      if (!button) throw new Error(`적용된 필터 "${label}"은 이름 있는 제거 버튼을 노출해야 합니다.`);
      await userEvent.click(button);
    };
    const liveBefore = canvasElement.querySelector('[data-filter-bar-result-live]');
    if (liveBefore?.getAttribute('role') !== 'status' || liveBefore.getAttribute('aria-live') !== 'polite') {
      throw new Error('결과 수 라이브 리전은 처음부터 polite status로 마운트되어 있어야 합니다.');
    }
    if (liveBefore.textContent?.trim() !== '128개 결과') {
      throw new Error('라이브 리전은 현재 결과 수 텍스트를 담고 있어야 합니다.');
    }

    await clickRemove('담당 조직 수도권 현장 운영팀');
    await waitFor(() => {
      if (canvasElement.ownerDocument.activeElement !== removeButton('기간 2026. 07. 01–07. 11')) {
        throw new Error('가운데 칩을 제거하면 같은 자리를 이어받은 칩으로 포커스가 이동해야 합니다.');
      }
    });

    await clickRemove('기간 2026. 07. 01–07. 11');
    await waitFor(() => {
      if (canvasElement.ownerDocument.activeElement !== removeButton('상태 점검 필요')) {
        throw new Error('마지막 자리의 칩을 제거하면 남은 마지막 칩으로 포커스가 이동해야 합니다.');
      }
    });

    await clickRemove('상태 점검 필요');
    const region = canvasElement.querySelector('[role="region"][aria-label="데이터 필터"]');
    await waitFor(() => {
      if (canvasElement.ownerDocument.activeElement !== region) {
        throw new Error('마지막 칩까지 제거하면 포커스가 body 대신 이름 있는 필터 region으로 복구되어야 합니다.');
      }
    });

    const liveAfter = canvasElement.querySelector('[data-filter-bar-result-live]');
    if (liveAfter !== liveBefore) {
      throw new Error('결과 라이브 리전은 요약이 사라지거나 나타날 때 새로 마운트되면 안 됩니다. 텍스트만 바뀌어야 합니다.');
    }
    if (liveAfter.textContent?.trim() !== '486개 결과') {
      throw new Error('필터를 모두 제거하면 상시 리전의 텍스트가 새 결과 수로 갱신되어야 합니다.');
    }
    canvasElement.ownerDocument.activeElement?.blur?.();
  },
};
