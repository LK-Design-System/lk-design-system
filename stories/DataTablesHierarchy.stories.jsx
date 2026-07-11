import React from 'react';
import {
  DataGrid,
  StatusBadge,
  Table,
} from '../src/index.js';
import { TableCard as TableCardStory } from './DataDisplay.shared.jsx';

const meta = {
  title: 'LDS Product/Data/Table',
  parameters: {
    docs: {
      description: {
        component: '정렬, 선택, 읽기 전용 표처럼 행 기반 데이터를 비교하는 DataGrid, Table 패턴입니다.',
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

export const TablePatterns = {
  name: '테이블 패턴',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 1040, minWidth: 0 }}>
      <section style={{ display: 'grid', gap: 'var(--space-3)', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, lineHeight: 1.35, color: 'var(--color-semantic-label-strong)' }}>항목 목록</h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, lineHeight: 1.45, color: 'var(--color-semantic-label-alternative)' }}>상태, 그룹, 진행률 정보를 한 화면에서 비교합니다.</p>
          </div>
          <StatusBadge tone="online">3개 등록</StatusBadge>
        </div>
        <DataGrid columns={columns} rows={rows} selectable style={{ minWidth: 0, background: 'var(--color-semantic-background-elevated-normal)' }} />
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-3)', minWidth: 0 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--color-semantic-label-strong)' }}>정적 표</h3>
          <p style={{ margin: '4px 0 0', fontSize: 12.5, lineHeight: 1.45, color: 'var(--color-semantic-label-alternative)' }}>정렬과 선택이 필요 없는 읽기 전용 데이터에는 기본 Table을 사용합니다.</p>
        </div>
        <Table columns={columns} rows={rows} style={{ minWidth: 0 }} />
      </section>

    </main>
  ),
};

export const ControlledCollectionStates = {
  name: 'Controlled collection 상태',
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
          sort={sort}
          sortingMode="manual"
          onSortChange={setSort}
          onRowActivate={() => {}}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 'var(--space-3)' }}>
          <DataGrid columns={columns.slice(0, 2)} rows={[]} loading loadingLabel="프로젝트를 불러오는 중" />
          <DataGrid columns={columns.slice(0, 2)} rows={[]} emptyLabel="조건에 맞는 프로젝트가 없습니다." />
          <DataGrid columns={columns.slice(0, 2)} rows={[]} error="목록을 불러오지 못했습니다." />
        </div>
      </main>
    );
  },
};

export const TableCard = { ...TableCardStory, name: 'Table card parity', tags: ['!dev', 'visual-parity'] };
