import React from 'react';
import { Button, CanvasEditorCommandBar } from '../src/index.js';
import { EditorStoryFrame } from './EditorShell.shared.jsx';

const meta = {
  title: 'LDS Robotics/Editor/Command Bar',
  component: CanvasEditorCommandBar,
  parameters: {
    docs: {
      description: {
        component:
          'CanvasEditorCommandBar는 문서 수준의 히스토리와 저장·내보내기 명령을 그룹화합니다. 줌·fit·카메라 명령은 뷰포트 로컬 툴바에 둡니다.',
      },
    },
  },
};

export default meta;

function CommandBarFrame({ children }) {
  return (
    <EditorStoryFrame maxWidth={760} height="auto">
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
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

const documentActions = [
  {
    value: 'export',
    label: '문서 내보내기',
    icon: 'download',
    onClick: () => {},
  },
];

export const DocumentCommands = {
  name: '문서 명령',
  render: () => (
    <CommandBarFrame>
      <CanvasEditorCommandBar
        documentActions={documentActions}
        canUndo
        canRedo={false}
        onUndo={() => {}}
        onRedo={() => {}}
        onReset={() => {}}
      >
        <Button size="sm" onClick={() => {}}>저장</Button>
      </CanvasEditorCommandBar>
    </CommandBarFrame>
  ),
};

export const HandlerGating = {
  name: '상태와 핸들러 동시 검증',
  render: () => (
    <CommandBarFrame>
      <CanvasEditorCommandBar
        canUndo
        canRedo
        documentActions={[
          { value: 'export', label: '내보내기 권한 없음', icon: 'download', disabled: true },
        ]}
      />
    </CommandBarFrame>
  ),
};

export const MediumDensity = {
  name: '40px 문서 제어',
  render: () => (
    <CommandBarFrame>
      <CanvasEditorCommandBar
        size="md"
        canUndo
        onUndo={() => {}}
        documentActions={documentActions}
      >
        <Button size="md" onClick={() => {}}>저장</Button>
      </CanvasEditorCommandBar>
    </CommandBarFrame>
  ),
};
