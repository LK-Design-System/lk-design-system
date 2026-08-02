import React from 'react';
import { userEvent } from 'storybook/test';
import {
  Button,
  DataGrid,
  DataToolbar,
  FilterChip,
  Icon,
  Select,
  StatusBadge,
  TextButton,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Data/Operations/Data Toolbar',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-product-data-operations-data-toolbar--toolbar-with-grid',
      eyebrow: 'Product / Data / Data Toolbar',
      title: '사용자가 데이터 범위를 좁히고 현재 결과에 맞는 작업을 찾습니다',
      description:
        '표나 그리드 바로 위에서 검색·필터·결과 수·페이지 수준 action을 함께 제공할 때 적합합니다. 선택된 행에만 적용되는 bulk action이나 전역 앱 명령에는 Data Toolbar 대신 선택 band 또는 Command Bar를 사용하세요.',
    },
    docs: {
      description: {
        component: '데이터 표 상단에서 검색, 필터, 결과 수, page-level action을 정렬합니다. 선택 bulk action은 표의 선택 band가 소유합니다.',
      },
    },
  },
};

export default meta;

const rows = [
  { id: 'USR-104', group: '운영', status: '활성', progress: 86 },
  { id: 'USR-212', group: '검토', status: '검토 중', progress: 47 },
  { id: 'USR-318', group: '지원', status: '비활성', progress: 12 },
];

const columns = [
  { key: 'id', label: '계정', sortable: true },
  { key: 'group', label: '그룹' },
  { key: 'status', label: '상태', render: (row) => <StatusBadge tone={row.status === '활성' ? 'positive' : row.status === '검토 중' ? 'cautionary' : 'offline'}>{row.status}</StatusBadge> },
  { key: 'progress', label: '진행률', align: 'right', render: (row) => <strong style={{ color: row.progress <= 20 ? 'var(--color-semantic-status-negative-text)' : 'var(--color-semantic-label-strong)', fontVariantNumeric: 'tabular-nums' }}>{row.progress}%</strong> },
];

const surfaceStyle = {
  width: '100%',
  maxWidth: 1040,
  border: '1px solid var(--color-semantic-line-solid-normal)',
  borderRadius: 'var(--radius-lg)',
  background: 'var(--color-semantic-background-elevated-normal)',
  boxShadow: 'var(--shadow-xs)',
  overflow: 'hidden',
};

const toolbarStyle = {
  border: 0,
  borderBottom: '1px solid var(--color-semantic-line-solid-normal)',
  borderRadius: 0,
  background: 'var(--color-semantic-background-elevated-normal)',
};

function ToolbarWithGridDemo() {
  const [selectionModel, setSelectionModel] = React.useState({
    mode: 'explicit',
    selectedIds: ['USR-104', 'USR-212'],
  });
  return (
    <main style={surfaceStyle}>
      <DataToolbar
        size="sm"
        title="사용자 목록"
        description="검색, 필터, 선택 후 작업을 표와 같은 표면에서 정렬합니다."
        count={rows.length}
        searchPlaceholder="사용자 검색"
        filters={({ size: filterSize }) => (
          <>
            <FilterChip size={filterSize} active>활성</FilterChip>
            <FilterChip size={filterSize}>검토 필요</FilterChip>
            <FilterChip size={filterSize}>비활성</FilterChip>
          </>
        )}
        actions={<Button size="sm" variant="ghost"><Icon name="upload" size={16} aria-hidden="true" />내보내기</Button>}
        style={toolbarStyle}
      />
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        selectable
        selectionModel={selectionModel}
        onSelectionModelChange={setSelectionModel}
        selectAllScope="allMatching"
        totalCount={128}
        selectionEntityLabel="사용자"
        getRowSelectionLabel={(row) => `사용자 ${row.id}`}
        bulkActions={({ selectedCount }) => (
          <TextButton size="sm" color="primary" aria-label={`선택한 사용자 ${selectedCount}명의 권한 변경`}>
            권한 변경
          </TextButton>
        )}
        size="sm"
        style={{
          border: 0,
          borderRadius: 0,
          background: 'var(--color-semantic-background-elevated-normal)',
        }}
      />
    </main>
  );
}

