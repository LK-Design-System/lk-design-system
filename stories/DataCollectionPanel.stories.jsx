import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import {
  Button,
  Checkbox,
  DataCollectionPanel,
  DataGrid,
  Pagination,
  Select,
  StatusBadge,
  Table,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Data/Collections/Data Collection Panel',
  tags: ['autodocs'],
  component: DataCollectionPanel,
  parameters: {
    layout: 'padded',
    storyGuide: {
      storyId: 'lds-product-data-collections-data-collection-panel--overview',
      eyebrow: 'Product / Data / Collections',
      title: '반복되는 데이터 목록의 도구막대, 상태, 본문과 페이지네이션을 한 표면으로 묶습니다',
      description:
        '독립된 검색·상태·본문·페이지네이션 표면이 반복될 때 사용하기 적합합니다. 단순 표의 가로 넘침만 필요하거나 제품 전용 명령 피드에는 사용하지 않습니다. 검색 값, 네트워크 상태, 행 의미, 권한, 좁은 항목 마크업과 페이지 상태는 제품이 계속 소유합니다.',
    },
    docs: {
      description: {
        component:
          '내장 도구막대와 리소스 상태, 표 또는 데이터 그리드, 선택적 좁은 본문과 하단 페이지 이동을 하나의 재사용 가능한 컬렉션 표면으로 조합합니다.',
      },
    },
  },
};

export default meta;

/* 데모는 특정 제품 화면을 복제하지 않고, 컬렉션 화면의 업계 표준 anatomy를 LDS
   하우스 도메인(현장 장비 목록 — components/data/Table.prompt.md의 예시 도메인)으로
   보여준다.
   - 도구막대: 제목·개수 → 주 생성 액션 → 검색 → 필터. Carbon Data Table은 toolbar를
     primary button·search·filtering의 자리로 정의하고 PatternFly Toolbar도 데이터셋
     제어를 같은 상단 막대에 모은다 — 근거 링크는 DataCollectionPanel.prompt.md의
     비교 근거 절이 소유한다.
   - 컬럼: 이름(행 헤더) → 텍스트 속성 → 상태 배지 → 비교 수치(우측 정렬,
     tabular-nums) → 도구막대 정렬 기준 시각. 한 컬럼 = 한 속성 규칙과 수치 우측
     정렬 규칙은 Table.prompt.md가 소유한다. 긴 서술 텍스트는 목록의 스캔·비교
     대상이 아니므로 컬럼을 갖지 않는다.
   - 행 액션 컬럼(마지막 컬럼의 overflow 메뉴)은 의도적으로 제외한다: 이 페이지의
     계약은 패널 조립이고, 액션 컬럼 규칙은 Table.prompt.md의 예시가 이미 소유한다. */
const equipment = [
  { id: 'lkr-t1-03', name: 'LKR-T1 3호기', site: '판교 물류센터', status: '가동 중', missions: 132, updatedAt: '2026-08-15 08:40' },
  { id: 'lkr-t1-07', name: 'LKR-T1 7호기', site: '판교 물류센터', status: '점검 중', missions: 0, updatedAt: '2026-08-14 17:05' },
  { id: 'lkr-s2-01', name: 'LKR-S2 1호기', site: '대덕 제조동', status: '가동 중', missions: 96, updatedAt: '2026-08-15 07:58' },
  { id: 'lkr-s2-04', name: 'LKR-S2 4호기', site: '대덕 제조동', status: '대기', missions: 12, updatedAt: '2026-08-13 11:21' },
  { id: 'lkr-h1-02', name: 'LKR-H1 2호기', site: '세종 물류센터', status: '가동 중', missions: 87, updatedAt: '2026-08-15 06:30' },
];

const STATUS_TONE = { '가동 중': 'positive', '점검 중': 'cautionary', '대기': 'neutral' };

const STATUS_OPTIONS = [
  { value: 'all', label: '전체 상태' },
  { value: '가동 중', label: '가동 중' },
  { value: '점검 중', label: '점검 중' },
  { value: '대기', label: '대기' },
];

