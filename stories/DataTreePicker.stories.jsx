import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { TreePicker } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const focusableSelector = 'a[href], button, input, select, textarea, [tabindex]';

function focusableInside(element) {
  const candidates = [...element.querySelectorAll(focusableSelector)];
  if (element.matches(focusableSelector)) candidates.unshift(element);
  return candidates.filter((candidate) => candidate.getAttribute('tabindex') !== '-1');
}

const nodes = [
  {
    id: 'sensors',
    label: '센서 토픽',
    description: '실시간 입력',
    children: [
      { id: '/scan', label: '/scan', meta: '10 Hz' },
      { id: '/imu', label: '/imu', meta: '50 Hz' },
      {
        id: 'camera',
        label: 'camera',
        children: [
          { id: '/camera/rgb', label: '/camera/rgb', meta: '30 Hz' },
          { id: '/camera/depth', label: '/camera/depth', meta: '30 Hz' },
        ],
      },
    ],
  },
  {
    id: 'navigation',
    label: '주행 토픽',
    children: [
      { id: '/odom', label: '/odom', meta: '20 Hz' },
      { id: '/cmd_vel', label: '/cmd_vel', meta: '권한 없음', disabled: true },
    ],
  },
];

export default {
  title: 'LDS Product/Selection and Input/Tree Picker',
  component: TreePicker,
  decorators: [(Story) => <div style={{ width: '100%', maxWidth: 720 }}><Story /></div>],
  parameters: {
    storyGuide: {
      storyId: 'lds-product-selection-and-input-tree-picker--descendant-scope',
      eyebrow: 'Product / Tree Picker',
      title: '트리 피커는 계층을 탐색하면서 상위·하위 범위를 함께 선택합니다',
      description:
        '토픽·폴더처럼 부모와 자식 관계를 보존한 채 여러 범위를 고를 때 적합합니다. 평면 목록이나 단일 선택에는 Tree Picker 대신 Searchable Multi Select 또는 Select를 사용하세요.',
    },
    docs: {
      description: {
        component: '계층 검색과 분리된 다중 선택 입력입니다. 하나의 순환 초점 지점, 방향키 탐색, 문자 입력 탐색, 선택·부분 선택 상태를 제공합니다.',
      },
    },
  },
};

export const DescendantScope = {
  name: '개요',
  parameters: storyDescription(
    '센서·주행 토픽 계층에서 여러 하위 범위를 controlled selection으로 선택합니다. 부모 확장과 자식 선택 상태가 분리되면서 상위 집계가 이해되는지 확인하세요.',
  ),
  render: function Example() {
    const [selectedIds, setSelectedIds] = React.useState(['/scan', '/odom']);
    const [expandedIds, setExpandedIds] = React.useState(['sensors', 'navigation']);
    return (
      <TreePicker
        nodes={nodes}
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
        expandedIds={expandedIds}
        onExpandedIdsChange={setExpandedIds}
        label="토픽 범위 선택"
      />
    );
  },
};

export const IndependentSelection = {
  name: '사용법 · 항목 독립 선택',
  parameters: storyDescription(
    '부모·자식의 선택을 서로 독립적으로 다루는 변형입니다. 계층 탐색은 유지하되 상위 선택이 하위 전체를 암묵적으로 바꾸지 않는지 확인하세요.',
  ),
  args: {
    nodes: nodes.map((node) => ({ ...node, selectable: true })),
    selectionBehavior: 'independent',
    defaultSelectedIds: ['sensors', '/odom'],
    defaultExpandedIds: ['sensors', 'navigation'],
    label: '독립적인 토픽 항목 선택',
  },
};

export const Search = {
  name: '시나리오 · 검색으로 범위 축소',
  parameters: storyDescription(
    'camera 검색어로 계층을 좁히고 depth 토픽을 선택한 상태입니다. 검색 결과에서도 원래 계층 맥락과 기존 선택이 보존되는지 확인하세요.',
  ),
  args: {
    nodes,
    defaultQuery: 'camera',
    defaultSelectedIds: ['/camera/depth'],
    label: '검색된 토픽 선택',
  },
};