function MediumFilterDensityDemo() {
  const [scope, setScope] = React.useState('all');
  return (
    <div style={{ width: '100%', maxWidth: 760 }}>
      <DataToolbar
        data-testid="medium-density-toolbar"
        title="자료 목록"
        description="기본 밀도에서 검색과 필드형 필터의 높이를 맞춥니다."
        searchPlaceholder="자료 검색"
        filters={({ size: filterSize }) => (
          <Select
            aria-label="자료 유형 필터"
            size={filterSize}
            value={scope}
            onChange={setScope}
            style={{ minWidth: 160 }}
          >
            <option value="all">전체 유형</option>
            <option value="document">문서</option>
            <option value="dataset">데이터셋</option>
          </Select>
        )}
      />
    </div>
  );
}

function MultiSelectFilterDemo({ width, testId }) {
  const [language, setLanguage] = React.useState('all');
  const [topic, setTopic] = React.useState('all');
  const [sort, setSort] = React.useState('updated');
  return (
    <div data-testid={testId} style={{ width, maxWidth: '100%' }}>
      <DataToolbar
        variant="embedded"
        size="sm"
        searchPlaceholder="저장소 검색"
        filters={({ size: filterSize }) => (
          <>
            <Select aria-label="언어" size={filterSize} value={language} onChange={setLanguage}>
              <option value="all">모든 언어</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
            </Select>
            <Select aria-label="토픽" size={filterSize} value={topic} onChange={setTopic}>
              <option value="all">모든 토픽</option>
              <option value="robotics">로보틱스 자동화</option>
              <option value="vision">컴퓨터 비전</option>
            </Select>
            <Select aria-label="정렬" size={filterSize} value={sort} onChange={setSort}>
              <option value="updated">최근 수정순</option>
              <option value="created">최근 생성순</option>
              <option value="name">이름순</option>
            </Select>
          </>
        )}
      />
    </div>
  );
}

export const ToolbarWithGrid = {
  name: '개요',
  parameters: storyDescription(
    '데이터 그리드 위에서 검색과 필터로 결과를 좁히고 선택 상태에 맞는 action을 확인하는 상황입니다. toolbar와 grid의 범위가 연결되고 페이지 action과 선택 action이 섞이지 않는지 확인하세요.',
  ),
  render: () => <ToolbarWithGridDemo />,
  play: async ({ canvasElement }) => {
    const initialToggle = canvasElement.querySelector('input[aria-label="전체 결과 사용자 128개 선택"]');
    const initialGroup = canvasElement.querySelector('[role="group"][aria-label="사용자 일괄 작업"]');
    const initialStatus = initialGroup?.querySelector('[data-grid-selection-count]');
    const initialRow = canvasElement.querySelector('input[aria-label="사용자 USR-104 선택 해제"]');
    if (!initialToggle || !initialGroup || !initialRow || initialStatus?.textContent?.trim() !== '2개 선택됨') {
      throw new Error('Explicit IDs must render entity labels and the two-item bulk band.');
    }
    if (!initialToggle.indeterminate) {
      throw new Error('A partial all-results selection must expose the native indeterminate state.');
    }

    await userEvent.click(initialToggle);
    const allToggle = canvasElement.querySelector('input[aria-label="전체 결과 사용자 128개 선택 해제"]');
    const allStatus = canvasElement.querySelector('[role="group"][aria-label="사용자 일괄 작업"] [data-grid-selection-count]');
    if (!allToggle?.checked || allToggle.indeterminate || allStatus?.textContent?.trim() !== '128개 선택됨') {
      throw new Error('Select all must switch to allMatching and use totalCount for the band count.');
    }

    const selectedRow = canvasElement.querySelector('input[aria-label="사용자 USR-104 선택 해제"]');
    if (!selectedRow?.checked) throw new Error('A visible row must be selected by allMatching.');
    await userEvent.click(selectedRow);

    const excludedRow = canvasElement.querySelector('input[aria-label="사용자 USR-104 선택"]');
    const partialToggle = canvasElement.querySelector('input[aria-label="전체 결과 사용자 128개 선택"]');
    const partialStatus = canvasElement.querySelector('[role="group"][aria-label="사용자 일괄 작업"] [data-grid-selection-count]');
    const contextualAction = canvasElement.querySelector('[aria-label="선택한 사용자 127명의 권한 변경"]');
    if (!excludedRow || excludedRow.checked || !partialToggle?.indeterminate || partialStatus?.textContent?.trim() !== '127개 선택됨' || !contextualAction) {
      throw new Error('Deselecting one allMatching row must add an exclusion and update the bulk context.');
    }

    const clear = canvasElement.querySelector('button[aria-label="사용자 선택 모두 해제"]');
    if (!clear) throw new Error('The selection band must expose its built-in clear action.');
    await userEvent.click(clear);
    if (canvasElement.querySelector('[role="group"][aria-label="사용자 일괄 작업"]')) {
      throw new Error('Clearing must return to an empty explicit selection and close the bulk band.');
    }
  },
};