const columns = [
  {
    key: 'name',
    label: '장비',
    render: (unit) => (
      <a href={`#${unit.id}`} style={{ color: 'var(--color-semantic-label-strong)', fontWeight: 'var(--fw-semibold)', textDecoration: 'none' }}>
        {unit.name}
      </a>
    ),
  },
  { key: 'site', label: '현장', width: 140 },
  {
    key: 'status',
    label: '상태',
    width: 96,
    render: (unit) => <StatusBadge tone={STATUS_TONE[unit.status]}>{unit.status}</StatusBadge>,
  },
  /* 비교 수치 컬럼은 우측 정렬 — Table의 tabular-nums와 함께 값이 자릿수 기준으로
     세로 정렬된다. 점검 중 장비의 0은 결측이 아니라 실제 값이다. */
  { key: 'missions', label: '오늘 임무', width: 104, align: 'right' },
  {
    key: 'updatedAt',
    label: '최근 점검',
    width: 150,
    render: (unit) => (
      <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption1-size)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
        {unit.updatedAt}
      </span>
    ),
  },
];

function CompactEquipmentList({ rows }) {
  return (
    <ul aria-label="좁은 화면 장비" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {rows.map((unit, index) => (
        <li
          key={unit.id}
          style={{
            display: 'grid',
            gap: 'var(--space-2)',
            padding: 'var(--space-4)',
            borderBottom: index < rows.length - 1 ? '1px solid var(--color-semantic-line-normal-normal)' : 'none',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
            <a href={`#compact-${unit.id}`} style={{ minWidth: 0, color: 'var(--color-semantic-label-strong)', fontWeight: 'var(--fw-semibold)', overflowWrap: 'anywhere' }}>
              {unit.name}
            </a>
            <StatusBadge tone={STATUS_TONE[unit.status]}>{unit.status}</StatusBadge>
          </span>
          {/* 좁은 목록은 컬럼 비교가 목적이 아니므로 속성을 본문에 쌓는다 — Table.prompt.md. */}
          <span style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)', wordBreak: 'keep-all' }}>
            {unit.site} · 오늘 임무 {unit.missions}
          </span>
          <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption1-size)', fontFamily: 'var(--font-mono)', overflowWrap: 'anywhere' }}>
            최근 점검 {unit.updatedAt}
          </span>
        </li>
      ))}
    </ul>
  );
}

function EquipmentCollection({ layout = 'auto', state = 'ready', style, compact = true, content = true, label = '장비 목록', tableSize }) {
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState('all');
  const [sort, setSort] = React.useState('recent');
  const [page, setPage] = React.useState(1);
  const filtered = equipment.filter((unit) => (status === 'all' || unit.status === status)
    && `${unit.name} ${unit.site}`.toLowerCase().includes(query.toLowerCase()));
  const rows = sort === 'name'
    ? [...filtered].sort((a, b) => a.name.localeCompare(b.name))
    : [...filtered].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <DataCollectionPanel
      aria-label={label}
      layout={layout}
      style={{ maxWidth: 1120, ...style }}
      toolbar={{
        size: 'sm',
        /* 이 스토리에서는 패널이 화면 전체이므로 제목·개수·주 생성 액션을 도구막대가
           소유한다. 상위 제목이 이미 컬렉션을 설명하는 화면이라면 title/count를
           생략한다 — DataCollectionPanel.prompt.md. */
        title: '장비',
        count: rows.length,
        actions: <Button size="sm" variant="solid" color="primary">장비 등록</Button>,
        searchValue: query,
        onSearchChange: setQuery,
        searchPlaceholder: '장비 이름, 현장 검색',
        filters: ({ size }) => (
          <>
            <Select
              size={size}
              aria-label="상태 필터"
              value={status}
              onChange={setStatus}
              options={STATUS_OPTIONS}
            />
            <Select
              size={size}
              aria-label="장비 정렬"
              value={sort}
              onChange={setSort}
              options={[
                { value: 'recent', label: '최근 점검순' },
                { value: 'name', label: '이름순' },
              ]}
            />
          </>
        ),
      }}
      resourceState={{
        state,
        title: state === 'empty' ? '검색 결과가 없습니다' : undefined,
        description: state === 'empty' ? '다른 검색어나 필터 조건을 사용해 보세요.' : undefined,
        lastUpdated: state === 'stale' ? '2026-08-04 09:30' : undefined,
      }}
      compactContent={content && compact ? <CompactEquipmentList rows={rows} /> : undefined}
      footer={(
        <Pagination
          page={page}
          count={4}
          variant="compact"
          navigationLabel="장비 페이지"
          previousPageLabel="이전 장비 페이지"
          nextPageLabel="다음 장비 페이지"
          onChange={setPage}
          showCounter
        />
      )}
    >
      {content ? <Table size={tableSize} tableLabel="장비" columns={columns} rows={rows} rowHeaderKey="name" /> : null}
    </DataCollectionPanel>
  );
}

