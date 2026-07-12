import {
  Icon,
  StatusBadge,
  Tree,
} from '../src/index.js';
import { userEvent, waitFor } from 'storybook/test';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Data/Collections/Tree',
  parameters: {
    storyGuide: {
      storyId: 'lds-product-data-collections-tree--tree-interaction-states',
      eyebrow: 'Product / Data / Tree',
      title: '사용자가 깊은 계층을 펼치며 현재 항목의 위치를 파악합니다',
      description:
        '문서·파일·레이어처럼 부모와 자식 관계가 중요한 구조를 탐색하고 선택할 때 적합합니다. 계층이 없는 짧은 옵션이나 여러 값을 동시에 고를 때는 Tree 대신 List 또는 Checkbox Group을 사용하세요.',
    },
    docs: {
      description: {
        component: '문서, 파일 구조처럼 계층을 펼치고 탐색하는 Tree 패턴입니다.',
      },
    },
  },
};

export default meta;

function TreeStatusDot({ tone = 'online' }) {
  const color = tone === 'offline' || tone === 'disabled' ? 'var(--color-semantic-interaction-inactive)' : tone === 'weak' || tone === 'review' ? 'var(--color-semantic-status-cautionary)' : 'var(--color-semantic-status-positive)';
  return <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />;
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
        icon: <TreeStatusDot tone="online" />,
        children: [
          { id: 'buttons', label: '버튼' },
          { id: 'forms', label: '폼' },
        ],
      },
      { id: 'tokens', label: '토큰', icon: <TreeStatusDot tone="disabled" /> },
    ],
  },
];

export const TreeInteractionStates = {
  name: '개요',
  parameters: storyDescription(
    '중첩된 워크스페이스 항목을 키보드와 포인터로 펼치고 선택하는 상황입니다. 계층 수준과 확장·선택·상태가 구분되며 포커스가 예측 가능한 순서로 이동하는지 확인하세요.',
  ),
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
            <h3 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--color-semantic-label-neutral)' }}>열림</h3>
            <StatusBadge tone="signal">노드 2개</StatusBadge>
          </div>
          <Tree defaultExpanded={['workspace', 'components']} nodes={hierarchyNodes} openOnHover style={{ alignSelf: 'start' }} />
        </div>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const tree = canvasElement.querySelector('[role="tree"]');
    const root = tree?.querySelector('[role="treeitem"]');
    root?.focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => {
      if (root?.getAttribute('aria-expanded') !== 'true') throw new Error('Right Arrow must expand a closed branch.');
    });
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => {
      if (document.activeElement?.dataset.treeKey !== 'components') throw new Error('Right Arrow on an open branch must focus its first child.');
    });
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    await waitFor(() => {
      if (document.activeElement?.dataset.treeKey !== 'buttons') throw new Error('Right Arrow must open a child branch and enter its first item.');
    });
    await userEvent.keyboard('{End}');
    if (document.activeElement?.dataset.treeKey !== 'tokens') throw new Error('End must focus the last visible tree item.');
    await userEvent.keyboard('{Home}');
    if (document.activeElement !== root) throw new Error('Home must focus the first tree item.');
    await userEvent.keyboard('{ArrowLeft}');
    if (root?.getAttribute('aria-expanded') !== 'false') throw new Error('Left Arrow must collapse an open branch.');
  },
};
