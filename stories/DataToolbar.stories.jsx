import {
  Button,
  DataGrid,
  DataToolbar,
  FilterChip,
  StatusBadge,
} from '../src/index.js';

const meta = {
  title: 'LK Product Extension/Data/Toolbar and Filters',
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

const columns = [
  { key: 'id', label: '계정', sortable: true },
  { key: 'group', label: '그룹' },
  { key: 'status', label: '상태', render: (row) => <StatusBadge tone={row.status === 'active' ? 'positive' : row.status === 'review' ? 'cautionary' : 'offline'}>{row.status}</StatusBadge> },
  { key: 'progress', label: '진행률', align: 'right', render: (row) => <strong style={{ color: row.progress <= 20 ? 'var(--bw-red)' : 'var(--label-strong)', fontVariantNumeric: 'tabular-nums' }}>{row.progress}%</strong> },
];

export const ToolbarWithGrid = {
  name: '검색과 선택 액션',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', width: '100%', maxWidth: 1040 }}>
      <DataToolbar
        title="사용자 목록"
        description="검색, 필터, 선택 후 작업을 DataGrid와 같은 밀도로 정렬합니다."
        count={rows.length}
        searchPlaceholder="사용자 검색"
        filters={<><FilterChip selected>활성</FilterChip><FilterChip>검토 필요</FilterChip><FilterChip>비활성</FilterChip></>}
        actions={<Button size="sm" variant="ghost">내보내기</Button>}
        selectedCount={2}
        bulkActions={<Button size="sm" variant="secondary">권한 변경</Button>}
      />
      <DataGrid columns={columns} rows={rows} selectable style={{ background: 'var(--surface-card)' }} />
    </main>
  ),
};