export const Overview = {
  name: '개요',
  parameters: storyDescription(
    '제목·개수·주 생성 액션·검색·필터를 한 도구막대에 두고, 이름 → 속성 → 상태 → 우측 정렬 수치 → 정렬 기준 시각 순의 컬럼으로 구성한 표준 컬렉션 화면입니다. toolbar, ready content와 footer가 하나의 perimeter와 DOM 순서를 공유합니다.',
  ),
  render: () => <EquipmentCollection />,
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-lds-data-collection-panel]');
    const toolbarSlot = root?.querySelector(':scope > [data-slot="toolbar"]');
    const stateSlot = root?.querySelector(':scope > [data-slot="state"]');
    const footerSlot = root?.querySelector(':scope > [data-slot="footer"]');
    if (!root || !toolbarSlot || !stateSlot || !footerSlot) throw new Error('Panel anatomy must render toolbar, state/content, and footer slots.');
    if (!(toolbarSlot.compareDocumentPosition(stateSlot) & Node.DOCUMENT_POSITION_FOLLOWING)
      || !(stateSlot.compareDocumentPosition(footerSlot) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      throw new Error('Panel DOM order must remain toolbar, state/content, footer.');
    }
    if (toolbarSlot.querySelector('[data-variant="embedded"]') == null) throw new Error('Panel must force the embedded DataToolbar perimeter.');

    /* 업계 표준 도구막대 anatomy: 주 생성 액션과 결과 개수가 검색·필터와 같은
       도구막대에 있다. */
    const primaryAction = [...toolbarSlot.querySelectorAll('[data-slot="actions"] button')]
      .find((button) => button.textContent.includes('장비 등록'));
    if (!primaryAction) throw new Error('The collection toolbar must expose the primary create action.');
    const filterSlot = toolbarSlot.querySelector('[data-slot="filters"]');
    if (!filterSlot?.querySelector('[aria-label="상태 필터"]') || !filterSlot.querySelector('[aria-label="장비 정렬"]')) {
      throw new Error('The toolbar filters slot must keep the status filter and the sort control.');
    }

    /* 비교 수치 컬럼은 우측 정렬로 세로 비교가 가능해야 한다. */
    const headers = [...root.querySelectorAll('thead th')];
    const missionsIndex = headers.findIndex((header) => header.textContent.trim() === '오늘 임무');
    const firstRow = root.querySelector('tbody tr');
    if (missionsIndex < 0 || getComputedStyle(firstRow.children[missionsIndex]).textAlign !== 'right') {
      throw new Error('The comparable numeric column must be right aligned.');
    }

    const input = root.querySelector('input[type="search"]');
    await userEvent.clear(input);
    await userEvent.type(input, '세종');
    await waitFor(() => {
      if (root.querySelectorAll('tbody tr').length !== 1 || !root.textContent.includes('LKR-H1 2호기')) {
        throw new Error('Product-owned controlled search must update collection content through toolbar props.');
      }
      if (toolbarSlot.querySelector('[data-slot="count"]')?.textContent !== '1개') {
        throw new Error('The toolbar result count must follow the filtered collection.');
      }
    });
    await userEvent.clear(input);
    await waitFor(() => {
      if (root.querySelectorAll('tbody tr').length !== equipment.length) {
        throw new Error('Overview must restore the full collection after its search interaction check.');
      }
    });
  },
};

