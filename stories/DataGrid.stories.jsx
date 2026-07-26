import React from 'react';
import { userEvent } from 'storybook/test';
import {
  Button,
  DataGrid,
  DataToolbar,
  Pagination,
  StatusBadge,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Data/Collections/Data Grid',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-product-data-collections-data-grid--selectable-list',
      eyebrow: 'Product / Data / Data Grid',
      title: '사용자가 많은 행을 정렬·선택하고 필요한 작업 범위를 좁힙니다',
      description:
        '여러 열의 레코드를 비교하며 정렬·선택·확장·페이지 이동이 필요할 때 적합합니다. 읽기 전용 소규모 데이터나 단순 label/value 쌍에는 Data Grid 대신 Table 또는 Description List를 사용하세요.',
    },
    docs: {
      description: {
        component: '정렬, 선택, 페이지네이션, 확장 행을 지원하는 행 기반 컬렉션 DataGrid 패턴입니다.',
      },
    },
  },
};

export default meta;

const rows = [
  { id: 'ITEM-104', group: '문서', status: '진행 중', progress: 86 },
  { id: 'ITEM-212', group: '컴포넌트', status: '검토 중', progress: 47 },
  { id: 'ITEM-318', group: '토큰', status: '중지', progress: 12 },
];

const statusTone = { '진행 중': 'positive', '검토 중': 'cautionary', 중지: 'offline' };

function ProgressCell({ value }) {
  const tone = value <= 20 ? 'var(--color-semantic-status-negative)' : value <= 50 ? 'var(--color-semantic-status-cautionary)' : 'var(--color-semantic-primary-normal)';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, width: '100%', minWidth: 112 }}>
      <span style={{ position: 'relative', width: 64, height: 5, borderRadius: 'var(--radius-pill)', background: 'var(--color-semantic-fill-strong)', overflow: 'hidden' }}>
        <span style={{ position: 'absolute', insetBlock: 0, left: 0, width: `${value}%`, borderRadius: 'inherit', background: tone }} />
      </span>
      <strong style={{ minWidth: 36, color: 'var(--color-semantic-label-strong)', fontVariantNumeric: 'tabular-nums' }}>{value}%</strong>
    </span>
  );
}

const columns = [
  { key: 'id', label: '항목', sortable: true },
  { key: 'group', label: '그룹' },
  { key: 'status', label: '상태', render: (row) => <StatusBadge tone={statusTone[row.status]}>{row.status}</StatusBadge> },
  { key: 'progress', label: '진행률', align: 'right', render: (row) => <ProgressCell value={row.progress} /> },
];

export const SelectableList = {
  name: '개요',
  parameters: storyDescription(
    '상태와 진행률이 다른 항목을 선택 가능한 행으로 비교하는 상황입니다. 열의 읽기 순서와 선택 affordance가 분명하고 상태가 색에만 의존하지 않는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-3)', width: '100%', maxWidth: 1040, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 15, lineHeight: 1.35, color: 'var(--color-semantic-label-strong)' }}>항목 목록</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, lineHeight: 1.45, color: 'var(--color-semantic-label-alternative)' }}>상태, 그룹, 진행률 정보를 한 화면에서 비교합니다.</p>
        </div>
        <StatusBadge tone="online">3개 등록</StatusBadge>
      </div>
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        selectable
        selectionEntityLabel="작업"
        getRowSelectionLabel={(row) => `작업 ${row.id}`}
        style={{ minWidth: 0, background: 'var(--color-semantic-background-elevated-normal)' }}
      />
    </main>
  ),
};

