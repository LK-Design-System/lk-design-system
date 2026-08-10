import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import {
  ContentBadge,
  DataCollectionPanel,
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

const projects = [
  {
    id: 'context-hub-v3',
    name: 'LK Context Hub v3',
    key: 'context-hub-v3',
    status: '진행 중',
    description: '근거 기반 Context, Wiki, 보고서와 연동 서비스를 한곳에서 탐색하는 지식 허브입니다.',
    counts: { sources: 0, people: 1, documents: 0, development: 0 },
  },
  {
    id: 'pet-edge-collector',
    name: 'PET Edge Collector',
    key: 'pet-edge-collector',
    status: '진행 중',
    description: '개인 업무 활동을 요약 근거로 안전하게 수집하는 Edge Collector입니다.',
    counts: { sources: 0, people: 0, documents: 0, development: 0 },
  },
  {
    id: 'vision-automation',
    name: 'Vision Automation',
    key: 'vision-automation',
    status: '진행 중',
    description: '산업 현장 비전 데이터와 로봇 자동화 워크플로를 연결하는 프로젝트입니다.',
    counts: { sources: 0, people: 1, documents: 0, development: 0 },
  },
  {
    id: 'semantic-reconciliation',
    name: 'Semantic Reconciliation Workspace',
    key: 'semantic-reconciliation',
    status: '검토 중',
    description: '긴 이름과 복합 상태가 좁은 화면에서도 손실 없이 읽히는지 확인하는 실제형 데이터입니다.',
    counts: { sources: 12, people: 4, documents: 38, development: 7 },
  },
];

function CountBadges({ counts }) {
  return (
    <span data-count-badges="" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
      <ContentBadge size="xsmall">자료 {counts.sources}</ContentBadge>
      <ContentBadge size="xsmall">사람 {counts.people}</ContentBadge>
      <ContentBadge size="xsmall">문서 {counts.documents}</ContentBadge>
      <ContentBadge size="xsmall">개발 현황 {counts.development}</ContentBadge>
    </span>
  );
}

const columns = [
  {
    key: 'name',
    label: '프로젝트',
    render: (project) => (
      <span style={{ display: 'grid', gap: 'var(--space-1)' }}>
        <a href={`#${project.id}`} style={{ color: 'var(--color-semantic-label-strong)', fontWeight: 'var(--fw-semibold)', textDecoration: 'none' }}>
          {project.name}
        </a>
        <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption1-size)', fontFamily: 'var(--font-mono)' }}>
          {project.key} · 2026-08-01 21:52
        </span>
      </span>
    ),
  },
  {
    key: 'status',
    label: '상태',
    width: 112,
    render: (project) => <StatusBadge tone={project.status === '진행 중' ? 'positive' : 'cautionary'}>{project.status}</StatusBadge>,
  },
  { key: 'description', label: '설명', truncate: true },
  {
    key: 'counts',
    label: '연결된 항목',
    width: 360,
    render: (project) => <CountBadges counts={project.counts} />,
  },
];

function CompactProjectList({ rows }) {
  return (
    <ul aria-label="좁은 화면 프로젝트" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {rows.map((project, index) => (
        <li
          key={project.id}
          style={{
            display: 'grid',
            gap: 'var(--space-2)',
            padding: 'var(--space-4)',
            borderBottom: index < rows.length - 1 ? '1px solid var(--color-semantic-line-normal-normal)' : 'none',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
            <a href={`#compact-${project.id}`} style={{ minWidth: 0, color: 'var(--color-semantic-label-strong)', fontWeight: 'var(--fw-semibold)', overflowWrap: 'anywhere' }}>
              {project.name}
            </a>
            <StatusBadge tone={project.status === '진행 중' ? 'positive' : 'cautionary'}>{project.status}</StatusBadge>
          </span>
          <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption1-size)', fontFamily: 'var(--font-mono)', overflowWrap: 'anywhere' }}>
            {project.key} · 2026-08-01 21:52
          </span>
          <span style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)', wordBreak: 'keep-all' }}>
            {project.description}
          </span>
          <CountBadges counts={project.counts} />
        </li>
      ))}
    </ul>
  );
}

function ProjectCollection({ layout = 'auto', state = 'ready', style, compact = true, content = true, label = '프로젝트 목록' }) {
  const [query, setQuery] = React.useState('');
  const [sort, setSort] = React.useState('recent');
  const [page, setPage] = React.useState(1);
  const filtered = projects.filter((project) => `${project.name} ${project.key} ${project.description}`.toLowerCase().includes(query.toLowerCase()));
  const rows = sort === 'name' ? [...filtered].sort((a, b) => a.name.localeCompare(b.name)) : filtered;

  return (
    <DataCollectionPanel
      aria-label={label}
      layout={layout}
      style={{ maxWidth: 1120, ...style }}
      toolbar={{
        size: 'sm',
        searchValue: query,
        onSearchChange: setQuery,
        searchPlaceholder: '프로젝트 이름, 키, 설명 검색',
        filters: ({ size }) => (
          <Select
            size={size}
            aria-label="프로젝트 정렬"
            value={sort}
            onChange={setSort}
            options={[
              { value: 'recent', label: '최근 변경순' },
              { value: 'name', label: '이름순' },
            ]}
          />
        ),
      }}
      resourceState={{
        state,
        title: state === 'empty' ? '검색 결과가 없습니다' : undefined,
        description: state === 'empty' ? '다른 검색어나 정렬 조건을 사용해 보세요.' : undefined,
        lastUpdated: state === 'stale' ? '2026-08-04 09:30' : undefined,
      }}
      compactContent={content && compact ? <CompactProjectList rows={rows} /> : undefined}
      footer={(
        <Pagination
          page={page}
          count={4}
          variant="compact"
          navigationLabel="프로젝트 페이지"
          previousPageLabel="이전 프로젝트 페이지"
          nextPageLabel="다음 프로젝트 페이지"
          onChange={setPage}
          showCounter
        />
      )}
    >
      {content ? <Table tableLabel="프로젝트" columns={columns} rows={rows} rowHeaderKey="name" /> : null}
    </DataCollectionPanel>
  );
}

