import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
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
  play: async ({ canvasElement }) => {
    const box = canvasElement.querySelector('[role="log"]');
    if (!box) throw new Error('로그 스트림은 role="log" 영역이어야 합니다.');
    if (!box.getAttribute('aria-label')) throw new Error('로그 영역에는 접근 이름이 있어야 합니다.');
    if (box.getAttribute('tabindex') !== '0') {
      throw new Error('스크롤 가능한 로그 영역은 tabIndex=0이라야 키보드로 읽을 수 있습니다(WCAG 2.1.1).');
    }
    if (box.getAttribute('aria-live') !== 'off') {
      throw new Error('가상화 컨테이너 자체가 live region이면 스크롤할 때마다 행이 낭독됩니다 — live는 별도 status 영역이 소유합니다.');
    }
    const streamText = box.textContent || '';
    if (!streamText.includes('WARN') || !streamText.includes('ERROR')) {
      throw new Error('레벨은 색상 단독이 아니라 텍스트 라벨로도 구분되어야 합니다.');
    }
    box.focus();
    if (canvasElement.ownerDocument.activeElement !== box) {
      throw new Error('로그 영역이 키보드 포커스를 받아야 스크롤로 열람할 수 있습니다.');
    }
    box.blur();
  },
};

function StreamingLogViewer() {
  const [streamed, setStreamed] = React.useState(lines);
  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)', maxWidth: 720 }}>
      <button
        type="button"
        data-contract="append"
        onClick={() => setStreamed((current) => [
          ...current,
          { time: '10:42:20', level: 'info', source: 'nav', text: `새로 도착한 라인 ${current.length - lines.length + 1}` },
        ])}
      >
        로그 한 줄 도착
      </button>
      <LogViewer lines={streamed} height={160} />
    </div>
  );
}

export const LogViewerLiveRegionContract = {
  name: 'LogViewer 라이브 리전 계약',
  tags: ['!dev'],
  render: () => <StreamingLogViewer />,
  play: async ({ canvasElement }) => {
    const status = canvasElement.querySelector('[role="status"]');
    const append = canvasElement.querySelector('[data-contract="append"]');
    if (!status || !append) throw new Error('스트리밍 계약 픽스처가 필요합니다.');
    if (status.textContent.trim() !== '') {
      throw new Error('마운트 직후에는 공지할 새 로그가 없으므로 status 영역이 비어 있어야 합니다.');
    }

    // 팔로우 중 — 새로 도착한 줄만 공지한다.
    await userEvent.click(append);
    await waitFor(() => {
      if (!status.textContent.includes('새로 도착한 라인 1')) {
        throw new Error('tail을 따라가는 동안 도착한 새 로그는 polite status로 공지되어야 합니다.');
      }
    });

    // 일시정지(팔로우 해제) — 조용해야 하고, 밀린 양은 버튼 이름으로만 알린다.
    const pause = canvasElement.querySelector('button[aria-label="로그 tail 일시정지"]');
    if (!pause) throw new Error('tail 일시정지 도구가 필요합니다.');
    await userEvent.click(pause);
    const quiet = status.textContent;
    await userEvent.click(append);
    await waitFor(() => {
      const jump = canvasElement.querySelector('button[aria-label^="최신 로그로 이동"]');
      if (!jump || !jump.getAttribute('aria-label').includes('새 로그')) {
        throw new Error('정지 상태에서 밀린 로그 수는 "최신 로그로 이동" 버튼의 이름으로 전달되어야 합니다.');
      }
    });
    if (status.textContent !== quiet) {
      throw new Error('정지 상태에서는 새 로그를 공지하지 않아야 합니다(정지 시 조용, 팔로우 중일 때만 알림).');
    }

    // 이름난 상태로 복귀 — 다시 팔로우.
    const resume = canvasElement.querySelector('button[aria-label="로그 tail 재개"]');
    if (!resume) throw new Error('tail 재개 도구가 필요합니다.');
    await userEvent.click(resume);
    resume.blur();
  },
};