export const ResourceStates = {
  name: '변형·상태 · 빈 상태 · 검색 결과 없음과 전체 비활성',
  parameters: storyDescription(
    '데이터 없음, 검색 결과 없음, 전체 비활성 상태를 비교합니다. 각 상태가 서로 다른 원인과 다음 행동을 전달하고 선택 가능한 항목처럼 보이지 않는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))' }}>
      <TreePicker nodes={[]} emptyMessage="사용 가능한 범위가 없습니다." />
      <TreePicker nodes={nodes} defaultQuery="map" noResultsMessage="일치하는 토픽이 없습니다." />
      <TreePicker nodes={nodes} disabled defaultExpandedIds={['sensors']} label="비활성 토픽 선택" />
    </main>
  ),
};

export const DisabledFirstNode = {
  name: '변형·상태 · 첫 항목 비활성과 키보드 탐색',
  parameters: storyDescription(
    '첫 노드가 권한 때문에 비활성인 트리입니다. roving focus가 다음 사용 가능 항목에서 시작하고 문자 입력 탐색이 일치하는 label로 이동하는지 확인하세요.',
  ),
  args: {
    nodes: [
      { id: 'restricted', label: '권한 없는 범위', disabled: true },
      ...nodes,
    ],
    defaultExpandedIds: ['sensors'],
    label: '비활성 범위를 건너뛰는 선택',
  },
  play: async ({ canvasElement }) => {
    const restricted = canvasElement.querySelector('[data-tree-picker-id="restricted"]');
    const sensors = canvasElement.querySelector('[data-tree-picker-id="sensors"]');
    if (!restricted || !sensors || restricted.tabIndex !== -1 || sensors.tabIndex !== 0) {
      throw new Error('Roving focus must start on the first enabled treeitem.');
    }

    sensors.focus();
    await userEvent.keyboard('{ArrowDown}');
    if (canvasElement.ownerDocument.activeElement?.getAttribute('data-tree-picker-id') !== '/scan') {
      throw new Error('ArrowDown must move to the next visible enabled treeitem.');
    }

    await userEvent.keyboard('c');
    if (canvasElement.ownerDocument.activeElement?.getAttribute('data-tree-picker-id') !== 'camera') {
      throw new Error('Printable-key typeahead must move focus to the next matching label.');
    }
  },
};

export const DisabledDescendantSelection = {
  name: '변형·상태 · 비활성 하위 항목을 제외한 상위 집계',
  parameters: storyDescription(
    '주행 branch에 선택 가능한 토픽과 권한 없는 토픽이 함께 있습니다. 부모 선택이 사용 가능한 하위 항목만 포함하고 비활성 자식의 상태를 바꾸지 않는지 확인하세요.',
  ),
  args: {
    nodes: [nodes[1]],
    defaultExpandedIds: ['navigation'],
    label: '선택 가능한 주행 토픽',
  },
  play: async ({ canvasElement }) => {
    const parent = canvasElement.querySelector('[data-tree-picker-id="navigation"]');
    const enabledChild = canvasElement.querySelector('[data-tree-picker-id="/odom"]');
    const disabledChild = canvasElement.querySelector('[data-tree-picker-id="/cmd_vel"]');
    if (!parent || !enabledChild || !disabledChild) throw new Error('The disabled-descendant fixture is incomplete.');

    parent.focus();
    await userEvent.keyboard(' ');
    if (parent.getAttribute('aria-checked') !== 'true' || enabledChild.getAttribute('aria-checked') !== 'true') {
      throw new Error('Selecting a branch must select every enabled descendant and mark the branch checked.');
    }
    if (disabledChild.getAttribute('aria-disabled') !== 'true') {
      throw new Error('A disabled descendant must remain disabled and outside the parent action set.');
    }
  },
};