export const MediumFilterDensity = {
  name: '반응형 · 기본 필터 밀도',
  parameters: storyDescription(
    '기본 md 밀도에서 검색과 Select가 field 척도 48px을 공유합니다. actions는 별도 header 행에 남고 FilterChip은 고유 pill 높이를 유지한 채 control 행 중앙에 정렬됩니다.',
  ),
  render: () => <MediumFilterDensityDemo />,
  play: async ({ canvasElement }) => {
    const toolbar = canvasElement.querySelector('[data-testid="medium-density-toolbar"]');
    const searchInput = toolbar?.querySelector('input[type="search"]');
    const searchSurface = searchInput?.parentElement;
    const selectTrigger = toolbar?.querySelector('[role="combobox"]');
    const filterHost = toolbar?.querySelector('[data-data-toolbar-filter-size]');
    if (!toolbar || !searchSurface || !selectTrigger || filterHost?.dataset.dataToolbarFilterSize !== 'md') {
      throw new Error('The medium DataToolbar fixture must expose search, Select, and the md filter context.');
    }
    const searchHeight = Math.round(searchSurface.getBoundingClientRect().height);
    const selectHeight = Math.round(selectTrigger.getBoundingClientRect().height);
    if (searchHeight !== 48 || selectHeight !== 48 || searchHeight !== selectHeight) {
      throw new Error('Medium DataToolbar search and field filters must share the 48px field-control height.');
    }
  },
};

export const ResponsiveMultiSelectFilters = {
  name: '반응형 · 다중 Select 필터',
  parameters: storyDescription(
    '검색과 여러 Select의 합산 폭이 들어가는 데스크톱에서는 한 줄을 유지하고, 좁은 표면에서만 필터 host와 내부 control이 순서대로 줄바꿈됩니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 1150 }}>
      <MultiSelectFilterDemo width="100%" testId="multi-filter-desktop" />
      <MultiSelectFilterDemo width={360} testId="multi-filter-narrow" />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const desktop = canvasElement.querySelector('[data-testid="multi-filter-desktop"]');
    const desktopControls = desktop?.querySelector('[data-data-toolbar-controls]');
    const desktopFilters = desktop?.querySelector('[data-data-toolbar-filter-size]');
    const desktopSelects = [...(desktopFilters?.children || [])];
    if (!desktopControls || !desktopFilters || desktopSelects.length !== 3) {
      throw new Error('Desktop fixture must expose search plus three Select filters.');
    }
    const desktopTops = desktopSelects.map((select) => Math.round(select.getBoundingClientRect().top));
    if (new Set(desktopTops).size !== 1 || Math.round(desktopFilters.getBoundingClientRect().height) !== 32) {
      throw new Error('Three Select filters must stay on one 32px line when their intrinsic widths fit.');
    }
    const filterGap = parseFloat(getComputedStyle(desktopFilters).columnGap || '0');
    const intrinsicWidth = desktopSelects.reduce((sum, select) => sum + select.getBoundingClientRect().width, 0)
      + filterGap * (desktopSelects.length - 1);
    if (desktopFilters.getBoundingClientRect().width + 1 < intrinsicWidth) {
      throw new Error('Desktop filter host must preserve the combined intrinsic width of its controls.');
    }

    const narrow = canvasElement.querySelector('[data-testid="multi-filter-narrow"]');
    const narrowControls = narrow?.querySelector('[data-data-toolbar-controls]');
    const narrowFilters = narrow?.querySelector('[data-data-toolbar-filter-size]');
    if (!narrow || !narrowControls || !narrowFilters) {
      throw new Error('Narrow fixture must expose the responsive controls and filter host.');
    }
    const narrowRect = narrow.getBoundingClientRect();
    const narrowControlsRect = narrowControls.getBoundingClientRect();
    const narrowFiltersRect = narrowFilters.getBoundingClientRect();
    if (narrow.scrollWidth > narrow.clientWidth + 1 || narrowFiltersRect.width > narrowControlsRect.width + 1) {
      throw new Error('Narrow filter wrapping must not overflow the toolbar width.');
    }
    if (narrowFiltersRect.height <= 32 || narrowFiltersRect.left < narrowRect.left - 1 || narrowFiltersRect.right > narrowRect.right + 1) {
      throw new Error('Narrow filters must wrap inside the available toolbar width.');
    }
  },
};

