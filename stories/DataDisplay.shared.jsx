import React from 'react';
import {
  Calendar,
  Icon,
  StatusBadge,
  Table,
  Tree,
} from '../src/index.js';

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

const hierarchyNodes = [
  {
    id: 'workspace',
    label: '워크스페이스',
    icon: <Icon name="layers" size={16} />,
    children: [
      {
        id: 'components',
        label: '컴포넌트',
        icon: <TreeStatusDot tone="active" />,
        children: [
          { id: 'buttons', label: '버튼' },
          { id: 'forms', label: '폼' },
        ],
      },
      { id: 'tokens', label: '토큰', icon: <TreeStatusDot tone="disabled" /> },
    ],
  },
];

export const CalendarCard = {
  name: 'Calendar card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 360, height: 340, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box' }}>
      <Calendar defaultValue="2026-07-03" />
    </div>
  ),
};

export const TreeInteractionStates = {
  name: '계층 인터랙션 상태',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 760 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', alignItems: 'stretch' }}>
        <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: 190, background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
          <h3 style={{ margin: '0 0 var(--space-3)', fontSize: 14, lineHeight: 1.35, color: 'var(--color-semantic-label-neutral)' }}>기본</h3>
          <Tree nodes={hierarchyNodes} style={{ alignSelf: 'start' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: 190, background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
          <h3 style={{ margin: '0 0 var(--space-3)', fontSize: 14, lineHeight: 1.35, color: 'var(--color-semantic-label-neutral)' }}>호버 / 포커스</h3>
          <Tree defaultExpanded={['workspace']} nodes={hierarchyNodes} openOnHover style={{ alignSelf: 'start' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: 190, background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
          <h3 style={{ margin: '0 0 var(--space-3)', fontSize: 14, lineHeight: 1.35, color: 'var(--color-semantic-label-neutral)' }}>열림</h3>
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