/* 패널은 밀도를 소유하지 않는다. 본문 표의 `size`를 제품이 정하고, 패널의 도구막대·
   페이지네이션 높이는 그대로 유지된다. 그래서 두 패널의 전체 높이 차이는 행 수 × 8px로
   정확히 떨어진다 — 밀도 선택이 실제 화면에서 얼마나 이득인지 이 문맥에서만 보인다. */
export const DensityComparison = {
  name: '변형·상태 · 기본 밀도와 좁은 밀도',
  parameters: storyDescription(
    '같은 장비 목록을 기본 밀도와 좁은 밀도로 비교하는 상황입니다. 밀도는 본문 표가 소유하므로 도구막대와 페이지 이동 영역은 그대로이고 행만 촘촘해집니다. 목록을 읽고 비교하는 화면에는 기본 밀도를, 한 화면에 더 많은 행을 담아야 하는 운영 화면에는 좁은 밀도를 사용하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)' }}>
      <section data-testid="panel-density-md" style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--color-semantic-label-strong)' }}>기본 밀도</h2>
          <p style={{ margin: '4px 0 0', fontSize: 12.5, lineHeight: 1.45, color: 'var(--color-semantic-label-alternative)' }}>표의 셀 여백이 위아래 14px입니다. 장비 목록처럼 읽고 비교하는 화면의 기본값입니다.</p>
        </div>
        <EquipmentCollection label="기본 밀도 장비 목록" />
      </section>
      <section data-testid="panel-density-sm" style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--color-semantic-label-strong)' }}>좁은 밀도</h2>
          <p style={{ margin: '4px 0 0', fontSize: 12.5, lineHeight: 1.45, color: 'var(--color-semantic-label-alternative)' }}>표의 셀 여백이 위아래 10px입니다. 도구막대와 페이지 이동은 그대로이고 행만 촘촘해집니다.</p>
        </div>
        <EquipmentCollection tableSize="sm" label="좁은 밀도 장비 목록" />
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const panel = (testId) => canvasElement.querySelector(`[data-testid="${testId}"] [data-lds-data-collection-panel]`);
    const rowsOf = (testId) => [...panel(testId).querySelectorAll('tbody tr')].filter((row) => row.getBoundingClientRect().height > 0);
    const cellPadding = (testId) => {
      const computed = getComputedStyle(rowsOf(testId)[0].children[0]);
      return { block: computed.paddingTop, inline: computed.paddingLeft };
    };

    const md = cellPadding('panel-density-md');
    const sm = cellPadding('panel-density-sm');
    if (md.block !== '14px' || md.inline !== '16px') {
      throw new Error(`기본 밀도 패널의 셀 여백은 14px/16px이어야 합니다(현재 ${md.block}/${md.inline}).`);
    }
    if (sm.block !== '10px' || sm.inline !== '12px') {
      throw new Error(`좁은 밀도 패널의 셀 여백은 10px/12px이어야 합니다(현재 ${sm.block}/${sm.inline}).`);
    }

    const mdRows = rowsOf('panel-density-md');
    const smRows = rowsOf('panel-density-sm');
    if (mdRows.length !== smRows.length) throw new Error('두 밀도는 같은 행 수를 보여야 비교가 성립합니다.');
    const perRow = mdRows[0].getBoundingClientRect().height - smRows[0].getBoundingClientRect().height;
    if (Math.abs(perRow - 8) > 0.5) {
      throw new Error(`좁은 밀도는 행마다 8px만 줄어야 합니다(현재 ${perRow.toFixed(1)}px).`);
    }

    /* 패널이 소유한 도구막대와 푸터는 밀도와 무관하다. 열 헤더는 본문과 같은 셀
       여백을 쓰므로 함께 줄어든다 — 따라서 전체 차이는 (헤더 1 + 본문 N) × 8px다. */
    const chromeHeight = (testId, slot) => panel(testId).querySelector(`[data-slot="${slot}"]`).getBoundingClientRect().height;
    for (const slot of ['toolbar', 'footer']) {
      if (Math.abs(chromeHeight('panel-density-md', slot) - chromeHeight('panel-density-sm', slot)) > 0.5) {
        throw new Error(`본문 밀도는 패널 ${slot} 높이를 바꾸지 않아야 합니다.`);
      }
    }
    const headerDelta = panel('panel-density-md').querySelector('thead tr').getBoundingClientRect().height
      - panel('panel-density-sm').querySelector('thead tr').getBoundingClientRect().height;
    if (Math.abs(headerDelta - perRow) > 0.5) {
      throw new Error(`열 헤더도 본문과 같은 여백을 쓰므로 같은 폭(${perRow.toFixed(1)}px)만큼 줄어야 합니다(현재 ${headerDelta.toFixed(1)}px).`);
    }
    const panelDelta = panel('panel-density-md').getBoundingClientRect().height
      - panel('panel-density-sm').getBoundingClientRect().height;
    const expected = perRow * (mdRows.length + 1);
    if (Math.abs(panelDelta - expected) > 1) {
      throw new Error(`패널 전체 높이 차이는 헤더 포함 행 차이의 합(${expected.toFixed(1)}px)이어야 합니다(현재 ${panelDelta.toFixed(1)}px).`);
    }
  },
};

