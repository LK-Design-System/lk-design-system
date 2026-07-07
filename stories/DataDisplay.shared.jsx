import React from 'react';
import {
  BarChart,
  Calendar,
  DataGrid,
  DescriptionList,
  DonutChart,
  Icon,
  Sparkline,
  StatusBadge,
  Table,
  Tree,
} from '../src/index.js';

const rows = [
  { id: 'ITEM-104', group: '문서', status: 'active', progress: 86 },
  { id: 'ITEM-212', group: '컴포넌트', status: 'review', progress: 47 },
  { id: 'ITEM-318', group: '토큰', status: 'disabled', progress: 12 },
];

const statusTone = { active: 'positive', review: 'cautionary', disabled: 'offline' };

function TreeStatusDot({ tone = 'online' }) {
  const color = tone === 'offline' || tone === 'disabled' ? 'var(--bw-gray-300)' : tone === 'weak' || tone === 'review' ? 'var(--bw-amber)' : 'var(--bw-green)';
  return (
    <span
      aria-hidden="true"
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        flexShrink: 0,
      }}
    />
  );
}

function ProgressCell({ value }) {
  const tone = value <= 20 ? 'var(--bw-red)' : value <= 50 ? 'var(--bw-amber)' : 'var(--lk-accent-ink)';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, width: '100%', minWidth: 112 }}>
      <span style={{ position: 'relative', width: 64, height: 5, borderRadius: 'var(--radius-pill)', background: 'var(--fill-strong)', overflow: 'hidden' }}>
        <span style={{ position: 'absolute', insetBlock: 0, left: 0, width: `${value}%`, borderRadius: 'inherit', background: tone }} />
      </span>
      <strong style={{ minWidth: 36, color: 'var(--label-strong)', fontVariantNumeric: 'tabular-nums' }}>{value}%</strong>
    </span>
  );
}

const columns = [
  { key: 'id', label: '항목', sortable: true },
  { key: 'group', label: '그룹' },
  { key: 'status', label: '상태', render: (row) => <StatusBadge tone={statusTone[row.status]}>{row.status}</StatusBadge> },
  { key: 'progress', label: '진행률', align: 'right', render: (row) => <ProgressCell value={row.progress} /> },
];

const hierarchyNodes = [
  {
    id: 'workspace',
    label: 'workspace',
    icon: <Icon name="layers" size={16} />,
    children: [
      {
        id: 'components',
        label: 'components',
        icon: <TreeStatusDot tone="active" />,
        children: [
          { id: 'buttons', label: '/buttons' },
          { id: 'forms', label: '/forms' },
        ],
      },
      { id: 'tokens', label: 'tokens', icon: <TreeStatusDot tone="disabled" /> },
    ],
  },
];

export const ChartsAndCalendar = {
  name: '차트와 캘린더',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1040 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
          <BarChart
            height={180}
            showValue
            data={[
              { label: '초안', value: 42 },
              { label: '검토', value: 28 },
              { label: '승인', value: 18 },
              { label: '보류', value: 7 },
            ]}
          />
        </div>
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
          <DonutChart
            centerLabel="95%"
            segments={[
              { label: '정상', value: 72, color: 'var(--bw-green)' },
              { label: '검토', value: 18, color: 'var(--bw-amber)' },
              { label: '중지', value: 5, color: 'var(--bw-red)' },
            ]}
          />
        </div>
        <Calendar defaultValue="2026-07-05" />
      </section>

      <section style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <Sparkline data={[8, 12, 9, 16, 15, 22, 18, 28]} width={220} height={64} />
        <span style={{ color: 'var(--label-neutral)' }}>일일 처리량 추세</span>
      </section>
    </main>
  ),
};

export const CalendarCard = {
  name: 'Calendar card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 360, height: 340, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box' }}>
      <Calendar defaultValue="2026-07-03" />
    </div>
  ),
};

