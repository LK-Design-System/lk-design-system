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
  tags: ['autodocs'],
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
      {
        id: 'tokens',
        label: '토큰',
        description: '동기화가 끝날 때까지 선택할 수 없습니다.',
        meta: '읽기 전용',
        end: <StatusBadge tone="neutral">잠김</StatusBadge>,
        icon: <TreeStatusDot tone="disabled" />,
        disabled: true,
        ariaLabel: '토큰, 읽기 전용, 사용할 수 없음',
      },
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
          <h2 style={{ margin: '0 0 var(--space-3)', fontSize: 14, lineHeight: 1.35, color: 'var(--color-semantic-label-neutral)' }}>기본</h2>
          <Tree nodes={hierarchyNodes} style={{ alignSelf: 'start' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: 190, background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
          <h2 style={{ margin: '0 0 var(--space-3)', fontSize: 14, lineHeight: 1.35, color: 'var(--color-semantic-label-neutral)' }}>호버 / 포커스</h2>
          <Tree defaultExpanded={['workspace']} nodes={hierarchyNodes} openOnHover style={{ alignSelf: 'start' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: 190, background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
            <h2 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--color-semantic-label-neutral)' }}>열림</h2>
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
      if (document.activeElement?.dataset.treeId !== 'components') throw new Error('Right Arrow on an open branch must focus its first child.');
    });
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    await waitFor(() => {
      if (document.activeElement?.dataset.treeId !== 'buttons') throw new Error('Right Arrow must open a child branch and enter its first item.');
    });
    await userEvent.keyboard('{End}');
    if (document.activeElement?.dataset.treeId !== 'tokens') throw new Error('End must focus the last visible tree item.');
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

function UncontrolledTreeFixture() {
  const [selectionEvents, setSelectionEvents] = React.useState([]);
  const [activationEvents, setActivationEvents] = React.useState([]);
  const nodes = React.useMemo(() => [
    {
      id: 'uncontrolled-alpha',
      label: 'Alpha',
      onSelect: () => setActivationEvents((events) => [...events, 'uncontrolled-alpha']),
    },
    {
      id: 'uncontrolled-beta',
      label: 'Beta',
      onSelect: () => setActivationEvents((events) => [...events, 'uncontrolled-beta']),
    },
  ], []);

  return (
    <section aria-label="Uncontrolled selection contract" style={{ display: 'grid', gap: 'var(--space-2)' }}>
      <output data-contract="uncontrolled-selection-events">{selectionEvents.join('|')}</output>
      <output data-contract="uncontrolled-activation-events">{activationEvents.join('|')}</output>
      <Tree
        ariaLabel="Uncontrolled hierarchy"
        nodes={nodes}
        defaultSelectedId="uncontrolled-beta"
        onSelectedIdChange={(id) => setSelectionEvents((events) => [...events, id])}
        onSelect={(node) => node.onSelect?.()}
      />
    </section>
  );
}

const repeatedLabelNodes = [
  { label: 'Repeated branch', children: [{ label: 'Nested branch A' }] },
  { label: 'Repeated branch', children: [{ label: 'Nested branch B' }] },
  { label: <span>Repeated label</span> },
  { label: <span>Repeated label</span> },
  { id: 'explicit-repeated-a', label: <span>Repeated label</span> },
  { id: 'explicit-repeated-b', label: <span>Repeated label</span> },
];

function IdentityTreeFixture() {
  const treeRef = React.useRef(null);
  return (
    <section aria-label="Tree identity contract" style={{ display: 'grid', gap: 'var(--space-2)' }}>
      <Button
        size="sm"
        variant="ghost"
        data-contract="focus-explicit-repeated"
        onClick={() => treeRef.current?.focusItem('explicit-repeated-a')}
      >
        Focus explicit repeated item
      </Button>
      <Tree
        ref={treeRef}
        ariaLabel="Repeated labels hierarchy"
        nodes={repeatedLabelNodes}
      />
    </section>
  );
}

const focusRaceNodes = [
  {
    id: 'hidden-parent',
    label: 'Hidden parent',
    children: [{ id: 'hidden-target', label: 'Hidden target' }],
  },
  { id: 'visible-target', label: 'Visible target' },
];

function FocusRaceFixture() {
  const treeRef = React.useRef(null);
  return (
    <section aria-label="Imperative focus ordering contract" style={{ display: 'grid', gap: 'var(--space-2)' }}>
      <Button
        size="sm"
        variant="ghost"
        data-contract="run-focus-race"
        onClick={() => {
          treeRef.current?.focusItem('hidden-target', { reveal: true });
          treeRef.current?.focusItem('visible-target');
        }}
      >
        Run focus ordering contract
      </Button>
      <Tree ref={treeRef} ariaLabel="Focus ordering hierarchy" nodes={focusRaceNodes} />
    </section>
  );
}

function ReorderTreeFixture() {
  const [phase, setPhase] = React.useState(0);
  const children = phase === 0
    ? [
      { id: 'stable-child', label: 'Stable child' },
      { id: 'stable-child-sibling', label: 'Stable child sibling' },
    ]
    : phase === 1
      ? [
      { id: 'inserted-child', label: 'Inserted child' },
      { id: 'stable-child-sibling', label: 'Stable child sibling' },
      { id: 'stable-child', label: 'Stable child' },
      ]
      : [
        { id: 'inserted-child', label: 'Inserted child' },
        { id: 'stable-child-sibling', label: 'Stable child sibling' },
        { id: 'replacement-child', label: 'Replacement child' },
      ];
  const nodes = [{ id: 'stable-parent', label: 'Stable parent', children }];

  return (
    <section aria-label="Tree reorder contract" style={{ display: 'grid', gap: 'var(--space-2)' }}>
      <p style={{ margin: 0 }}>Activate the focused child to insert and reorder its siblings.</p>
      <Tree
        ariaLabel="Reordered hierarchy"
        nodes={nodes}
        onSelect={(node) => {
          if (node.id === 'stable-child') setPhase((currentPhase) => Math.min(currentPhase + 1, 2));
        }}
      />
    </section>
  );
}

function TreeSelectionContractFixture() {
  return (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 560 }}>
      <ControlledTreeFixture />
      <UncontrolledTreeFixture />
      <IdentityTreeFixture />
      <FocusRaceFixture />
      <ReorderTreeFixture />
    </main>
  );
}