/* 데모 구성(selectableColumns · CompactSelectableList · SharedSelectionDemo ·
   sharedSelectionPlay)은 파일 하단에 있다. 공개 스토리 정렬 규칙상 상호작용
   역할은 변형·상태 뒤에 와야 해서 export만 이 위치에 둔다. */
export const SharedSelectionAcrossWideAndNarrow = {
  name: '상호작용 · 넓은 표와 좁은 목록의 선택 공유',
  parameters: storyDescription(
    '넓은 표와 좁은 목록이 하나의 선택 상태를 함께 씁니다. 한쪽에서 선택하거나 해제하면 다른 쪽의 같은 항목이 즉시 따라오고, 좁은 목록에서도 선택 수 변화가 스크린 리더에 알림되는지 확인하세요. 선택 상태와 좁은 목록의 마크업은 제품이 소유합니다.',
  ),
  render: () => <SharedSelectionDemo />,
  play: sharedSelectionPlay,
};

export const NarrowCollection = {
  name: '반응형 · 좁은 의미 목록',
  parameters: storyDescription(
    '320px에서는 제품이 제공한 의미 목록만 표시합니다. 장비 이름, 상태, 현장·임무 수와 최근 점검 시각을 유지하며 숨겨진 넓은 표의 링크는 Tab 순서에서 제외됩니다.',
  ),
  render: () => <EquipmentCollection layout="narrow" style={{ width: 320 }} />,
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-lds-data-collection-panel]');
    const wide = root?.querySelector('[data-collection-content="wide"]');
    const compact = root?.querySelector('[data-collection-content="compact"]');
    if (getComputedStyle(wide).display !== 'none' || getComputedStyle(compact).display === 'none') {
      throw new Error('Narrow layout must expose only the product-authored compact content.');
    }
    if (!compact.querySelector('ul[aria-label="좁은 화면 장비"]') || compact.querySelectorAll('li').length !== equipment.length) {
      throw new Error('Compact content must preserve a named semantic list and every item.');
    }
    if ([...wide.querySelectorAll('a')].some((link) => link.getClientRects().length > 0)) {
      throw new Error('Hidden wide content must not leave visible or focusable duplicate links.');
    }
  },
};

export const WideFallbackWithoutCompactContent = {
  name: '좁은 화면 · Table overflow 보존',
  tags: ['!dev'],
  render: () => <EquipmentCollection layout="narrow" compact={false} style={{ width: 320 }} />,
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-lds-data-collection-panel]');
    const wide = root?.querySelector('[data-collection-content="wide"]');
    if (root.dataset.hasCompactContent !== 'false' || getComputedStyle(wide).display === 'none') {
      throw new Error('Without compactContent, narrow layout must preserve the native Table content.');
    }
    if (!wide.querySelector('table[aria-label="장비"]')) throw new Error('Table semantics must remain intact in the fallback path.');
  },
};

