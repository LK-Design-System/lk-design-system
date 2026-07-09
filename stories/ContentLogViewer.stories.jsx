import { LogViewer } from '../src/index.js';

const meta = {
  title: 'LDS Core/Components/Content/Log Viewer',
  parameters: {
    docs: {
      description: {
        component: '레벨 색상 로그 라인을 필터·자동 스크롤과 함께 보여주는 LogViewer 패턴입니다. 정적 코드 블록의 스트리밍 보완재입니다.',
      },
    },
  },
};

export default meta;

const lines = [
  { time: '10:42:01', level: 'info', source: 'bringup', text: 'rosbridge websocket 연결됨 (:9090)' },
  { time: '10:42:02', level: 'debug', source: 'tf', text: 'map -> odom broadcast 20Hz' },
  { time: '10:42:04', level: 'info', source: 'nav', text: '목표 수신: (12.4, 3.1)' },
  { time: '10:42:06', level: 'warn', source: 'nav', text: 'costmap 갱신 지연 (180ms)' },
  { time: '10:42:09', level: 'error', source: 'lidar', text: '/scan 타임아웃 — 재연결 시도' },
  { time: '10:42:10', level: 'info', source: 'lidar', text: '/scan 복구됨' },
  { time: '10:42:12', level: 'debug', source: 'ctrl', text: 'cmd_vel v=0.42 w=0.10' },
];

export const LogViewers = {
  name: '로그 뷰어',
  render: () => (
    <main style={{ maxWidth: 720 }}>
      <LogViewer lines={lines} />
    </main>
  ),
};
