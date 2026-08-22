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

// 그룹 헤더가 구간을 말하므로 그룹 열은 같은 사실을 두 번 적는 셈이다.
const columnsWithoutGroup = columns.filter((column) => column.key !== 'group');

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

/* 넓은 표에서 라벨과 측정값 사이가 멀면 헤어라인만으로는 행의 시선이 이어지지
   않는다. banded는 모든 데이터 행에 가장 조용한 fill을 깔아 밴드가 행을 잇게
   한다 — 교차(지브라)가 아니라 전 행이다: 행이 적은 표에서 줄무늬는 특정 행의
   강조로 오독된다(Table.prompt.md의 밴딩 절, Carbon zebra 근거 포함). */
export const BandedRows = {
  name: '변형·상태 · 밴드 행',
  parameters: storyDescription(
    '라벨 열과 측정 열 사이가 먼 넓은 표에서 행의 시선을 밴드로 잇는 상황입니다. 모든 데이터 행이 같은 밴드를 입는지(교차 줄무늬가 아님), 호버 워시가 밴드 위에서도 보이는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-3)', width: '100%', maxWidth: 1040, minWidth: 0 }}>
      <Table columns={columns} rows={rows} banded tableLabel="밴드 행 표" style={{ minWidth: 0 }} />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const bodyRows = [...canvasElement.querySelectorAll('tbody tr')];
    if (bodyRows.length === 0) throw new Error('Banded story must render data rows.');
    if (!bodyRows.every((row) => row.hasAttribute('data-banded'))) {
      throw new Error('banded는 전 행 밴드다 — 교차가 아니라 모든 데이터 행이 data-banded를 가져야 한다.');
    }
    // A custom property's declared text never string-matches a computed
    // background, so resolve the expected fill through a probe first.
    const probe = document.createElement('div');
    probe.style.background = 'var(--color-semantic-fill-alternative)';
    canvasElement.append(probe);
    const expected = getComputedStyle(probe).backgroundColor;
    probe.remove();
    const first = getComputedStyle(bodyRows[0]).backgroundColor;
    if (first !== expected) {
      throw new Error(`밴드는 fill-alternative를 입어야 한다 — got ${first}, expected ${expected}.`);
    }
  },
};

/* 그룹 행은 같은 값을 가진 **연속 구간**마다 한 번 열린다 — 흩어진 같은 값을
   모으지 않는 것은 호출자의 행 순서가 곧 보고의 순서이기 때문이다. 그룹 헤더는
   표를 가로지르는 th[scope=colgroup]이고 밴드를 입지 않는다: 밴드가 "데이터 행"을
   말하는데 라벨은 데이터 행이 아니다 (Table.prompt.md의 그룹 행 절). */
export const GroupedRows = {
  name: '변형·상태 · 그룹 행',
  parameters: storyDescription(
    '지표를 영역별로 묶어 읽는 상황입니다. 같은 그룹의 연속 구간마다 헤더가 한 번만 열리는지, 그룹 헤더가 표 전체를 가로지르며 데이터 행의 밴드를 입지 않는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-3)', width: '100%', maxWidth: 1040, minWidth: 0 }}>
      <Table
        columns={columnsWithoutGroup}
        rows={[
          { id: 'ITEM-104', group: '문서', status: '진행 중', progress: 86 },
          { id: 'ITEM-119', group: '문서', status: '검토 중', progress: 62 },
          { id: 'ITEM-212', group: '컴포넌트', status: '검토 중', progress: 47 },
          { id: 'ITEM-318', group: '토큰', status: '중지', progress: 12 },
        ]}
        groupKey="group"
        banded
        rowHeaderKey="id"
        tableLabel="그룹 행 표"
        style={{ minWidth: 0 }}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const groups = [...canvasElement.querySelectorAll('tbody [data-table-group]')];
    if (groups.length !== 3) {
      throw new Error(`연속 구간마다 그룹 헤더가 하나씩 열려야 한다 — 문서·컴포넌트·토큰 3개, got ${groups.length}.`);
    }
    const header = groups[0].querySelector('th');
    if (!header || header.getAttribute('scope') !== 'colgroup') {
      throw new Error('그룹 헤더는 th[scope=colgroup]이어야 구간 라벨이 보조 기술에 전달된다.');
    }
    if (Number(header.getAttribute('colspan')) !== columnsWithoutGroup.length) {
      throw new Error('그룹 헤더는 표 전체를 가로질러야 한다.');
    }
    if (groups.some((row) => row.hasAttribute('data-banded'))) {
      throw new Error('그룹 행은 밴드를 입지 않는다 — 밴드는 데이터 행의 표식이다.');
    }
    const dataRows = [...canvasElement.querySelectorAll('tbody tr:not([data-table-group])')];
    if (dataRows.length !== 4) throw new Error('그룹 행이 데이터 행을 대체해서는 안 된다.');
  },
};

/* `size`가 바꾸는 것은 셀 패딩뿐이다(14/16 → 10/12). 글자 크기와 행간은 그대로이므로
   행 높이는 위아래 4px씩, 정확히 8px만 줄어든다. 두 밀도를 같은 데이터로 나란히 놓아
   그 차이와 선택 기준을 눈으로 확인할 수 있게 한다. */