export const ResourceStates = {
  name: '변형·상태 · 불러오기, 빈 결과, 오래된 데이터',
  parameters: storyDescription(
    'blocking 상태는 content와 footer를 함께 대체하고, stale은 상태 메시지 뒤에 마지막 정상 content와 footer를 보존합니다.',
  ),
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 920 }}>
      <EquipmentCollection state="loading" label="불러오는 장비 목록" />
      <EquipmentCollection state="empty" label="빈 장비 목록" />
      <EquipmentCollection state="stale" label="오래된 장비 목록" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const panels = [...canvasElement.querySelectorAll('[data-lds-data-collection-panel]')];
    const [loading, empty, stale] = panels;
    if (loading.querySelector('[data-slot="footer"]') || empty.querySelector('[data-slot="footer"]')) {
      throw new Error('Loading and blocking empty states must suppress pagination.');
    }
    if (!stale.querySelector('[data-resource-state-message]') || !stale.querySelector('table') || !stale.querySelector('[data-slot="footer"]')) {
      throw new Error('Stale state must preserve its message, last-good content, and footer.');
    }
  },
};

export const AutoContainerBoundary = {
  name: 'Auto container boundary',
  tags: ['!dev'],
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-5)', width: '100%' }}>
      <EquipmentCollection label="자동 좁은 패널" style={{ width: 760 }} />
      <EquipmentCollection label="자동 넓은 패널" style={{ width: 800 }} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const narrow = canvasElement.querySelector('[data-lds-data-collection-panel][aria-label="자동 좁은 패널"]');
    const wide = canvasElement.querySelector('[data-lds-data-collection-panel][aria-label="자동 넓은 패널"]');
    const narrowWideContent = narrow?.querySelector('[data-collection-content="wide"]');
    const narrowCompactContent = narrow?.querySelector('[data-collection-content="compact"]');
    const wideWideContent = wide?.querySelector('[data-collection-content="wide"]');
    const wideCompactContent = wide?.querySelector('[data-collection-content="compact"]');
    if (getComputedStyle(narrowWideContent).display !== 'none' || getComputedStyle(narrowCompactContent).display === 'none') {
      throw new Error('Auto layout must select compact content below the 767px container boundary.');
    }
    if (getComputedStyle(wideWideContent).display === 'none' || getComputedStyle(wideCompactContent).display !== 'none') {
      throw new Error('Auto layout must preserve wide content above the 767px container boundary.');
    }
  },
};

export const StatePolicyContract = {
  name: 'State policy contract',
  tags: ['!dev'],
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 920 }}>
      <EquipmentCollection state="error" content={false} label="초기 오류 장비 목록" />
      <EquipmentCollection state="error" label="보존 오류 장비 목록" />
      <EquipmentCollection state="refreshing" label="새로 고침 장비 목록" />
      <EquipmentCollection state="offline" label="오프라인 장비 목록" />
      <EquipmentCollection state="restricted" label="권한 제한 장비 목록" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const panel = (label) => canvasElement.querySelector(`[data-lds-data-collection-panel][aria-label="${label}"]`);
    const initialError = panel('초기 오류 장비 목록');
    const preservedError = panel('보존 오류 장비 목록');
    const refreshing = panel('새로 고침 장비 목록');
    const offline = panel('오프라인 장비 목록');
    const restricted = panel('권한 제한 장비 목록');
    if (initialError?.querySelector('table') || initialError?.querySelector('[data-slot="footer"]')) {
      throw new Error('An initial error without last-good content must block content and pagination.');
    }
    for (const preserved of [preservedError, refreshing, offline]) {
      if (!preserved?.querySelector('[data-resource-state-message]') || !preserved.querySelector('table') || !preserved.querySelector('[data-slot="footer"]')) {
        throw new Error('Preserved-data states must keep their message, content, and pagination together.');
      }
    }
    if (restricted?.querySelector('table') || restricted?.querySelector('[data-slot="footer"]')) {
      throw new Error('Restricted state must block content and pagination even when content was supplied.');
    }
  },
};