export const CheckIndicatorDecorationContract = {
  name: '체크 표시기 장식 계약',
  tags: ['!dev'],
  args: {
    nodes,
    defaultSelectedIds: ['/scan'],
    defaultExpandedIds: ['sensors', 'navigation'],
    label: '장식 표시기 계약',
  },
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const tree = canvasElement.querySelector('[role="tree"]');
    if (!tree) throw new Error('The decoration fixture must render a tree.');

    /* Axe aria-hidden-focus: aria-hidden 하위에 포커스 가능한 요소가 남아 있으면 안 된다. */
    for (const hidden of canvasElement.querySelectorAll('[aria-hidden="true"]')) {
      const focusable = focusableInside(hidden);
      if (focusable.length > 0) {
        throw new Error(`aria-hidden must not contain a focusable element, but <${focusable[0].tagName.toLowerCase()}> is still reachable.`);
      }
    }

    /* 행 표시기는 순수 장식이므로 tree 안에 form control 자체가 없어야 한다. */
    if (tree.querySelector('input, button, select, textarea')) {
      throw new Error('A tree row must not mount a form control; the treeitem alone owns aria-checked.');
    }

    const tabbable = [...tree.querySelectorAll('[tabindex="0"], a[href], button, input, select, textarea')];
    if (tabbable.length !== 1 || tabbable[0].getAttribute('role') !== 'treeitem') {
      throw new Error(`The tree must keep exactly one roving Tab stop on a treeitem, but found ${tabbable.length} tabbable elements.`);
    }

    const leaf = tree.querySelector('[data-tree-picker-id="/scan"]');
    const branch = tree.querySelector('[data-tree-picker-id="sensors"]');
    const indicator = leaf?.querySelector('[data-tree-picker-check]');
    const branchIndicator = branch?.querySelector('[data-tree-picker-check]');
    if (!leaf || !branch || !indicator || !branchIndicator) throw new Error('The decoration fixture is incomplete.');
    if (indicator.getAttribute('aria-hidden') !== 'true') {
      throw new Error('The row check indicator must stay aria-hidden so the treeitem is the single selection semantic.');
    }
    if (leaf.getAttribute('aria-checked') !== 'true' || indicator.dataset.treePickerCheckState !== 'checked') {
      throw new Error('A selected leaf must expose aria-checked="true" and paint a checked indicator.');
    }
    if (branch.getAttribute('aria-checked') !== 'mixed' || branchIndicator.dataset.treePickerCheckState !== 'mixed') {
      throw new Error('A partially selected branch must expose aria-checked="mixed" and paint the mixed indicator.');
    }

    /* 표시기가 장식이 되어도 pointer로 선택을 토글하는 행 동작은 유지되어야 한다. */
    await userEvent.click(indicator);
    await waitFor(() => {
      if (leaf.getAttribute('aria-checked') !== 'false') {
        throw new Error('Clicking the decorative indicator must still toggle the treeitem selection.');
      }
    });
    /* 시각 스냅샷은 play 종료 상태를 캡처하므로 스토리의 이름난 상태로 복구한다. */
    await userEvent.click(indicator);
    await waitFor(() => {
      if (leaf.getAttribute('aria-checked') !== 'true') {
        throw new Error('The toggled row must be restored so the story finishes in its named state.');
      }
    });
    doc.activeElement?.blur();
  },
};

export const NarrowLongLabels = {
  name: '반응형 · 좁은 폭 · 긴 이름과 보조 정보',
  parameters: storyDescription(
    '좁은 폭에서 긴 namespace·설명·권한 메타데이터를 중첩해 보여줍니다. label이 제어와 겹치지 않고 깊이와 보조 정보가 줄바꿈 뒤에도 연결되는지 확인하세요.',
  ),
  args: {
    nodes: [
      {
        id: 'warehouse-telemetry',
        label: 'Autonomous warehouse robot telemetry namespace',
        description: '실시간 검증 환경에서 수집하는 매우 긴 계층 설명',
        children: [
          {
            id: 'safety-signals',
            label: 'safety-validation/command-and-interlock-signals',
            children: [
              { id: 'deadman', label: '/robot/control/deadman_switch/active', meta: 'permission restricted' },
            ],
          },
        ],
      },
    ],
    defaultExpandedIds: ['warehouse-telemetry', 'safety-signals'],
    label: '긴 토픽 범위 선택',
  },
  render: (args) => (
    <div style={{ width: 300, maxWidth: '100%' }}>
      <TreePicker {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const tree = canvasElement.querySelector('[role="tree"]');
    if (!tree || tree.scrollWidth > tree.clientWidth + 1) {
      throw new Error('TreePicker rows must not create horizontal overflow at 300px.');
    }
    const title = canvasElement.querySelector('[data-tree-picker-id="warehouse-telemetry"] [title]');
    if (!title?.getAttribute('title')?.includes('Autonomous warehouse')) {
      throw new Error('A truncated string label must preserve its full text in a native title.');
    }
  },
};
