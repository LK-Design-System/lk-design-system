import { getTableHeaderCellStyle, StatusBadge, Table } from '../src/index.js';
import { TableCard as TableCardStory } from './DataDisplay.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Data/Collections/Table',
  tags: ['autodocs'],
  component: Table,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-data-collections-table--static-table',
      eyebrow: 'Product / Data / Table',
      title: '사용자가 읽기 전용 행과 열을 빠르게 비교합니다',
      description:
        '정렬이나 선택 없이 구조화된 레코드를 같은 열 기준으로 읽을 때 적합합니다. 사용자가 정렬·선택·페이지 이동이나 행 작업을 해야 하면 Table 대신 Data Grid를 사용하세요.',
    },
    docs: {
      description: {
        component: '정렬과 선택이 필요 없는 읽기 전용 데이터를 보여주는 정적 Table 패턴입니다. 정렬·선택이 필요한 컬렉션에는 데이터 그리드 패턴을 사용합니다.',
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
  { key: 'id', label: '항목' },
  { key: 'group', label: '그룹' },
  { key: 'status', label: '상태', render: (row) => <StatusBadge tone={statusTone[row.status]}>{row.status}</StatusBadge> },
  { key: 'progress', label: '진행률', align: 'right', render: (row) => <ProgressCell value={row.progress} /> },
];

export const StaticTable = {
  name: '개요',
  parameters: storyDescription(
    '항목의 그룹·상태·진행률을 읽기 전용 표로 비교하는 상황입니다. 헤더와 셀의 대응, 숫자 정렬, 상태 텍스트가 조작 없이도 빠르게 읽히는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-3)', width: '100%', maxWidth: 1040, minWidth: 0 }}>
      <div>
        <h2 id="static-table-title" style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--color-semantic-label-strong)' }}>정적 표</h2>
        <p style={{ margin: '4px 0 0', fontSize: 12.5, lineHeight: 1.45, color: 'var(--color-semantic-label-alternative)' }}>정렬과 선택이 필요 없는 읽기 전용 데이터에는 기본 Table을 사용합니다.</p>
      </div>
      <Table columns={columns} rows={rows} tableLabelledBy="static-table-title" style={{ minWidth: 0 }} />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const table = canvasElement.querySelector('table');
    if (!table) throw new Error('Table must render a native <table> element.');
    const headers = [...table.querySelectorAll('thead th')];
    if (headers.length !== columns.length || headers.some((header) => header.getAttribute('scope') !== 'col')) {
      throw new Error('열 헤더는 모두 <th scope="col">이어야 헤더-데이터 대응이 보조기술에 전달됩니다(WCAG 1.3.1).');
    }
    if (table.getAttribute('aria-labelledby') !== 'static-table-title') {
      throw new Error('표 밖의 보이는 제목은 tableLabelledBy로 <table>에 연결되어야 합니다. 래퍼 div의 이름은 표의 이름이 아닙니다.');
    }
    if (canvasElement.querySelector('#static-table-title')?.textContent?.trim() !== '정적 표') {
      throw new Error('tableLabelledBy가 가리키는 제목 요소가 실제로 존재해야 합니다.');
    }
    if (table.querySelectorAll('tbody tr').length !== rows.length) {
      throw new Error('Table must render exactly one row per record.');
    }
  },
};

export const TableSemanticsContract = {
  name: '캡션과 행 헤더 계약',
  tags: ['!dev'],
  parameters: storyDescription(
    '보이는 캡션과 행 헤더를 함께 쓰는 표의 시맨틱 계약입니다. caption이 표의 이름이 되고 rowHeaderKey 컬럼만 <th scope="row">가 되는지, caption이 있을 때 tableLabel이 보이는 이름을 덮어쓰지 않는지 확인합니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-3)', width: '100%', maxWidth: 1040, minWidth: 0 }}>
      <Table
        caption="점검 대상 항목"
        tableLabel="캡션이 있으면 무시되는 이름"
        rowHeaderKey="id"
        getRowId={(row) => row.id}
        columns={columns}
        rows={rows}
        style={{ minWidth: 0 }}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const table = canvasElement.querySelector('table');
    const caption = table?.querySelector('caption');
    if (caption?.textContent?.trim() !== '점검 대상 항목') {
      throw new Error('caption prop은 <table>의 첫 자식 <caption>으로 렌더링되어야 합니다.');
    }
    if (table.hasAttribute('aria-label')) {
      throw new Error('보이는 caption이 있으면 aria-label로 덮어쓰지 않아야 합니다(WCAG 2.5.3).');
    }
    const rowHeaders = [...table.querySelectorAll('tbody th')];
    if (rowHeaders.length !== rows.length || rowHeaders.some((header) => header.getAttribute('scope') !== 'row')) {
      throw new Error('rowHeaderKey 컬럼의 셀은 행마다 하나씩 <th scope="row">여야 합니다.');
    }
    if (rowHeaders.map((header) => header.textContent?.trim()).join() !== rows.map((row) => row.id).join()) {
      throw new Error('행 헤더는 행을 식별하는 컬럼의 값을 그대로 담아야 합니다.');
    }
    const firstRowCells = table.querySelectorAll('tbody tr:first-child td');
    if (firstRowCells.length !== columns.length - 1) {
      throw new Error('행 헤더로 승격된 셀 하나를 제외한 나머지는 <td>로 남아야 합니다.');
    }
  },
};

export const RowExtensionContract = {
  name: '사용법 · 행 메타데이터 확장',
  tags: ['!dev'],
  parameters: storyDescription(
    '읽기 전용 표에 선택 의미를 추가하지 않고 행별 상태·테스트 식별자·이벤트를 연결하는 계약입니다. 정렬·선택·키보드 행 탐색이 필요하면 Table이 아니라 Data Grid를 사용하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-3)', width: '100%', maxWidth: 1040, minWidth: 0 }}>
      <div style={{ ...getTableHeaderCellStyle({ align: 'left' }), borderRadius: 'var(--radius-sm)' }}>
        공개 헤더 셀 스타일 헬퍼를 사용하는 보조 표 레이블
      </div>
      <Table
        tableLabel="행 확장 계약"
        columns={columns}
        rows={rows}
        getRowProps={(row, index) => ({
          'data-row-id': row.id,
          'data-row-index': index,
          className: row.status === '중지' ? 'is-stopped' : undefined,
        })}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const renderedRows = [...canvasElement.querySelectorAll('tbody tr')];
    if (renderedRows.length !== rows.length
      || renderedRows.some((row, index) => row.dataset.rowId !== rows[index].id || row.dataset.rowIndex !== String(index))
      || !renderedRows.at(-1)?.classList.contains('is-stopped')) {
      throw new Error('getRowProps must merge row metadata without changing native table semantics.');
    }
    if (renderedRows.some((row) => row.hasAttribute('role') || row.hasAttribute('tabindex'))) {
      throw new Error('Static Table row extension must not introduce grid or keyboard-selection semantics by default.');
    }
  },
};

export const TableCard = { ...TableCardStory, name: 'Table card parity', tags: ['!dev', 'visual-parity'] };