export const ControlledCollectionStates = {
  name: '상호작용 · 선택과 정렬 제어 · 로딩·빈 상태·오류',
  parameters: storyDescription(
    '제품이 선택·정렬 상태를 제어하면서 loading·empty·error를 전환하는 상황입니다. 제어 상태가 표와 동기화되고 각 리소스 상태가 적절한 의미와 복구 단서를 제공하는지 확인하세요.',
  ),
  render: () => {
    const [sort, setSort] = React.useState({ key: 'id', dir: 'asc' });
    const [selectedRows, setSelectedRows] = React.useState(['ITEM-212']);
    return (
      <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 1040 }}>
        <DataGrid
          columns={columns}
          rows={rows}
          getRowId={(row) => row.id}
          selectable
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          selectionEntityLabel="작업"
          getRowSelectionLabel={(row) => `작업 ${row.id}`}
          sort={sort}
          sortingMode="manual"
          onSortChange={setSort}
          onRowActivate={() => {}}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 'var(--space-3)' }}>
          <DataGrid data-testid="loading-data-grid" style={{ height: 220 }} columns={columns.slice(0, 2)} rows={[]} loading loadingLabel="프로젝트를 불러오는 중" />
          <DataGrid data-testid="empty-data-grid" style={{ height: 220 }} columns={columns.slice(0, 2)} rows={[]} emptyLabel="조건에 맞는 프로젝트가 없습니다." />
          <DataGrid data-testid="error-data-grid" style={{ height: 220 }} columns={columns.slice(0, 2)} rows={[]} error="목록을 불러오지 못했습니다." />
        </div>
      </main>
    );
  },
  play: async ({ canvasElement }) => {
    const pageToggle = canvasElement.querySelector('input[aria-label="현재 페이지 작업 3개 선택"]');
    const selectedRow = canvasElement.querySelector('input[aria-label="작업 ITEM-212 선택 해제"]');
    if (!pageToggle || !selectedRow?.checked || !pageToggle.indeterminate) {
      throw new Error('The legacy selectedRows API must retain explicit IDs and a partial page checkbox.');
    }

    await userEvent.click(pageToggle);
    const bulkGroup = canvasElement.querySelector('[role="group"][aria-label="작업 일괄 작업"]');
    if (bulkGroup?.querySelector('[data-grid-selection-count]')?.textContent?.trim() !== '3개 선택됨') {
      throw new Error('The legacy page select-all callback must still receive all visible IDs.');
    }

    const clear = canvasElement.querySelector('button[aria-label="작업 선택 모두 해제"]');
    if (!clear) throw new Error('The legacy controlled selection must expose the built-in clear action.');
    await userEvent.click(clear);
    if (canvasElement.querySelector('[role="group"][aria-label="작업 일괄 작업"]')) {
      throw new Error('The built-in clear action must emit an empty legacy selectedRows array.');
    }

    for (const state of ['loading', 'empty', 'error']) {
      const grid = canvasElement.querySelector(`[data-testid="${state}-data-grid"]`);
      const header = grid?.querySelector('thead');
      const stateRegion = grid?.querySelector('.lk-data-grid__state');
      if (!grid || !header || !stateRegion) throw new Error(`${state} DataGrid state fixture is incomplete.`);
      const gridRect = grid.getBoundingClientRect();
      const headerRect = header.getBoundingClientRect();
      const stateRect = stateRegion.getBoundingClientRect();
      const bodyCenter = (headerRect.bottom + gridRect.bottom) / 2;
      const stateCenter = stateRect.top + stateRect.height / 2;
      if (Math.abs(stateCenter - bodyCenter) > 2) {
        throw new Error(`${state} state must center within the available body below the table header.`);
      }
    }
  },
};

