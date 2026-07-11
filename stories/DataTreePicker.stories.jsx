import React from 'react';
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
  parameters: {
    docs: {
      description: {
        component: '조회용 계층 탐색과 분리된 다중 선택 입력입니다. 선택, 확장, 검색 상태를 제품이 제어할 수 있습니다.',
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
  name: '빈 상태와 검색 결과 없음',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))' }}>
      <TreePicker nodes={[]} emptyMessage="사용 가능한 범위가 없습니다." />
      <TreePicker nodes={nodes} defaultQuery="map" noResultsMessage="일치하는 토픽이 없습니다." />
    </main>
  ),
};

export const DisabledFirstNode = {
  name: '첫 노드 비활성·focus 유지',
  args: {
    nodes: [
      { id: 'restricted', label: '권한 없는 범위', disabled: true },
      ...nodes,
    ],
    defaultExpandedIds: ['sensors'],
    label: '비활성 범위를 건너뛰는 선택',
  },
};
