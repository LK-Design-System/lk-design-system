import React from 'react';
import {
  Button,
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

function ControlledTreeFixture() {
  const [selectedId, setSelectedId] = React.useState('workspace');
  const treeRef = React.useRef(null);
  return (
    <main style={{ display: 'grid', gap: 'var(--space-3)', maxWidth: 420 }}>
      <Button size="sm" variant="ghost" data-contract="focus-hidden-item" onClick={() => treeRef.current?.focusItem('buttons')}>
        Focus buttons without reveal
      </Button>
      <Button size="sm" variant="ghost" data-contract="focus-nested-item" onClick={() => treeRef.current?.focusItem('buttons', { reveal: true })}>
        Reveal and focus buttons
      </Button>
      <output data-contract="selected-tree-id">{selectedId}</output>
      <Tree
        ref={treeRef}
        ariaLabel="Controlled hierarchy"
        nodes={hierarchyNodes}
        selectedId={selectedId}
        onSelectedIdChange={setSelectedId}
      />
    </main>
  );
}

export const TreeSelectionContract = {
  name: '상호작용 · 선택과 초점 이동',
  parameters: storyDescription(
    '제어된 선택 상태와 키보드 초점이 독립적으로 이동하고, 숨겨진 하위 항목을 명령형 API로 드러내어 초점을 옮기는 계약을 검증합니다.',
  ),
  render: () => <ControlledTreeFixture />,
  play: async ({ canvasElement }) => {
    const tree = canvasElement.querySelector('[role="tree"][aria-label="Controlled hierarchy"]');
    const focusHiddenButton = canvasElement.querySelector('[data-contract="focus-hidden-item"]');
    const revealButton = canvasElement.querySelector('[data-contract="focus-nested-item"]');
    const selectedOutput = canvasElement.querySelector('[data-contract="selected-tree-id"]');
    const root = tree?.querySelector('[data-tree-key="workspace"]');
    if (!tree || !focusHiddenButton || !revealButton || !selectedOutput || !root) {
      throw new Error('Tree selection contract targets are required.');
    }
    if (root.getAttribute('aria-selected') !== 'true') {
      throw new Error('A controlled selectedId must expose aria-selected on the matching row.');
    }

    await userEvent.click(focusHiddenButton);
    root.focus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    await waitFor(() => {
      if (document.activeElement?.dataset.treeKey !== 'components') {
        throw new Error('focusItem without reveal must not defer focus for a hidden row.');
      }
    });
    await userEvent.keyboard('{Home}{ArrowLeft}');

    root.focus();
    await userEvent.keyboard('{ArrowRight}{End}{Enter}');
    await waitFor(() => {
      const selected = tree.querySelector('[data-tree-key="tokens"]');
      if (selectedOutput.textContent?.trim() !== 'tokens' || selected?.getAttribute('aria-selected') !== 'true') {
        throw new Error('Activation must request and render controlled selection.');
      }
    });

    await userEvent.keyboard('{Home}');
    if (document.activeElement !== root || root.getAttribute('aria-selected') !== 'false'
      || tree.querySelector('[data-tree-key="tokens"]')?.getAttribute('aria-selected') !== 'true') {
      throw new Error('Roving focus must move independently from persistent selection.');
    }

    await userEvent.click(revealButton);
    await waitFor(() => {
      const nested = tree.querySelector('[data-tree-key="buttons"]');
      if (!nested || document.activeElement !== nested) {
        throw new Error('focusItem(id, { reveal: true }) must expand ancestors and focus the requested row.');
      }
      if (nested.getAttribute('aria-selected') !== 'false' || selectedOutput.textContent?.trim() !== 'tokens') {
        throw new Error('Imperative focus must not change controlled selection.');
      }
    });
  },
};
