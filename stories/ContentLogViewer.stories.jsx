import { LogViewer } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Content/Log Viewer',
  parameters: {
    storyGuide: {
      storyId: 'lds-product-content-log-viewer--log-viewers',
      eyebrow: 'Product / Log Viewer',
      title: '사용자가 시간순 로그에서 경고와 오류의 원인을 빠르게 찾습니다',
      description:
        '실시간 또는 최근 운영 로그를 시간·레벨·출처와 함께 추적할 때 적합합니다. 장기 분석이나 열별 정렬·집계가 필요한 데이터에는 LogViewer 대신 Data Grid 또는 내보내기 도구를 사용하세요.',
    },
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
  name: '개요',
  parameters: storyDescription(
    '연결부터 오류와 복구까지 이어지는 운영 로그를 한 스트림에서 확인하는 상황입니다. 시간·레벨·출처가 빠르게 구분되고 WARN·ERROR를 색에만 의존하지 않고 찾을 수 있는지 확인하세요.',
  ),
  render: () => (
    <main style={{ maxWidth: 720 }}>
      <LogViewer lines={lines} />
    </main>
  ),
};
