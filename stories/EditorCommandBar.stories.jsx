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

function CommandBarFrame({ children, maxWidth = 760 }) {
  return (
    <EditorStoryFrame maxWidth={maxWidth} height="auto">
      <div
        data-testid="command-bar-frame"
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

export const NarrowCommandTargets = {
  name: '좁은 폭 · 긴 문서 작업',
  render: () => (
    <CommandBarFrame maxWidth={360}>
      <CanvasEditorCommandBar
        data-testid="narrow-command-bar"
        documentLabel="문서 내보내기 작업"
        extraLabel="검토 완료 작업"
        documentActions={[
          {
            value: 'archive-export',
            label: '장기 보관 형식으로 문서 내보내기',
            icon: 'download',
            onClick: () => {},
          },
        ]}
        canUndo
        canRedo
        onUndo={() => {}}
        onRedo={() => {}}
        onReset={() => {}}
        style={{
          width: '100%',
          maxWidth: '100%',
          flexShrink: 1,
          justifyContent: 'flex-end',
        }}
      >
        <Button
          size="sm"
          onClick={() => {}}
          style={{ width: 128, minHeight: 32, height: 'auto', paddingBlock: 'var(--space-1)', whiteSpace: 'normal', textAlign: 'center' }}
        >
          검토 완료본 저장 후 승인 요청
        </Button>
      </CanvasEditorCommandBar>
    </CommandBarFrame>
  ),
  play: async ({ canvasElement }) => {
    const frame = canvasElement.querySelector('[data-testid="command-bar-frame"]');
    const commandBar = canvasElement.querySelector('[data-testid="narrow-command-bar"]');
    const documentToolbar = canvasElement.querySelector('[role="toolbar"][aria-label="문서 내보내기 작업"]');
    const customGroup = canvasElement.querySelector('[role="group"][aria-label="검토 완료 작업"]');
    const documentAction = canvasElement.querySelector('button[aria-label="장기 보관 형식으로 문서 내보내기"]');
    const customAction = Array.from(customGroup?.querySelectorAll('button') ?? [])
      .find((button) => button.textContent?.trim() === '검토 완료본 저장 후 승인 요청');

    if (!frame || !commandBar || !documentToolbar || !customGroup || !documentAction || !customAction) {
      throw new Error('The narrow command bar must preserve its document and custom action groups.');
    }
    if (Math.round(frame.getBoundingClientRect().width) !== 360) {
      throw new Error('The narrow command bar fixture must render at the 360px target width.');
    }
    if (commandBar.scrollWidth > commandBar.clientWidth + 1 || frame.scrollWidth > frame.clientWidth + 1) {
      throw new Error('The wrapped command bar must not introduce horizontal overflow.');
    }
    if (customAction.getBoundingClientRect().height <= 32 || customAction.scrollWidth > customAction.clientWidth + 1) {
      throw new Error('The long custom action must wrap inside its target without clipping at 360px.');
    }
    for (const action of [documentAction, customAction]) {
      const target = action.getBoundingClientRect();
      if (target.width < 32 || target.height < 32) {
        throw new Error('Document and custom actions must preserve at least a 32px target.');
      }
    }
  },
};