function NullFooter() {
  return null;
}

export const RenderedNullFooterSuppression = {
  name: 'Rendered-null footer suppression',
  tags: ['!dev'],
  render: () => (
    <DataCollectionPanel aria-label="단일 페이지 목록" footer={<NullFooter />}>
      <span>단일 페이지 콘텐츠</span>
    </DataCollectionPanel>
  ),
  play: async ({ canvasElement }) => {
    const footer = canvasElement.querySelector('[data-slot="footer"]');
    if (!footer || getComputedStyle(footer).display !== 'none' || footer.getBoundingClientRect().height !== 0) {
      throw new Error('A footer adapter that renders null must not leave an empty bordered strip.');
    }
  },
};

function SurfaceRefFixture() {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => ref.current?.setAttribute('data-ref-target', 'collection-panel-root'), []);
  return (
    <DataCollectionPanel
      ref={ref}
      as="article"
      aria-label="표면 계약"
      toolbar={{ searchable: false, title: '표면 계약' }}
      className="contract-panel-root"
      classNames={{ footer: 'contract-panel-footer' }}
      styles={{ footer: { justifyContent: 'flex-end' } }}
      vars={{ '--lds-data-collection-panel-footer-padding': '13px' }}
      footer={<span>Footer</span>}
    >
      <span>Content</span>
    </DataCollectionPanel>
  );
}

export const SurfaceAndRefContract = {
  name: 'Surface and ref contract',
  tags: ['!dev'],
  render: () => <SurfaceRefFixture />,
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-ref-target="collection-panel-root"]');
    const footer = root?.querySelector(':scope > [data-slot="footer"]');
    if (!(root instanceof HTMLElement) || root.tagName !== 'ARTICLE' || !root.classList.contains('contract-panel-root')) {
      throw new Error('Ref, polymorphic root, and root class must resolve to the same public surface.');
    }
    if (!footer?.classList.contains('contract-panel-footer') || getComputedStyle(footer).justifyContent !== 'flex-end') {
      throw new Error('Named footer class and style must reach the documented part.');
    }
    if (getComputedStyle(footer).paddingTop !== '13px') throw new Error('Panel variable must control footer padding.');
  },
};

export const DataCollectionPanelVisualParity = {
  name: 'DataCollectionPanel visual parity',
  tags: ['!dev', 'visual-parity'],
  render: () => <EquipmentCollection layout="wide" />,
};

/* wide DataGrid와 narrow 제품 목록이 하나의 controlled selection model을 공유하는
   조립. 패널은 layout만 소유하고 selection API가 없으므로, 두 표현이 같은 상태와
   같은 getRowId를 쓰는 것과 compact 쪽 live count를 제품이 소유하는 것이 계약이다.
   규칙은 docs/SELECTABLE_COLLECTION_PATTERN.md가 소유한다. */
const selectableColumns = [
  { key: 'name', label: '장비' },
  {
    key: 'status',
    label: '상태',
    width: 96,
    render: (unit) => <StatusBadge tone={STATUS_TONE[unit.status]}>{unit.status}</StatusBadge>,
  },
];

function CompactSelectableList({ rows, selectedIds, onToggle }) {
  return (
    <div>
      <ul aria-label="좁은 화면 장비 선택" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {rows.map((unit, index) => (
          <li
            key={unit.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-3)',
              padding: 'var(--space-4)',
              borderBottom: index < rows.length - 1 ? '1px solid var(--color-semantic-line-normal-normal)' : 'none',
            }}
          >
            <Checkbox
              aria-label={`장비 ${unit.name} 선택`}
              data-compact-checkbox={unit.id}
              checked={selectedIds.includes(unit.id)}
              onChange={() => onToggle(unit.id)}
              style={{ flexShrink: 0 }}
            />
            <span style={{ minWidth: 0, color: 'var(--color-semantic-label-strong)', fontWeight: 'var(--fw-semibold)', overflowWrap: 'anywhere' }}>
              {unit.name}
            </span>
          </li>
        ))}
      </ul>
      {/* compact 표현에는 DataGrid의 상시 live region이 없으므로 제품이 소유한다. */}
      <span
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-compact-selection-count=""
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}
      >
        {selectedIds.length > 0 ? `${selectedIds.length}개 선택됨` : ''}
      </span>
    </div>
  );
}

