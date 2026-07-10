import { TreeSelectionPanel } from '../src/index.js';

const meta = {
  title: 'LDS Product/Data/Tree Selection Panel',
  parameters: {
    docs: {
      description: {
        component:
          '검색과 체크박스로 계층에서 여러 항목을 고르는 TreeSelectionPanel 패턴입니다. 토픽·TF 구독, 레이어 선택, 권한 범위 선택에 씁니다.',
      },
    },
  },
};

export default meta;

const nodes = [
  {
    id: 'sensors',
    label: 'sensors',
    description: '센서 입력 토픽',
    children: [
      { id: '/scan', label: '/scan', meta: '10 Hz' },
      { id: '/imu', label: '/imu', meta: '50 Hz' },
      {
        id: '/camera',
        label: 'camera',
        description: 'RGB-D 스트림',
        children: [
          { id: '/camera/rgb', label: '/camera/rgb', meta: '30 Hz' },
          { id: '/camera/depth', label: '/camera/depth', meta: '30 Hz' },
        ],
      },
    ],
  },
  {
    id: 'nav',
    label: 'navigation',
    description: '주행 상태와 명령',
    children: [
      { id: '/odom', label: '/odom', meta: '20 Hz' },
      { id: '/cmd_vel', label: '/cmd_vel', meta: 'pub', disabled: true },
      { id: '/plan', label: '/plan', meta: 'path' },
    ],
  },
  {
    id: 'diagnostics',
    label: 'diagnostics',
    description: '상태 점검',
    children: [
      { id: '/diagnostics', label: '/diagnostics', meta: '1 Hz' },
      { id: '/rosout', label: '/rosout', meta: 'log' },
    ],
  },
];

export const TreeSelectionPanels = {
  name: '트리 선택',
  render: () => (
    <TreeSelectionPanel
      nodes={nodes}
      defaultExpanded={['sensors', 'nav']}
      defaultChecked={['/scan', '/odom']}
    />
  ),
};

export const BranchCascade = {
  name: '상위 항목 선택',
  render: () => (
    <TreeSelectionPanel
      nodes={nodes}
      defaultExpanded={['sensors', '/camera']}
      defaultChecked={['/camera/rgb']}
      label="토픽 범위 선택"
    />
  ),
};

export const LeafOnly = {
  name: '리프만 선택',
  render: () => (
    <TreeSelectionPanel
      nodes={nodes}
      cascade={false}
      defaultExpanded={['sensors', 'nav']}
      defaultChecked={['/scan', '/odom']}
      label="토픽 구독 선택"
    />
  ),
};

export const Filtered = {
  name: '검색 결과',
  render: () => (
    <TreeSelectionPanel
      nodes={nodes}
      defaultQuery="camera"
      defaultChecked={['/camera/depth']}
      label="검색된 토픽 선택"
    />
  ),
};

export const NoResults = {
  name: '검색 결과 없음',
  render: () => (
    <TreeSelectionPanel
      nodes={nodes}
      defaultQuery="map"
      noResultsLabel="일치하는 토픽이 없습니다"
    />
  ),
};

export const Empty = {
  name: '빈 트리',
  render: () => <TreeSelectionPanel nodes={[]} emptyLabel="표시할 항목이 없습니다" />,
};
