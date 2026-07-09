import { TreeSelect } from '../src/index.js';

const meta = {
  title: 'LDS Product/Data/Tree Select',
  parameters: {
    docs: {
      description: {
        component: '검색과 체크박스로 계층에서 여러 항목을 고르는 TreeSelect 패턴입니다. 토픽·TF 구독 선택 등에 씁니다.',
      },
    },
  },
};

export default meta;

const nodes = [
  { id: 'sensors', label: 'sensors', children: [
    { id: '/scan', label: '/scan' },
    { id: '/imu', label: '/imu' },
    { id: '/camera', label: 'camera', children: [
      { id: '/camera/rgb', label: '/camera/rgb' },
      { id: '/camera/depth', label: '/camera/depth' },
    ] },
  ] },
  { id: 'nav', label: 'navigation', children: [
    { id: '/odom', label: '/odom' },
    { id: '/cmd_vel', label: '/cmd_vel' },
    { id: '/plan', label: '/plan' },
  ] },
];

export const TreeSelects = {
  name: '트리 선택',
  render: () => <TreeSelect nodes={nodes} defaultChecked={['/scan', '/odom']} />,
};
