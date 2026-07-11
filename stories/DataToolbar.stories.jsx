import React from 'react';
import {
  Button,
  DataGrid,
  DataToolbar,
  FilterChip,
  Icon,
  StatusBadge,
  TextButton,
} from '../src/index.js';

const meta = {
  title: 'LDS Product/Data/Toolbar and Filters',
  parameters: {
    docs: {
      description: {
        component: '데이터 표 상단에서 검색, 필터, 결과 수, 선택 bulk action을 정렬하는 DataToolbar입니다.',
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

const selectedRows = [0, 1];

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
  const [selected, setSelected] = React.useState(selectedRows);
  return (
    <main style={surfaceStyle}>
      <DataToolbar
        size="sm"
        title="사용자 목록"
        description="검색, 필터, 선택 후 작업을 표와 같은 표면에서 정렬합니다."
        count={rows.length}
        searchPlaceholder="사용자 검색"
        filters={(
          <>
            <FilterChip size="sm" active>활성</FilterChip>
            <FilterChip size="sm">검토 필요</FilterChip>
            <FilterChip size="sm">비활성</FilterChip>
          </>
        )}
        actions={<Button size="sm" variant="ghost"><Icon name="upload" size={16} aria-hidden="true" />내보내기</Button>}
        style={toolbarStyle}
      />
      <DataGrid
        columns={columns}
        rows={rows}
        selectable
        selectedRows={selected}
        onSelectionChange={setSelected}
        bulkActions={<TextButton size="sm" color="primary">권한 변경</TextButton>}
        onClearSelection={() => setSelected([])}
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

export const ToolbarWithGrid = {
  name: '검색과 선택 액션',
  render: () => <ToolbarWithGridDemo />,
};
