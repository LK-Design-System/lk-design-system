import {
  Button,
  DataGrid,
  DataToolbar,
  FilterChip,
  StatusBadge,
} from '../src/index.js';

const meta = {
  title: 'LDS Product/Data/Toolbar and Filters',
  parameters: {
    docs: {
      description: {
        component: 'DataGrid/Table 상단에서 검색, 필터, 결과 수, 선택 bulk action을 정렬하는 DataToolbar입니다.',
      },
    },
  },
};

export default meta;

const rows = [
  { id: 'USR-104', group: '운영', status: 'active', progress: 86 },
  { id: 'USR-212', group: '검토', status: 'review', progress: 47 },
  { id: 'USR-318', group: '지원', status: 'disabled', progress: 12 },
];

const selectedRows = [0, 1];

const columns = [
  { key: 'id', label: '계정', sortable: true },
  { key: 'group', label: '그룹' },
  { key: 'status', label: '상태', render: (row) => <StatusBadge tone={row.status === 'active' ? 'positive' : row.status === 'review' ? 'cautionary' : 'offline'}>{row.status}</StatusBadge> },
  { key: 'progress', label: '진행률', align: 'right', render: (row) => <strong style={{ color: row.progress <= 20 ? 'var(--bw-red)' : 'var(--label-strong)', fontVariantNumeric: 'tabular-nums' }}>{row.progress}%</strong> },
];

const surfaceStyle = {
  width: '100%',
  maxWidth: 1040,
  border: '1px solid var(--bw-border)',
  borderRadius: 'var(--radius-lg)',
  background: 'var(--surface-card)',
  boxShadow: 'var(--shadow-xs)',
  overflow: 'hidden',
};

const toolbarStyle = {
  border: 0,
  borderBottom: '1px solid var(--bw-border)',
  borderRadius: 0,
  background: 'var(--surface-raised)',
};

const filterChipStyle = {
  height: 34,
  padding: '0 12px',
  borderRadius: 'var(--radius-md)',
  fontSize: 13,
};

export const ToolbarWithGrid = {
  name: '검색과 선택 액션',
  render: () => (
    <main style={surfaceStyle}>
      <DataToolbar
        size="sm"
        title="사용자 목록"
        description="검색, 필터, 선택 후 작업을 표와 같은 표면에서 정렬합니다."
        count={rows.length}
        searchPlaceholder="사용자 검색"
        filters={(
          <>
            <FilterChip active style={filterChipStyle}>활성</FilterChip>
            <FilterChip style={filterChipStyle}>검토 필요</FilterChip>
            <FilterChip style={filterChipStyle}>비활성</FilterChip>
          </>
        )}
        actions={<Button size="sm" variant="ghost">내보내기</Button>}
        selectedCount={selectedRows.length}
        bulkActions={<Button size="sm" variant="secondary">권한 변경</Button>}
        style={toolbarStyle}
      />
      <DataGrid
        columns={columns}
        rows={rows}
        selectable
        defaultSelectedRows={selectedRows}
        size="sm"
        style={{
          border: 0,
          borderRadius: 0,
          background: 'var(--surface-card)',
        }}
      />
    </main>
  ),
};