export const Overview = {
  name: '개요',
  parameters: storyDescription(
    'Portal 프로젝트 디렉터리와 같은 실제형 긴 콘텐츠에서 toolbar, ready content와 footer가 하나의 perimeter와 DOM 순서를 공유합니다.',
  ),
  render: () => <ProjectCollection />,
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
    const input = root.querySelector('input[type="search"]');
    await userEvent.clear(input);
    await userEvent.type(input, 'Vision');
    await waitFor(() => {
      if (root.querySelectorAll('tbody tr').length !== 1 || !root.textContent.includes('Vision Automation')) {
        throw new Error('Product-owned controlled search must update collection content through toolbar props.');
      }
    });
    await userEvent.clear(input);
    await waitFor(() => {
      if (root.querySelectorAll('tbody tr').length !== projects.length) {
        throw new Error('Overview must restore the full collection after its search interaction check.');
      }
    });
    const visibleCountGroups = [...root.querySelectorAll('[data-count-badges]')]
      .filter((group) => group.getClientRects().length > 0);
    if (visibleCountGroups.length === 0 || visibleCountGroups.some((group) => (
      new Set([...group.children].map((badge) => Math.round(badge.getBoundingClientRect().top))).size > 1
    ))) {
      throw new Error('Connected-item badges must remain on one row in the wide table layout.');
    }
  },
};

export const NarrowCollection = {
  name: '반응형 · 좁은 의미 목록',
  parameters: storyDescription(
    '320px에서는 제품이 제공한 의미 목록만 표시합니다. 긴 프로젝트명, 상태, 설명과 연결 수를 유지하며 숨겨진 넓은 표의 링크는 Tab 순서에서 제외됩니다.',
  ),
  render: () => <ProjectCollection layout="narrow" style={{ width: 320 }} />,
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-lds-data-collection-panel]');
    const wide = root?.querySelector('[data-collection-content="wide"]');
    const compact = root?.querySelector('[data-collection-content="compact"]');
    if (getComputedStyle(wide).display !== 'none' || getComputedStyle(compact).display === 'none') {
      throw new Error('Narrow layout must expose only the product-authored compact content.');
    }
    if (!compact.querySelector('ul[aria-label="좁은 화면 프로젝트"]') || compact.querySelectorAll('li').length !== projects.length) {
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
  render: () => <ProjectCollection layout="narrow" compact={false} style={{ width: 320 }} />,
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-lds-data-collection-panel]');
    const wide = root?.querySelector('[data-collection-content="wide"]');
    if (root.dataset.hasCompactContent !== 'false' || getComputedStyle(wide).display === 'none') {
      throw new Error('Without compactContent, narrow layout must preserve the native Table content.');
    }
    if (!wide.querySelector('table[aria-label="프로젝트"]')) throw new Error('Table semantics must remain intact in the fallback path.');
  },
};

export const ResourceStates = {
  name: '변형·상태 · 불러오기, 빈 결과, 오래된 데이터',
  parameters: storyDescription(
    'blocking 상태는 content와 footer를 함께 대체하고, stale은 상태 메시지 뒤에 마지막 정상 content와 footer를 보존합니다.',
  ),
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 920 }}>
      <ProjectCollection state="loading" label="불러오는 프로젝트 목록" />
      <ProjectCollection state="empty" label="빈 프로젝트 목록" />
      <ProjectCollection state="stale" label="오래된 프로젝트 목록" />
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
      <ProjectCollection label="자동 좁은 패널" style={{ width: 760 }} />
      <ProjectCollection label="자동 넓은 패널" style={{ width: 800 }} />
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
      <ProjectCollection state="error" content={false} label="초기 오류 프로젝트 목록" />
      <ProjectCollection state="error" label="보존 오류 프로젝트 목록" />
      <ProjectCollection state="refreshing" label="새로 고침 프로젝트 목록" />
      <ProjectCollection state="offline" label="오프라인 프로젝트 목록" />
      <ProjectCollection state="restricted" label="권한 제한 프로젝트 목록" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const panel = (label) => canvasElement.querySelector(`[data-lds-data-collection-panel][aria-label="${label}"]`);
    const initialError = panel('초기 오류 프로젝트 목록');
    const preservedError = panel('보존 오류 프로젝트 목록');
    const refreshing = panel('새로 고침 프로젝트 목록');
    const offline = panel('오프라인 프로젝트 목록');
    const restricted = panel('권한 제한 프로젝트 목록');
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
  render: () => <ProjectCollection layout="wide" />,
};