function CustomRoleCheckbox({ label }) {
  const [checked, setChecked] = React.useState(false);
  const toggle = () => setChecked((current) => !current);
  return (
    <span
      role="checkbox"
      tabIndex={0}
      aria-label={label}
      aria-checked={checked}
      onClick={toggle}
      onKeyDown={(event) => {
        if (event.key === ' ') {
          event.preventDefault();
          toggle();
        }
      }}
      style={{ display: 'inline-flex', alignItems: 'center', minHeight: 28, padding: '0 8px', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
    >
      {checked ? '확인됨' : '확인 필요'}
    </span>
  );
}

const eligibilityRows = [
  { id: 'ITEM-104', group: '문서', selectable: true },
  { id: 'ITEM-212', group: '권한 없음', selectable: false },
  { id: 'ITEM-318', group: '토큰', selectable: true },
];

const eligibilityColumns = [
  { key: 'id', label: '항목' },
  { key: 'group', label: '그룹' },
  {
    key: 'followUp',
    label: '후속 점검',
    render: (row) => <CustomRoleCheckbox label={`${row.id} 후속 점검`} />,
  },
];

export const RowEligibilityAndInteractiveGuard = {
  name: '사용법 · 선택할 수 없는 행과 행 내부 조작',
  parameters: storyDescription(
    '일부 행은 선택할 수 없고 다른 행에는 별도 버튼이나 체크박스가 있는 상황입니다. 행 선택과 내부 조작이 충돌하지 않고 비대상 행의 이유가 이해되는지 확인하세요.',
  ),
  render: () => {
    const [selectionModel, setSelectionModel] = React.useState({ mode: 'explicit', selectedIds: [] });
    const [activatedRow, setActivatedRow] = React.useState('없음');
    const [selectAllScope, setSelectAllScope] = React.useState('page');
    return (
      <main style={{ display: 'grid', gap: 'var(--space-3)', width: '100%', maxWidth: 760 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            size="sm"
            variant="ghost"
            aria-label="전체 결과 선택 범위 사용"
            aria-pressed={selectAllScope === 'allMatching'}
            onClick={() => setSelectAllScope((current) => current === 'page' ? 'allMatching' : 'page')}
          >
            {selectAllScope === 'allMatching' ? '현재 페이지 범위' : '전체 결과 범위'}
          </Button>
        </div>
        <DataGrid
          tableLabel="선택 자격 검증 목록"
          columns={eligibilityColumns}
          rows={eligibilityRows}
          getRowId={(row) => row.id}
          selectable
          getRowCanSelect={(row) => row.selectable}
          selectionEntityLabel="작업"
          getRowSelectionLabel={(row) => `작업 ${row.id}`}
          selectionModel={selectionModel}
          onSelectionModelChange={setSelectionModel}
          selectAllScope={selectAllScope}
          totalCount={eligibilityRows.length}
          onRowActivate={(row) => setActivatedRow(row.id)}
        />
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--label2-size)' }}>
          <span>행 진입: <output data-testid="activated-row">{activatedRow}</output></span>
          <span>선택 model: <output data-testid="eligibility-selection-model">{JSON.stringify(selectionModel)}</output></span>
        </div>
      </main>
    );
  },
  play: async ({ canvasElement }) => {
    const disabledRow = canvasElement.querySelector('input[aria-label="작업 ITEM-212 선택할 수 없음"]');
    const pageSelectAll = canvasElement.querySelector('input[aria-label="현재 페이지 작업 2개 선택"]');
    if (!disabledRow?.disabled || disabledRow.checked || !pageSelectAll) {
      throw new Error('An ineligible row must expose a named disabled checkbox and be excluded from select-all count.');
    }

    const customCheckbox = canvasElement.querySelector('[role="checkbox"][aria-label="ITEM-104 후속 점검"]');
    if (!customCheckbox) throw new Error('The custom role checkbox fixture is missing.');
    await userEvent.click(customCheckbox);
    if (customCheckbox.getAttribute('aria-checked') !== 'true'
      || canvasElement.querySelector('[data-testid="activated-row"]')?.textContent !== '없음') {
      throw new Error('A role-based custom control must handle its click without activating the row.');
    }

    await userEvent.click(pageSelectAll);
    const pageSelection = JSON.parse(canvasElement.querySelector('[data-testid="eligibility-selection-model"]')?.textContent ?? '{}');
    if (pageSelection.mode !== 'explicit' || pageSelection.selectedIds?.join(',') !== 'ITEM-104,ITEM-318') {
      throw new Error('Page select-all must emit only eligible visible row IDs.');
    }
    if (canvasElement.querySelector('[role="status"]')?.textContent?.trim() !== '2개 선택됨'
      || !canvasElement.querySelector('input[aria-label="작업 ITEM-104 선택 해제"]')?.checked
      || !canvasElement.querySelector('input[aria-label="작업 ITEM-318 선택 해제"]')?.checked
      || disabledRow.checked) {
      throw new Error('Select-all must select only eligible rows and keep the disabled row unselected.');
    }

    const clear = canvasElement.querySelector('button[aria-label="작업 선택 모두 해제"]');
    const allMatchingScope = canvasElement.querySelector('button[aria-label="전체 결과 선택 범위 사용"]');
    if (!clear || !allMatchingScope) throw new Error('The all-matching transition fixture is incomplete.');
    await userEvent.click(clear);
    await userEvent.click(allMatchingScope);
    const allMatchingSelectAll = canvasElement.querySelector('input[aria-label="전체 결과 작업 2개 선택"]');
    if (!allMatchingSelectAll) throw new Error('All-matching select-all must use the eligible known-result count.');
    await userEvent.click(allMatchingSelectAll);
    const allMatchingSelection = JSON.parse(canvasElement.querySelector('[data-testid="eligibility-selection-model"]')?.textContent ?? '{}');
    if (allMatchingSelection.mode !== 'allMatching'
      || allMatchingSelection.excludedIds?.length !== 1
      || allMatchingSelection.excludedIds[0] !== 'ITEM-212') {
      throw new Error('All-matching selection must emit the visible ineligible row as an explicit exclusion.');
    }
  },
};

const dashboardRows = [
  { id: 'RBT-101', site: '판교 물류센터 A동 자율주행 구역', status: '가동', group: '주행 운영', progress: 86, detail: '마지막 점검 2026-07-10 · 지도 v42' },
  { id: 'RBT-102', site: '인천공항 제2터미널 수하물 처리 구역', status: '점검', group: '공항 운영', progress: 64, detail: '예방 정비 예정 · 배터리 모듈 확인' },
  { id: 'RBT-103', site: '고리 발전소 원격 검사 통로', status: '대기', group: '안전 운영', progress: 42, detail: '운영 승인 대기 · 안전 interlock 정상' },
  { id: 'RBT-104', site: '대전 연구소 장기 검증 시험장', status: '가동', group: '검증 운영', progress: 91, detail: '연속 운전 38시간 · 오류 없음' },
  { id: 'RBT-105', site: '부산 항만 컨테이너 이송 구역', status: '가동', group: '항만 운영', progress: 73, detail: '경로 재계산 2회 · 원격 개입 없음' },
  { id: 'RBT-106', site: '평택 반도체 공장 물류 연결 통로', status: '점검', group: '시설 운영', progress: 55, detail: 'LiDAR 청소 필요 · 다음 점검 14:00' },
  { id: 'RBT-107', site: '창원 조립 공장 완제품 검사 라인', status: '대기', group: '품질 운영', progress: 29, detail: '작업 지시 대기 · 카메라 calibration 완료' },
  { id: 'RBT-108', site: '제주 실외 자율주행 장기 시험 구역', status: '가동', group: '필드 운영', progress: 78, detail: '강풍 모드 동작 중 · GNSS 정상' },
];

const dashboardStatusTone = { 가동: 'positive', 점검: 'cautionary', 대기: 'offline' };

function DashboardCollectionPattern({ narrow = false }) {
  const [items, setItems] = React.useState(dashboardRows);
  const [page, setPage] = React.useState(1);
  const [selectionModel, setSelectionModel] = React.useState({ mode: 'explicit', selectedIds: [] });
  const [sortModel, setSortModel] = React.useState([]);
  const [expandedRowIds, setExpandedRowIds] = React.useState([]);
  const [visibleColumnKeys, setVisibleColumnKeys] = React.useState(['id', 'site', 'status', 'group', 'progress']);
  const [columnOrder, setColumnOrder] = React.useState(['id', 'site', 'status', 'group', 'progress']);
  const [editingCell, setEditingCell] = React.useState(null);
  const pageSize = 4;
  const pageCount = Math.ceil(items.length / pageSize);
  const pageStart = (page - 1) * pageSize;
  const pageRows = items.slice(pageStart, pageStart + pageSize);
  const firstPageRow = pageRows[0];
  const progressVisible = visibleColumnKeys.includes('progress');
  const statusFirst = columnOrder[0] === 'status';
  const columnsWithOperations = [
    { key: 'id', label: '장비', accessibleLabel: '장비', sortable: true, width: 132, minWidth: 132, pinned: 'start' },
    { key: 'site', label: '현장 및 설치 위치', accessibleLabel: '현장 및 설치 위치', sortable: true, minWidth: 300 },
    { key: 'status', label: '상태', sortable: true, width: 120, minWidth: 120, render: (row) => <StatusBadge tone={dashboardStatusTone[row.status]}>{row.status}</StatusBadge> },
    { key: 'group', label: '운영 그룹', sortable: true, minWidth: 160 },
    {
      key: 'progress',
      label: '진행률',
      sortable: true,
      align: 'right',
      width: 140,
      minWidth: 140,
      render: (row) => <strong style={{ color: 'var(--color-semantic-label-strong)', fontVariantNumeric: 'tabular-nums' }}>{row.progress}%</strong>,
      editor: (row) => (
        <input
          type="number"
          min={0}
          max={100}
          value={row.progress}
          aria-label={`${row.id} 진행률 편집`}
          onChange={(event) => {
            const progress = Number(event.target.value);
            setItems((current) => current.map((item) => item.id === row.id ? { ...item, progress } : item));
          }}
          style={{ width: 72, height: 30, padding: '0 8px', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-md)', font: 'inherit' }}
        />
      ),
    },
  ];

  return (
    <main
      data-testid={narrow ? 'narrow-dashboard-collection' : 'dashboard-collection'}
      style={{ width: narrow ? 320 : '100%', maxWidth: narrow ? '100%' : 1040, minWidth: 0 }}
    >
      <section style={{ border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)', overflow: 'hidden' }}>
        <DataToolbar
          size="sm"
          title="장비 운영 목록"
          description="Pagination과 열 설정, 다중 정렬, 확장 행을 조합한 collection 패턴"
          count={items.length}
          searchPlaceholder="장비 검색"
          actions={(
            <>
              <Button
                size="sm"
                variant="ghost"
                aria-pressed={editingCell != null}
                onClick={() => setEditingCell((current) => current ? null : firstPageRow ? { rowId: firstPageRow.id, columnKey: 'progress' } : null)}
              >
                첫 행 진행률 편집
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setVisibleColumnKeys((current) => progressVisible ? current.filter((key) => key !== 'progress') : [...current, 'progress'])}
              >
                진행률 열 {progressVisible ? '숨기기' : '표시'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                aria-pressed={statusFirst}
                onClick={() => setColumnOrder(statusFirst ? ['id', 'site', 'status', 'group', 'progress'] : ['status', 'id', 'site', 'group', 'progress'])}
              >
                상태 열 앞으로
              </Button>
            </>
          )}
          variant="embedded"
        />
        <DataGrid
          data-testid="dashboard-data-grid"
          tableLabel="장비 운영 목록"
          columns={columnsWithOperations}
          rows={pageRows}
          visibleColumnKeys={visibleColumnKeys}
          columnOrder={columnOrder}
          getRowId={(row) => row.id}
          getRowSelectionLabel={(row) => `장비 ${row.id}`}
          selectionEntityLabel="장비"
          selectable
          selectionModel={selectionModel}
          onSelectionModelChange={setSelectionModel}
          selectAllScope="allMatching"
          totalCount={items.length}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          multiSort
          sortingMode="manual"
          expandedRowIds={expandedRowIds}
          onExpandedRowIdsChange={setExpandedRowIds}
          getRowCanExpand={(row) => Boolean(row.detail)}
          renderExpandedRow={(row) => (
            <div style={{ display: 'grid', gap: 'var(--space-1)' }}>
              <strong style={{ color: 'var(--color-semantic-label-strong)', fontSize: 'var(--label2-size)' }}>{row.site}</strong>
              <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--label2-size)' }}>{row.detail}</span>
            </div>
          )}
          editingCell={editingCell}
          stickyHeader
          size="sm"
          variant="embedded"
          style={{ maxHeight: 258, background: 'var(--color-semantic-background-elevated-normal)' }}
        />
        <Pagination
          page={page}
          count={pageCount}
          onChange={(nextPage) => {
            setPage(nextPage);
            setEditingCell(null);
          }}
          variant={narrow ? 'minimize' : 'compact'}
          leadingContent={<span style={{ fontSize: 'var(--label2-size)', color: 'var(--color-semantic-label-alternative)', whiteSpace: 'nowrap' }}>{pageStart + 1}-{Math.min(pageStart + pageSize, items.length)} / {items.length}</span>}
          trailingContent={<span style={{ fontSize: 'var(--label2-size)', color: 'var(--color-semantic-label-alternative)', whiteSpace: 'nowrap' }}>{page} / {pageCount}</span>}
          style={{ display: 'flex', width: '100%', boxSizing: 'border-box', padding: narrow ? '8px' : '10px 12px', borderTop: '1px solid var(--color-semantic-line-solid-normal)' }}
        />
      </section>
    </main>
  );
}

export const DashboardCollectionContracts = {
  name: '상호작용 · 페이지 이동 · 열 설정과 확장 행',
  parameters: storyDescription(
    '대시보드 컬렉션에서 페이지 이동·열 표시 설정·확장 상세를 함께 사용하는 상황입니다. 각 제어가 같은 데이터 범위를 대상으로 하고 확장 행의 읽기 순서가 유지되는지 확인하세요.',
  ),
  render: () => <DashboardCollectionPattern />,
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-testid="dashboard-collection"]');
    const grid = root?.querySelector('[data-testid="dashboard-data-grid"]');
    const table = grid?.querySelector('table[aria-label="장비 운영 목록"]');
    if (!root || !grid || !table || table.getAttribute('aria-colcount') !== '7') {
      throw new Error('The DataGrid + Pagination fixture and full logical column count must render.');
    }
    const headerCells = [...table.querySelectorAll('thead th[scope="col"]')];
    if (headerCells.length !== 7 || headerCells.some((cell) => cell.getAttribute('scope') !== 'col')) {
      throw new Error('Expansion, selection, and data columns must preserve native column-header semantics.');
    }
    const stickyHeader = table.querySelector('th[data-column-key="id"]');
    if (!stickyHeader || getComputedStyle(stickyHeader).position !== 'sticky') {
      throw new Error('stickyHeader must apply to visible native header cells.');
    }

    const idSort = table.querySelector('button[aria-label="장비, 정렬"]');
    if (!idSort) throw new Error('The first sortable header is missing.');
    idSort.focus();
    await userEvent.keyboard('{Enter}');
    const primarySort = table.querySelector('th[data-column-key="id"][aria-sort="ascending"]');
    const siteSort = table.querySelector('button[aria-label="현장 및 설치 위치, 정렬"]');
    if (!primarySort || !siteSort) throw new Error('Enter must create the primary ascending sort.');
    siteSort.focus();
    await userEvent.keyboard('{Enter}');
    if (table.querySelectorAll('th[aria-sort]').length !== 1
      || !table.querySelector('button[aria-label="장비, 1순위 오름차순 정렬, 정렬 변경"]')
      || !table.querySelector('button[aria-label="현장 및 설치 위치, 2순위 오름차순 정렬, 정렬 변경"]')) {
      throw new Error('Multi-sort must keep one aria-sort owner and expose every priority in button names.');
    }

    const expand = table.querySelector('button[aria-label="장비 RBT-101 세부 정보 펼치기"]');
    if (!expand) throw new Error('The entity-labeled expansion control is missing.');
    expand.focus();
    await userEvent.keyboard(' ');
    const collapse = table.querySelector('button[aria-label="장비 RBT-101 세부 정보 접기"]');
    const detailId = collapse?.getAttribute('aria-controls');
    const detail = detailId ? table.querySelector(`#${detailId}`) : null;
    if (collapse?.getAttribute('aria-expanded') !== 'true' || detail?.getAttribute('role') !== 'region') {
      throw new Error('Space must expand one detail row and preserve aria-expanded/aria-controls.');
    }

    const edit = root.querySelector('button[aria-pressed="false"]');
    if (!edit || edit.textContent?.trim() !== '첫 행 진행률 편집') throw new Error('The product-owned edit trigger is missing.');
    await userEvent.click(edit);
    if (!table.querySelector('input[aria-label="RBT-101 진행률 편집"][data-column-key]') && !table.querySelector('input[aria-label="RBT-101 진행률 편집"]')) {
      throw new Error('editingCell must replace only the matching cell with its controlled editor slot.');
    }
    await userEvent.click(root.querySelector('button[aria-pressed="true"]'));

    const hideProgress = [...root.querySelectorAll('button')].find((button) => button.textContent?.trim() === '진행률 열 숨기기');
    if (!hideProgress) throw new Error('The product column-visibility control is missing.');
    await userEvent.click(hideProgress);
    if (table.querySelector('th[data-column-key="progress"]') || table.getAttribute('aria-colcount') !== '7') {
      throw new Error('Hidden columns must leave the DOM while the logical aria-colcount stays complete.');
    }

    const moveStatus = [...root.querySelectorAll('button')].find((button) => button.textContent?.trim() === '상태 열 앞으로');
    if (!moveStatus) throw new Error('The product column-order control is missing.');
    await userEvent.click(moveStatus);
    const orderedKeys = [...table.querySelectorAll('thead th[data-column-key]')].map((cell) => cell.getAttribute('data-column-key'));
    if (orderedKeys.join(',') !== 'id,status,site,group') {
      throw new Error('columnOrder must reorder center columns while the pinned start column stays first.');
    }

    const selectAll = table.querySelector('input[aria-label="전체 결과 장비 8개 선택"]');
    if (!selectAll) throw new Error('The all-results selection control is missing.');
    await userEvent.click(selectAll);
    if (root.querySelector('[role="status"]')?.textContent?.trim() !== '8개 선택됨') {
      throw new Error('All-matching selection must use the collection total before paging.');
    }
    const next = root.querySelector('button[aria-label="next page"]');
    if (!next) throw new Error('The composed Pagination next action is missing.');
    await userEvent.click(next);
    const pageTwoRow = table.querySelector('input[aria-label="장비 RBT-105 선택 해제"]');
    if (!pageTwoRow?.checked) throw new Error('All-matching selection must persist on the next page.');
    await userEvent.click(pageTwoRow);
    if (root.querySelector('[role="status"]')?.textContent?.trim() !== '7개 선택됨') {
      throw new Error('A page-two exclusion must update the lossless collection count.');
    }
    const previous = root.querySelector('button[aria-label="previous page"]');
    if (!previous) throw new Error('The composed Pagination previous action is missing.');
    await userEvent.click(previous);
    if (!table.querySelector('input[aria-label="장비 RBT-101 선택 해제"]')?.checked) {
      throw new Error('Selection must remain stable when returning to the first page.');
    }
    if (root.scrollWidth > root.clientWidth + 1) {
      throw new Error('The normal-width composition must not create page-level horizontal overflow.');
    }
  },
};

export const NarrowPinnedColumns = {
  name: '반응형 · 좁은 폭 · 고정 열과 긴 열 이름',
  parameters: storyDescription(
    '좁은 컨테이너에서 핵심 열을 고정하고 긴 열 이름과 값을 탐색하는 상황입니다. pinned 열이 맥락을 유지하고 수평 스크롤 중 겹침이나 잘림이 없는지 확인하세요.',
  ),
  render: () => <DashboardCollectionPattern narrow />,
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-testid="narrow-dashboard-collection"]');
    const grid = root?.querySelector('[data-testid="dashboard-data-grid"]');
    const table = grid?.querySelector('table[aria-label="장비 운영 목록"]');
    const pinnedHeader = table?.querySelector('th[data-column-key="id"]');
    const siteHeader = table?.querySelector('th[data-column-key="site"]');
    if (!root || !grid || !table || !pinnedHeader || !siteHeader) throw new Error('The narrow pinned-column fixture is incomplete.');
    if (root.scrollWidth > root.clientWidth + 1 || grid.scrollWidth <= grid.clientWidth) {
      throw new Error('Narrow layout must contain overflow inside DataGrid instead of the page.');
    }
    const siteRect = siteHeader.getBoundingClientRect();
    if (siteRect.width < 299) throw new Error('A long column must honor its configured minWidth.');
    const gridLeft = grid.getBoundingClientRect().left;
    const pinnedBefore = pinnedHeader.getBoundingClientRect().left;
    grid.scrollLeft = Math.min(360, grid.scrollWidth - grid.clientWidth);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const pinnedAfter = pinnedHeader.getBoundingClientRect().left;
    if (getComputedStyle(pinnedHeader).position !== 'sticky'
      || Math.abs(pinnedAfter - gridLeft - 88) > 2
      || Math.abs(pinnedAfter - pinnedBefore) > 2) {
      throw new Error('The pinned data column must remain after expansion and selection utility columns while scrolling.');
    }
    const expansionHeader = table.querySelector('thead th[aria-colindex="1"]');
    const selectionHeader = table.querySelector('thead th[aria-colindex="2"]');
    if (getComputedStyle(expansionHeader).position !== 'sticky' || getComputedStyle(selectionHeader).position !== 'sticky') {
      throw new Error('Expansion and selection utility headers must remain pinned at the start edge.');
    }
    grid.scrollLeft = 0;
  },
};
