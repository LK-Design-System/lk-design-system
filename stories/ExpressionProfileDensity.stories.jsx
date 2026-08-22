import React from 'react';
import {
  Button,
  DataGrid,
  DataToolbar,
  Drawer,
  DropdownMenu,
  FilterBar,
  Icon,
  ListCell,
  SideNav,
  StatusBadge,
  Table,
  Toolbar,
  Tree,
} from '../src/index.js';

const meta = {
  title: 'LDS Product/Patterns/Expression Profile Density',
  tags: ['!dev'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

function assertFixtureAndNarrowContainment(canvasElement, selector) {
  const fixture = canvasElement.querySelector(selector);
  if (!fixture) throw new Error(`Expression profile fixture ${selector} must render.`);

  const viewport = canvasElement.ownerDocument.documentElement;
  if (viewport.clientWidth <= 320 && viewport.scrollWidth > viewport.clientWidth + 1) {
    throw new Error('The 320px expression profile fixture must not introduce page-level overflow.');
  }

  return fixture;
}

const rows = [
  { id: 'CELL-A-104', asset: '팔레타이저 A', state: '정상', latency: '42 ms' },
  { id: 'CELL-B-212', asset: '검사 셀 B', state: '점검', latency: '118 ms' },
  { id: 'CELL-C-318', asset: '긴 이름의 포장 설비 C', state: '오프라인', latency: '—' },
];

const columns = [
  { key: 'asset', label: '설비', width: 180, truncate: true },
  { key: 'state', label: '상태', width: 96 },
  { key: 'latency', label: '지연', align: 'right', width: 84 },
];

const gridColumns = [
  { key: 'id', label: '식별자', sortable: true, minWidth: 128 },
  { key: 'asset', label: '설비', minWidth: 160 },
  {
    key: 'state',
    label: '상태',
    minWidth: 104,
    render: (row) => <StatusBadge tone={row.state === '정상' ? 'positive' : row.state === '점검' ? 'cautionary' : 'offline'}>{row.state}</StatusBadge>,
  },
  { key: 'latency', label: '지연', align: 'right', minWidth: 88 },
];

const treeNodes = [
  {
    id: 'line-a',
    label: '생산 라인 A',
    description: '3개 셀',
    children: [
      { id: 'cell-a-1', label: '팔레타이저 A-1', meta: '정상' },
      { id: 'cell-a-2', label: '검사 셀 A-2', meta: '점검' },
    ],
  },
  { id: 'line-b', label: '생산 라인 B', description: '대기' },
];

function DataDenseFixture() {
  const [selected, setSelected] = React.useState([]);
  return (
    <main
      data-expression-fixture="data-dense"
      style={{ display: 'grid', gap: 'var(--space-4)', width: '100%', minWidth: 0, padding: 'var(--space-4)', boxSizing: 'border-box', background: 'var(--color-semantic-background-normal-normal)' }}
    >
      <DataToolbar
        data-density-surface="data-toolbar"
        title="설비 운영"
        description="반복 데이터와 작업 chrome의 밀도를 함께 비교합니다."
        count={rows.length}
        searchable={false}
        actions={<Button size="sm">내보내기</Button>}
        size="md"
      />
      <FilterBar
        data-density-surface="filter-bar"
        controls={<Button size="sm" variant="ghost">조건 추가</Button>}
        activeFilters={[{ id: 'state', label: '상태', value: '정상·점검' }]}
        resultCount={rows.length}
        size="md"
      />
      <section data-density-surface="table" style={{ minWidth: 0 }}>
        <Table caption="최근 설비" columns={columns} rows={rows} rowHeaderKey="asset" size="md" />
      </section>
      <section data-density-surface="data-grid" style={{ minWidth: 0, minHeight: 250 }}>
        <DataGrid
          aria-label="설비 상태 그리드"
          columns={gridColumns}
          rows={rows}
          getRowId={(row) => row.id}
          selectable
          selectedRows={selected}
          onSelectionChange={setSelected}
          getRowSelectionLabel={(row) => `${row.asset} 선택`}
          size="md"
        />
      </section>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 'var(--space-3)', minWidth: 0 }}>
        <div data-density-surface="list" style={{ minWidth: 0, border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <ListCell title="실시간 이벤트" description="최근 5분 · 12건" trailing="열기" onClick={() => {}} divider />
          <ListCell title="보류된 점검" description="담당자 확인 필요" trailing="3건" onClick={() => {}} verticalPadding="small" />
        </div>
        <div data-density-surface="tree" style={{ minWidth: 0, border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-1)' }}>
          <Tree aria-label="설비 트리" nodes={treeNodes} defaultExpanded={['line-a']} />
        </div>
      </section>
    </main>
  );
}

export const DataDense = {
  tags: ['visual-parity'],
  render: () => <DataDenseFixture />,
  play: async ({ canvasElement }) => {
    const fixture = assertFixtureAndNarrowContainment(canvasElement, '[data-expression-fixture="data-dense"]');
    const densitySurfaces = fixture.querySelectorAll('[data-density-surface]');
    const grid = fixture.querySelector('[aria-label="설비 상태 그리드"]');
    if (densitySurfaces.length !== 6 || !grid) {
      throw new Error('The data-density fixture must expose all six governed surfaces and its named grid.');
    }
  },
};

const navigationItems = [
  { heading: '운영' },
  { value: 'overview', label: '운영 개요', icon: <Icon name="home" size={18} /> },
  {
    value: 'assets',
    label: '설비',
    icon: <Icon name="layers" size={18} />,
    children: [
      { value: 'assets-live', label: '실시간 상태' },
      { value: 'assets-history', label: '점검 이력' },
    ],
  },
  { value: 'events', label: '이벤트', icon: <Icon name="bell" size={18} />, badge: 8 },
];

function NavigationOverlayFixture() {
  const [value, setValue] = React.useState('assets-live');
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const drawerTriggerRef = React.useRef(null);

  return (
    <main
      data-expression-fixture="navigation-overlay"
      style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--space-3)', width: '100%', minHeight: 560, minWidth: 0, padding: 'var(--space-3)', boxSizing: 'border-box', background: 'var(--color-semantic-background-normal-normal)' }}
    >
      <SideNav
        aria-label="운영 탐색"
        items={navigationItems}
        value={value}
        onChange={setValue}
        width={200}
        style={{ maxWidth: '100%', minHeight: 520 }}
      />
      <section style={{ display: 'grid', flex: '1 1 260px', alignContent: 'start', gap: 'var(--space-4)', minWidth: 0 }}>
        <Toolbar aria-label="설비 작업" style={{ maxWidth: '100%', justifySelf: 'start' }}>
          <Button ref={drawerTriggerRef} size="sm" onClick={() => setDrawerOpen(true)}>필터</Button>
          <DropdownMenu
            trigger={<Button size="sm" variant="ghost">보기</Button>}
            defaultOpen
            items={[
              { label: '상태 열 표시', checked: true },
              { label: '지연 열 표시', checked: true },
              { divider: true },
              { label: '기본값 복원' },
            ]}
            variant="checkbox"
          />
        </Toolbar>
        <div style={{ minHeight: 280, minWidth: 0, padding: 'var(--space-4)', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)' }}>
          <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--headline2-size)' }}>설비 상태</h2>
          <p style={{ color: 'var(--color-semantic-label-alternative)' }}>탐색, 도구 모음, 메뉴와 패널의 밀도·키보드 흐름을 함께 검증합니다.</p>
        </div>
      </section>
      <Drawer
        open={drawerOpen}
        title="설비 필터"
        subtitle="현재 상태 화면에 적용합니다."
        returnFocusRef={drawerTriggerRef}
        onClose={() => setDrawerOpen(false)}
        footer={<Button size="sm" onClick={() => setDrawerOpen(false)}>적용</Button>}
      >
        <ListCell title="정상 설비" trailing="12" onClick={() => {}} verticalPadding="small" />
        <ListCell title="점검 필요" trailing="3" onClick={() => {}} verticalPadding="small" />
      </Drawer>
    </main>
  );
}

export const NavigationOverlay = {
  tags: ['visual-parity'],
  render: () => <NavigationOverlayFixture />,
  play: async ({ canvasElement }) => {
    const fixture = assertFixtureAndNarrowContainment(canvasElement, '[data-expression-fixture="navigation-overlay"]');
    const navigation = fixture.querySelector('[aria-label="운영 탐색"]');
    const toolbar = fixture.querySelector('[aria-label="설비 작업"]');
    if (!navigation || !toolbar) {
      throw new Error('The navigation-overlay fixture must expose named navigation and toolbar landmarks.');
    }
  },
};