export const TablesAndHierarchy = {
  name: '표와 계층',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 1040, minWidth: 0 }}>
      <section style={{ display: 'grid', gap: 'var(--space-3)', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, lineHeight: 1.35, color: 'var(--label-strong)' }}>항목 목록</h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, lineHeight: 1.45, color: 'var(--label-alternative)' }}>상태, 그룹, 진행률 정보를 한 화면에서 비교합니다.</p>
          </div>
          <StatusBadge tone="online">3대 등록</StatusBadge>
        </div>
        <DataGrid columns={columns} rows={rows} selectable style={{ minWidth: 0, background: 'var(--surface-card)' }} />
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-3)', minWidth: 0 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--label-strong)' }}>정적 표</h3>
          <p style={{ margin: '4px 0 0', fontSize: 12.5, lineHeight: 1.45, color: 'var(--label-alternative)' }}>정렬과 선택이 필요 없는 읽기 전용 데이터에는 기본 Table을 사용합니다.</p>
        </div>
        <Table columns={columns} rows={rows} style={{ minWidth: 0 }} />
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 'var(--space-5)', alignItems: 'start', minWidth: 0 }}>
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <h3 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--label-strong)' }}>토픽 메타데이터</h3>
          <DescriptionList
            columns={1}
            items={[
              { term: '문서 유형', description: 'Component guide' },
              { term: '검토 주기', description: '주간' },
              { term: '검증 상태', description: '완료' },
            ]}
          />
        </div>
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--label-strong)' }}>프로젝트 계층</h3>
              <p style={{ margin: '3px 0 0', fontSize: 12.5, lineHeight: 1.45, color: 'var(--label-alternative)' }}>섹션과 하위 항목을 확인합니다.</p>
            </div>
            <StatusBadge tone="signal">2 nodes</StatusBadge>
          </div>
          <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', padding: 8 }}>
            <Tree
              defaultExpanded={['workspace']}
              nodes={hierarchyNodes}
              openOnHover
            />
          </div>
        </div>
      </section>

    </main>
  ),
};

export const TreeInteractionStates = {
  name: '계층 인터랙션 상태',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 760 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', alignItems: 'stretch' }}>
        <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: 190, background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
          <h3 style={{ margin: '0 0 var(--space-3)', fontSize: 14, lineHeight: 1.35, color: 'var(--label-neutral)' }}>기본</h3>
          <Tree nodes={hierarchyNodes} style={{ alignSelf: 'start' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: 190, background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
          <h3 style={{ margin: '0 0 var(--space-3)', fontSize: 14, lineHeight: 1.35, color: 'var(--label-neutral)' }}>Hover / focus</h3>
          <Tree defaultExpanded={['workspace']} nodes={hierarchyNodes} openOnHover style={{ alignSelf: 'start' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: 190, background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
          <h3 style={{ margin: '0 0 var(--space-3)', fontSize: 14, lineHeight: 1.35, color: 'var(--label-neutral)' }}>열림</h3>
          <Tree defaultExpanded={['workspace', 'components']} nodes={hierarchyNodes} openOnHover style={{ alignSelf: 'start' }} />
        </div>
      </section>
    </main>
  ),
};

export const TableCard = {
  name: 'Table card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 440, height: 260, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ background: 'var(--bw-white)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-xl)', padding: 8 }}>
        <Table
          columns={[
            { key: 'code', label: '모델' },
            { key: 'site', label: '현장' },
            { key: 'status', label: '상태', render: (row) => <StatusBadge tone={row.tone}>{row.status}</StatusBadge> },
          ]}
          rows={[
            { code: 'LKR-T1', site: '판교 물류센터', status: '가동중', tone: 'positive' },
            { code: 'LKR-CP', site: '인천공항 T2', status: '점검 중', tone: 'warning' },
            { code: 'LKR-S1', site: '고리 발전소', status: '오프라인', tone: 'offline' },
          ]}
        />
      </div>
    </div>
  ),
};
