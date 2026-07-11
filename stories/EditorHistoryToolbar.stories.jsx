import React from 'react';
import { HistoryToolbar } from '../src/index.js';
import { EditorStoryFrame } from './EditorShell.shared.jsx';

const meta = {
  title: 'LDS Robotics/Editor/History Toolbar',
  component: HistoryToolbar,
  parameters: {
    docs: {
      description: {
        component:
          'HistoryToolbar는 undo·redo 가능 상태와 실제 handler를 함께 검증하고, 문서 초기화를 별도 명령 그룹으로 구분합니다.',
      },
    },
  },
};

export default meta;

function HistoryFrame({ children }) {
  return (
    <EditorStoryFrame maxWidth={420} height="auto">
      <div
        style={{
          display: 'flex',
          padding: 16,
          border: '1px solid var(--color-semantic-line-normal-normal)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--color-semantic-background-elevated-normal)',
        }}
      >
        {children}
      </div>
    </EditorStoryFrame>
  );
}

export const AvailableHistory = {
  name: '실행 취소·다시 실행과 문서 초기화',
  render: () => (
    <HistoryFrame>
      <HistoryToolbar
        canUndo
        canRedo
        onUndo={() => {}}
        onRedo={() => {}}
        onReset={() => {}}
      />
    </HistoryFrame>
  ),
};

export const MissingHandlers = {
  name: '핸들러가 없으면 비활성',
  render: () => (
    <HistoryFrame>
      <HistoryToolbar canUndo canRedo />
    </HistoryFrame>
  ),
};

export const MediumDensity = {
  name: '40px 제어',
  render: () => (
    <HistoryFrame>
      <HistoryToolbar size="md" canUndo onUndo={() => {}} />
    </HistoryFrame>
  ),
};