function treeItemById(tree, id) {
  return Array.from(tree.querySelectorAll('[role="treeitem"]'))
    .find((item) => item.dataset.treeId === id);
}

export const TreeSelectionContract = {
  name: '상호작용 · 선택과 초점 이동',
  parameters: storyDescription(
    '제어된 선택 상태와 키보드 초점이 독립적으로 이동하고, 숨겨진 하위 항목을 명령형 API로 드러내어 초점을 옮기는 계약을 검증합니다.',
  ),
  render: () => <TreeSelectionContractFixture />,
  play: async ({ canvasElement }) => {
    const tree = canvasElement.querySelector('[role="tree"][aria-label="Controlled hierarchy"]');
    const focusHiddenButton = canvasElement.querySelector('[data-contract="focus-hidden-item"]');
    const revealButton = canvasElement.querySelector('[data-contract="focus-nested-item"]');
    const selectedOutput = canvasElement.querySelector('[data-contract="selected-tree-id"]');
    const root = tree && treeItemById(tree, 'workspace');
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
      if (document.activeElement?.dataset.treeId !== 'components') {
        throw new Error('focusItem without reveal must not defer focus for a hidden row.');
      }
    });
    await userEvent.keyboard('{Home}{ArrowLeft}');

    root.focus();
    await userEvent.keyboard('{ArrowRight}{End}{Enter}');
    await waitFor(() => {
      const selected = treeItemById(tree, 'tokens');
      if (selectedOutput.textContent?.trim() !== 'tokens' || selected?.getAttribute('aria-selected') !== 'true') {
        throw new Error('Activation must request and render controlled selection.');
      }
    });

    await userEvent.keyboard('{Home}');
    if (document.activeElement !== root || root.getAttribute('aria-selected') !== 'false'
      || treeItemById(tree, 'tokens')?.getAttribute('aria-selected') !== 'true') {
      throw new Error('Roving focus must move independently from persistent selection.');
    }

    await userEvent.click(revealButton);
    await waitFor(() => {
      const nested = treeItemById(tree, 'buttons');
      if (!nested || document.activeElement !== nested) {
        throw new Error('focusItem(id, { reveal: true }) must expand ancestors and focus the requested row.');
      }
      if (nested.getAttribute('aria-selected') !== 'false' || selectedOutput.textContent?.trim() !== 'tokens') {
        throw new Error('Imperative focus must not change controlled selection.');
      }
    });

    const uncontrolledTree = canvasElement.querySelector('[role="tree"][aria-label="Uncontrolled hierarchy"]');
    const selectionEvents = canvasElement.querySelector('[data-contract="uncontrolled-selection-events"]');
    const activationEvents = canvasElement.querySelector('[data-contract="uncontrolled-activation-events"]');
    const uncontrolledAlpha = uncontrolledTree && treeItemById(uncontrolledTree, 'uncontrolled-alpha');
    const uncontrolledBeta = uncontrolledTree && treeItemById(uncontrolledTree, 'uncontrolled-beta');
    if (!uncontrolledTree || !selectionEvents || !activationEvents || !uncontrolledAlpha || !uncontrolledBeta) {
      throw new Error('Uncontrolled Tree contract targets are required.');
    }
    if (uncontrolledBeta.getAttribute('aria-selected') !== 'true') {
      throw new Error('defaultSelectedId must initialize uncontrolled selection.');
    }

    await userEvent.click(uncontrolledAlpha);
    await waitFor(() => {
      if (uncontrolledAlpha.getAttribute('aria-selected') !== 'true'
        || selectionEvents.textContent?.trim() !== 'uncontrolled-alpha'
        || activationEvents.textContent?.trim() !== 'uncontrolled-alpha') {
        throw new Error('Pointer activation must update uncontrolled selection and notify both callbacks.');
      }
    });

    uncontrolledAlpha.focus();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await waitFor(() => {
      if (uncontrolledBeta.getAttribute('aria-selected') !== 'true'
        || selectionEvents.textContent?.trim() !== 'uncontrolled-alpha|uncontrolled-beta'
        || activationEvents.textContent?.trim() !== 'uncontrolled-alpha|uncontrolled-beta') {
        throw new Error('Keyboard activation must update uncontrolled selection and notify both callbacks.');
      }
    });

    const repeatedTree = canvasElement.querySelector('[role="tree"][aria-label="Repeated labels hierarchy"]');
    const focusRepeatedButton = canvasElement.querySelector('[data-contract="focus-explicit-repeated"]');
    if (!repeatedTree || !focusRepeatedButton) throw new Error('Repeated-label Tree contract targets are required.');
    const repeatedItems = Array.from(repeatedTree.querySelectorAll('[role="treeitem"]'));
    const rovingItems = repeatedItems.filter((item) => item.tabIndex === 0);
    const internalKeys = repeatedItems.map((item) => item.dataset.treeKey);
    if (rovingItems.length !== 1 || new Set(internalKeys).size !== repeatedItems.length) {
      throw new Error('Duplicate and React-element labels must retain unique identity and exactly one roving tab stop.');
    }
    await userEvent.click(repeatedItems[0]);
    await waitFor(() => {
      if (repeatedItems[0].getAttribute('aria-expanded') !== 'true'
        || repeatedItems[1].getAttribute('aria-expanded') !== 'false') {
        throw new Error('Duplicate primitive labels must retain independent expansion state.');
      }
    });
    const explicitA = treeItemById(repeatedTree, 'explicit-repeated-a');
    const explicitB = treeItemById(repeatedTree, 'explicit-repeated-b');
    if (!explicitA || !explicitB) throw new Error('Explicit repeated-label items must be addressable by id.');
    await userEvent.click(explicitB);
    await waitFor(() => {
      if (explicitB.getAttribute('aria-selected') !== 'true' || explicitA.getAttribute('aria-selected') === 'true') {
        throw new Error('An explicit unique id must select only its matching repeated-label item.');
      }
    });
    await userEvent.click(focusRepeatedButton);
    await waitFor(() => {
      if (document.activeElement !== explicitA) {
        throw new Error('focusItem must address an explicit unique id without depending on its label.');
      }
    });

    const focusRaceTree = canvasElement.querySelector('[role="tree"][aria-label="Focus ordering hierarchy"]');
    const runFocusRaceButton = canvasElement.querySelector('[data-contract="run-focus-race"]');
    const visibleTarget = focusRaceTree && treeItemById(focusRaceTree, 'visible-target');
    if (!focusRaceTree || !runFocusRaceButton || !visibleTarget) {
      throw new Error('Imperative focus ordering contract targets are required.');
    }
    await userEvent.click(runFocusRaceButton);
    await waitFor(() => {
      if (document.activeElement !== visibleTarget) {
        throw new Error('The latest focusItem call must win immediately.');
      }
    });
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    if (document.activeElement !== visibleTarget) {
      throw new Error('An older reveal request must not steal focus after the latest focusItem call wins.');
    }

    const reorderTree = canvasElement.querySelector('[role="tree"][aria-label="Reordered hierarchy"]');
    const stableParentBefore = reorderTree && treeItemById(reorderTree, 'stable-parent');
    if (!reorderTree || !stableParentBefore) {
      throw new Error('Tree reorder contract targets are required.');
    }
    stableParentBefore.focus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    const stableChildBefore = treeItemById(reorderTree, 'stable-child');
    if (!stableChildBefore) throw new Error('The stable-ID child must be visible before reorder.');
    await waitFor(() => {
      if (stableParentBefore.getAttribute('aria-expanded') !== 'true'
        || stableChildBefore.tabIndex !== 0
        || document.activeElement !== stableChildBefore) {
        throw new Error('The parent must be expanded and its stable-ID child must own focus before reorder.');
      }
    });
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      const stableParentAfter = treeItemById(reorderTree, 'stable-parent');
      const stableChildAfter = treeItemById(reorderTree, 'stable-child');
      const insertedChild = treeItemById(reorderTree, 'inserted-child');
      const rovingItemsAfter = Array.from(reorderTree.querySelectorAll('[role="treeitem"]'))
        .filter((item) => item.tabIndex === 0);
      if (!stableParentAfter || !stableChildAfter || !insertedChild) {
        throw new Error('Nested insertion and reorder must preserve the stable-ID parent and child.');
      }
      if (stableParentAfter.getAttribute('aria-expanded') !== 'true') {
        throw new Error('Expanded state must remain attached to the same explicit parent ID after nested reorder.');
      }
      if (rovingItemsAfter.length !== 1 || rovingItemsAfter[0] !== stableChildAfter) {
        throw new Error('The single roving tab stop must remain attached to the same explicit child ID after nested reorder.');
      }
      if (document.activeElement !== stableChildAfter) {
        throw new Error('DOM focus must remain on the same explicit child ID after nested reorder.');
      }
    });

    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      const currentItems = Array.from(reorderTree.querySelectorAll('[role="treeitem"]'));
      const currentRovingItems = currentItems.filter((item) => item.tabIndex === 0);
      const removedChild = treeItemById(reorderTree, 'stable-child');
      const replacementChild = treeItemById(reorderTree, 'replacement-child');
      if (removedChild || !replacementChild) {
        throw new Error('The focused child must be removed and replaced without changing the sibling count.');
      }
      if (currentRovingItems.length !== 1 || !currentItems.includes(currentRovingItems[0])) {
        throw new Error('Removing the focused ID must repair to exactly one roving tab stop on an existing row.');
      }
    });
  },
};