export const DensityComparison = {
  name: '반응형 · 기본 밀도와 좁은 밀도',
  parameters: storyDescription(
    '같은 데이터를 기본 밀도와 좁은 밀도로 나란히 비교하는 상황입니다. 좁은 밀도는 셀 여백만 줄이므로 글자 크기와 읽기 순서는 그대로이고, 한 화면에 더 많은 행을 담아야 하는 운영 화면에 적합합니다. 읽기가 목적인 화면에는 기본 밀도를 유지하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 1040, minWidth: 0 }}>
      <section data-testid="density-md" style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <div>
          <h2 id="density-md-title" style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--color-semantic-label-strong)' }}>기본 밀도</h2>
          <p style={{ margin: '4px 0 0', fontSize: 12.5, lineHeight: 1.45, color: 'var(--color-semantic-label-alternative)' }}>셀 여백 위아래 14px. 목록을 읽고 비교하는 것이 목적인 화면의 기본값입니다.</p>
        </div>
        <Table columns={columns} rows={rows} tableLabelledBy="density-md-title" style={{ minWidth: 0 }} />
      </section>
      <section data-testid="density-sm" style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <div>
          <h2 id="density-sm-title" style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--color-semantic-label-strong)' }}>좁은 밀도</h2>
          <p style={{ margin: '4px 0 0', fontSize: 12.5, lineHeight: 1.45, color: 'var(--color-semantic-label-alternative)' }}>셀 여백 위아래 10px. 한 화면에 더 많은 행을 담아야 하는 운영 화면에 사용합니다.</p>
        </div>
        <Table size="sm" columns={columns} rows={rows} tableLabelledBy="density-sm-title" style={{ minWidth: 0 }} />
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const rowOf = (testId) => canvasElement
      .querySelector(`[data-testid="${testId}"] tbody tr`)
      .getBoundingClientRect().height;
    const cellPadding = (testId) => {
      const cell = canvasElement.querySelector(`[data-testid="${testId}"] tbody tr`).children[0];
      const computed = getComputedStyle(cell);
      return { top: computed.paddingTop, bottom: computed.paddingBottom, inline: computed.paddingLeft };
    };

    const md = cellPadding('density-md');
    const sm = cellPadding('density-sm');
    if (md.top !== '14px' || md.bottom !== '14px' || md.inline !== '16px') {
      throw new Error(`기본 밀도의 셀 여백은 14px/16px이어야 합니다(현재 ${md.top}/${md.inline}).`);
    }
    if (sm.top !== '10px' || sm.bottom !== '10px' || sm.inline !== '12px') {
      throw new Error(`좁은 밀도의 셀 여백은 10px/12px이어야 합니다(현재 ${sm.top}/${sm.inline}).`);
    }

    const saving = rowOf('density-md') - rowOf('density-sm');
    if (Math.abs(saving - 8) > 0.5) {
      throw new Error(`좁은 밀도는 행마다 정확히 8px만 줄어야 합니다(현재 ${saving.toFixed(1)}px).`);
    }

    /* 밀도는 여백만 바꾼다. 글자 크기가 함께 줄면 가독성 계약이 깨진다. */
    const fontOf = (testId) => getComputedStyle(
      canvasElement.querySelector(`[data-testid="${testId}"] tbody tr`).children[0],
    ).fontSize;
    if (fontOf('density-md') !== fontOf('density-sm')) {
      throw new Error('밀도는 셀 여백만 조정해야 하며 본문 글자 크기를 바꾸지 않습니다.');
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

const flexibleText = 'portal-publication-with-a-name-that-is-intentionally-long-enough-to-exceed-the-available-column-width';

export const FlexibleTruncationContract = {
  name: 'Flexible truncated column',
  tags: ['!dev'],
  render: () => (
    <Table
      data-contract="flexible-truncation"
      tableLabel="Flexible column contract"
      columns={[
        { key: 'code', label: 'Code', width: 64 },
        { key: 'title', label: 'Publication title', truncate: true },
        { key: 'owner', label: 'Owner', width: 72 },
        { key: 'state', label: 'State', width: 72 },
      ]}
      rows={[{ code: 'PUB-104', title: flexibleText, owner: 'Robotics', state: 'Published' }]}
      style={{ width: 520, maxWidth: '100%' }}
    />
  ),
  play: async ({ canvasElement }) => {
    const surface = canvasElement.querySelector('[data-contract="flexible-truncation"]');
    const flexibleHeader = surface?.querySelector('thead th:nth-child(2)');
    const flexibleCell = surface?.querySelector('tbody tr:first-child td:nth-child(2)');
    const fixedBodyCell = surface?.querySelector('tbody tr:first-child td:nth-child(3)');
    const content = flexibleCell?.querySelector('[data-slot="truncated-content"]');
    if (!surface || !flexibleHeader || !flexibleCell || !fixedBodyCell || !content) {
      throw new Error('Table flexible truncation contract targets are required.');
    }
    if (flexibleHeader.style.width !== '100%' || flexibleHeader.style.maxWidth !== '0px') {
      throw new Error('A truncate header must consume remaining width with a zero min-content constraint.');
    }
    if (flexibleCell.style.width !== '100%' || flexibleCell.style.maxWidth !== '0px') {
      throw new Error('A truncate body cell must share the header sizing contract.');
    }
    if (fixedBodyCell.style.width !== '72px') {
      throw new Error('Explicit column widths must apply to body cells as well as headers.');
    }
    if (content.style.textOverflow !== 'ellipsis' || content.textContent !== flexibleText) {
      throw new Error('Truncated plain text must keep its complete DOM value and render an ellipsis policy.');
    }
    if (surface.scrollWidth > surface.clientWidth + 1) {
      throw new Error('A single truncate column must not push the Table beyond its available width.');
    }
  },
};

export const TableCard = { ...TableCardStory, name: 'Table card parity', tags: ['!dev', 'visual-parity'] };
