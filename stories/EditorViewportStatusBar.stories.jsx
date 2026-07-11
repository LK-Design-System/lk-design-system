import React from 'react';
import { ViewportStatusBar } from '../src/index.js';
import { EditorStoryFrame } from './EditorShell.shared.jsx';

const meta = {
  title: 'LDS Robotics/Editor/Viewport Status Bar',
  component: ViewportStatusBar,
  parameters: {
    docs: {
      description: {
        component:
          'ViewportStatusBar는 좌표·줌·선택 수·렌더링 상태처럼 수동적인 로컬 정보를 우선순위가 있는 한 줄로 표시하고, 짧은 결과 메시지만 별도 live status로 알립니다.',
      },
    },
  },
};

export default meta;

function StatusFrame({ children, width = 860 }) {
  return (
    <EditorStoryFrame maxWidth={width} height="auto">
      <div
        style={{
          width: '100%',
          padding: '9px 14px',
          border: '1px solid var(--color-semantic-line-normal-normal)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-semantic-background-normal-alternative)',
        }}
      >
        {children}
      </div>
    </EditorStoryFrame>
  );
}

const baseItems = [
  { key: 'mode', label: '모드', value: '선택', priority: 'high' },
  { key: 'selected', label: '선택', value: 2, priority: 'high' },
  { key: 'cursor', label: '커서', value: '12.4, -3.1', mono: true },
  { key: 'zoom', label: '줌', value: 125, unit: '%' },
];

export const Readouts = {
  name: '지속 뷰포트 상태',
  render: () => (
    <StatusFrame>
      <ViewportStatusBar items={baseItems} />
    </StatusFrame>
  ),
};

export const PriorityCompression = {
  name: '좁은 폭 우선순위',
  render: () => (
    <StatusFrame width={390}>
      <ViewportStatusBar
        items={[
          { key: 'fps', label: 'FPS', value: 60, priority: 'low' },
          { key: 'cursor', label: '커서', value: '12.4, -3.1', mono: true },
          { key: 'selection', label: '선택', value: 2, priority: 'high' },
          { key: 'mode', label: '모드', value: '선택', priority: 'high' },
        ]}
      />
    </StatusFrame>
  ),
};

export const StatusTones = {
  name: '의미가 보이는 상태 톤',
  render: () => (
    <StatusFrame>
      <ViewportStatusBar
        items={[
          { key: 'selection', label: '선택', value: 1, tone: 'signal', priority: 'high' },
          { key: 'snap', label: '스냅', value: '켜짐', tone: 'positive' },
          { key: 'fps', label: 'FPS', value: 18, tone: 'warning', toneLabel: '프레임 저하' },
          { key: 'source', label: '센서', value: '만료', tone: 'danger', toneLabel: '데이터 지연' },
        ]}
      />
    </StatusFrame>
  ),
};

export const TransientMessage = {
  name: '일시적 로컬 결과',
  render: () => (
    <StatusFrame>
      <ViewportStatusBar
        message="선택 영역을 계산했습니다."
        messageTone="positive"
        messageToneLabel="완료"
        items={baseItems}
      />
    </StatusFrame>
  ),
};