function SharedSelectionDemo() {
  const [selectionModel, setSelectionModel] = React.useState({ mode: 'explicit', selectedIds: [] });
  const selectedIds = selectionModel.selectedIds ?? [];
  const getRowId = (unit) => unit.id;
  const toggle = (id) => setSelectionModel((previous) => {
    const ids = previous.selectedIds ?? [];
    return { mode: 'explicit', selectedIds: ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id] };
  });

  const panelProps = {
    toolbar: { size: 'sm', searchable: false, count: equipment.length },
    style: { maxWidth: 880 },
  };

  return (
    <main style={{ display: 'grid', gap: 'var(--space-6)' }}>
      <section data-testid="shared-wide">
        <DataCollectionPanel aria-label="넓은 표현 장비 선택" layout="wide" {...panelProps}>
          <DataGrid
            columns={selectableColumns}
            rows={equipment}
            getRowId={getRowId}
            selectable
            selectionEntityLabel="장비"
            getRowSelectionLabel={(unit) => `장비 ${unit.name}`}
            selectionModel={selectionModel}
            onSelectionModelChange={setSelectionModel}
          />
        </DataCollectionPanel>
      </section>
      <section data-testid="shared-narrow">
        <DataCollectionPanel
          aria-label="좁은 표현 장비 선택"
          layout="narrow"
          {...panelProps}
          compactContent={<CompactSelectableList rows={equipment} selectedIds={selectedIds} onToggle={toggle} />}
        />
      </section>
    </main>
  );
}

async function sharedSelectionPlay({ canvasElement }) {
    const wide = canvasElement.querySelector('[data-testid="shared-wide"]');
    const narrow = canvasElement.querySelector('[data-testid="shared-narrow"]');
    const wideCheckbox = (name) => wide.querySelector(`input[aria-label^="장비 ${name} 선택"]`);
    const narrowCheckbox = (id) => narrow.querySelector(`input[data-compact-checkbox="${id}"]`);
    const liveCount = () => narrow.querySelector('[data-compact-selection-count]');
    const waitFor = async (predicate, message) => {
      const deadline = Date.now() + 3000;
      while (!predicate()) {
        if (Date.now() > deadline) throw new Error(message);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    };

    const live = liveCount();
    if (!live || live.getAttribute('role') !== 'status' || live.getAttribute('aria-live') !== 'polite') {
      throw new Error('The compact representation must own a polite status region for its selection count.');
    }
    if (live.textContent.trim() !== '') throw new Error('The compact count must stay silent while nothing is selected.');

    /* 넓은 표현에서 선택하면 좁은 표현이 같은 ID로 따라온다. */
    await userEvent.click(wideCheckbox('LKR-T1 3호기'));
    await waitFor(() => narrowCheckbox('lkr-t1-03')?.checked, 'A wide selection must appear in the narrow representation.');
    await waitFor(() => liveCount().textContent.trim() === '1개 선택됨', 'The compact live count must announce the shared selection.');

    /* 좁은 표현에서 선택하면 넓은 표현이 따라온다. */
    await userEvent.click(narrowCheckbox('lkr-s2-01'));
    await waitFor(
      () => wideCheckbox('LKR-S2 1호기')?.checked,
      'A narrow selection must appear in the wide representation through the same model.',
    );
    await waitFor(() => liveCount().textContent.trim() === '2개 선택됨', 'The compact live count must follow both representations.');

    /* 해제도 같은 모델을 지난다. */
    await userEvent.click(narrowCheckbox('lkr-t1-03'));
    await waitFor(() => wideCheckbox('LKR-T1 3호기')?.checked === false, 'Clearing in the narrow list must clear the wide row.');
    await waitFor(() => liveCount().textContent.trim() === '1개 선택됨', 'The compact live count must fall back after a clear.');
}
