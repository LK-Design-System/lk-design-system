import {
  Icon,
  StatusBadge,
  Tree,
} from '../src/index.js';

const meta = {
  title: 'LK Product Extension/Data/Tree',
  parameters: {
    docs: {
      description: {
        component: '문서, 파일 구조처럼 계층을 펼치고 탐색하는 Tree 패턴입니다.',
      },
    },
  },
};

export default meta;

function TreeStatusDot({ tone = 'online' }) {
  const color = tone === 'offline' || tone === 'disabled' ? 'var(--bw-gray-300)' : tone === 'weak' || tone === 'review' ? 'var(--bw-amber)' : 'var(--bw-green)';
  return <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />;
}

const hierarchyNodes = [
  {
    id: 'workspace',
    label: 'workspace',
    icon: <Icon name="layers" size={16} />,
    children: [
      {
        id: 'components',
        label: 'components',
        icon: <TreeStatusDot tone="online" />,
        children: [
          { id: 'buttons', label: '/buttons' },
          { id: 'forms', label: '/forms' },
        ],
      },
      { id: 'tokens', label: 'tokens', icon: <TreeStatusDot tone="disabled" /> },
    ],
  },
];

export const TreeInteractionStates = {
  name: '트리 인터랙션',
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
            <h3 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--label-neutral)' }}>열림</h3>
            <StatusBadge tone="signal">2 nodes</StatusBadge>
          </div>
          <Tree defaultExpanded={['workspace', 'components']} nodes={hierarchyNodes} openOnHover style={{ alignSelf: 'start' }} />
        </div>
      </section>
    </main>
  ),
};
