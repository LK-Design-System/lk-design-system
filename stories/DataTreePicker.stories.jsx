import React from 'react';
import { userEvent } from 'storybook/test';
import { TreePicker } from '../src/index.js';

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
  title: 'LDS Product/Data/Tree Picker',
  component: TreePicker,
  decorators: [(Story) => <div style={{ width: '100%', maxWidth: 720 }}><Story /></div>],
  parameters: {
    docs: {
      description: {
        component: '계층 검색과 분리된 다중 선택 입력입니다. 하나의 순환 초점 지점, 방향키 탐색, 문자 입력 탐색, 선택·부분 선택 상태를 제공합니다.',
      },
    },
  },
};

export const DescendantScope = {
  name: '하위 범위 선택',
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
  name: '항목 독립 선택',
  args: {
    nodes: nodes.map((node) => ({ ...node, selectable: true })),
    selectionBehavior: 'independent',
    defaultSelectedIds: ['sensors', '/odom'],
    defaultExpandedIds: ['sensors', 'navigation'],
    label: '독립적인 토픽 항목 선택',
  },
};

export const Search = {
  name: '검색으로 범위 축소',
  args: {
    nodes,
    defaultQuery: 'camera',
    defaultSelectedIds: ['/camera/depth'],
    label: '검색된 토픽 선택',
  },
};

export const ResourceStates = {
  name: '빈 상태 · 결과 없음 · 전체 비활성',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))' }}>
      <TreePicker nodes={[]} emptyMessage="사용 가능한 범위가 없습니다." />
      <TreePicker nodes={nodes} defaultQuery="map" noResultsMessage="일치하는 토픽이 없습니다." />
      <TreePicker nodes={nodes} disabled defaultExpandedIds={['sensors']} label="비활성 토픽 선택" />
    </main>
  ),
};

export const DisabledFirstNode = {
  name: '첫 항목 비활성 · 초점 이동 · 문자 입력 탐색',
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
  name: '비활성 하위 항목을 제외한 상위 집계',
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

export const NarrowLongLabels = {
  name: '좁은 폭 · 긴 이름과 보조 정보',
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