export const HeaderlessEmbeddedToolbar = {
  name: '사용법 · 검색과 필터만 있는 목록 머리줄',
  parameters: storyDescription(
    '제목·설명·건수·액션 없이 검색과 필터만 두는 embedded 툴바입니다. 빈 머리 행을 만들지 않아 검색줄 위아래 여백이 같고, 모든 슬롯이 비면 툴바 표면도 남지 않습니다.',
  ),
  render: () => (
    <main style={surfaceStyle}>
      <DataToolbar
        data-testid="headerless-toolbar"
        variant="embedded"
        searchPlaceholder="문서 검색"
        filters={<FilterChip active>최근 수정</FilterChip>}
      />
      <div data-testid="empty-toolbar-host">
        <DataToolbar searchable={false} />
      </div>
      <DataGrid columns={columns} rows={rows} getRowId={(row) => row.id} variant="embedded" />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const toolbar = canvasElement.querySelector('[data-testid="headerless-toolbar"]');
    const controls = toolbar?.querySelector('[data-data-toolbar-controls]');
    const emptyHost = canvasElement.querySelector('[data-testid="empty-toolbar-host"]');
    if (!toolbar || !controls || toolbar.querySelector('[data-data-toolbar-header]')) {
      throw new Error('A controls-only toolbar must omit its header row.');
    }
    if (toolbar.children.length !== 1) {
      throw new Error('A controls-only toolbar must expose exactly one grid row.');
    }
    const toolbarRect = toolbar.getBoundingClientRect();
    const controlsRect = controls.getBoundingClientRect();
    const styles = getComputedStyle(toolbar);
    const topSpace = controlsRect.top - toolbarRect.top - parseFloat(styles.borderTopWidth || '0');
    const bottomSpace = toolbarRect.bottom - controlsRect.bottom - parseFloat(styles.borderBottomWidth || '0');
    if (Math.abs(topSpace - bottomSpace) > 1) {
      throw new Error(`Controls-only toolbar padding must be symmetric (${topSpace}px vs ${bottomSpace}px).`);
    }
    if (!emptyHost || emptyHost.childElementCount !== 0) {
      throw new Error('A toolbar with no header or controls must render no empty surface.');
    }
  },
};

export const SearchlessEmbeddedToolbar = {
  name: '사용법 · 검색 없는 목록 머리줄',
  parameters: storyDescription(
    '검색 상태가 없는 목록에서 제목, 건수와 전체 범위 동작만 제공하는 상황입니다. 빈 검색 입력이나 불필요한 둘째 줄 없이 목록 표면의 머리줄만 남는지 확인하세요.',
  ),
  render: () => (
    <main style={surfaceStyle}>
      <DataToolbar
        data-testid="searchless-toolbar"
        variant="embedded"
        searchable={false}
        title="문서 목록"
        count={rows.length}
        actions={<Button size="sm" variant="ghost">최근 수정순</Button>}
      />
      <DataGrid columns={columns} rows={rows} getRowId={(row) => row.id} variant="embedded" />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const toolbar = canvasElement.querySelector('[data-testid="searchless-toolbar"]');
    if (!toolbar || toolbar.querySelector('input[type="search"]')) {
      throw new Error('searchable={false} must omit the search control.');
    }
    if (toolbar.children.length !== 1) {
      throw new Error('A searchless toolbar without filters must not render an empty controls row.');
    }
  },
};
