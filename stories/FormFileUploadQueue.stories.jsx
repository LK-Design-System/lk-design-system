import React from 'react';
import { userEvent } from 'storybook/test';
import { FileUpload, FileUploadQueue } from '../src/index.js';

const meta = {
  title: 'LDS Product/Selection and Input/File Upload Queue',
  component: FileUploadQueue,
  parameters: {
    docs: {
      description: {
        component: '파일 선택 이후 업로드, 변환, 검증, 부분 실패와 retry 상태를 파일별로 표시하는 queue 패턴입니다.',
      },
    },
  },
};

export default meta;

const items = [
  { id: '1', name: 'system-architecture.pdf', status: 'succeeded', sizeLabel: '4.8 MB' },
  { id: '2', name: 'operations-guide.docx', status: 'processing', progress: 72, message: 'Markdown으로 변환 중' },
  { id: '3', name: 'legacy-report.hwp', status: 'failed', message: '지원하지 않는 문서 형식' },
];

const narrowItems = [
  { id: 'narrow-complete', name: '현장_AMR_운영_절차서_최종_검토본_2026-07-11.pdf', status: 'succeeded', sizeLabel: '18.4 MB' },
  { id: 'narrow-progress', name: '다중_카메라_캘리브레이션_데이터_변환_진행중_원본.zip', status: 'processing', progress: 64, message: '좌표계와 메타데이터를 변환하는 중' },
  { id: 'narrow-error', name: '기존_시설_지도_좌표계_변환_실패_보고서_수정본.hwp', status: 'failed', message: '좌표계 메타데이터를 읽을 수 없습니다.' },
];

function UploadAndConversionExample() {
  const [queue, setQueue] = React.useState(items);
  const nextId = React.useRef(0);
  const update = (target, patch) => {
    setQueue((current) => current.map((item) => item.id === target.id ? { ...item, ...patch } : item));
  };

  return (
    <main style={{ display: 'grid', gap: 'var(--space-4)', width: '100%', maxWidth: 720 }}>
      <FileUpload
        multiple
        accept=".pdf,.doc,.docx,.hwp"
        hint="문서를 끌어다 놓거나 선택하세요"
        onFiles={(files) => {
          setQueue((current) => [
            ...current,
            ...files.map((file) => ({
              id: `${file.name}-${file.lastModified}-${nextId.current++}`,
              name: file.name,
              status: 'queued',
              sizeLabel: `${Math.max(1, Math.round(file.size / 1024))} KB`,
            })),
          ]);
        }}
        onRejectedFiles={(files) => {
          setQueue((current) => [
            ...current,
            ...files.map((file) => ({
              id: `rejected-${file.name}-${file.lastModified}-${nextId.current++}`,
              name: file.name,
              status: 'failed',
              message: '허용되지 않는 파일 형식 또는 개수입니다.',
            })),
          ]);
        }}
      />
      <FileUploadQueue
        items={queue}
        onRetry={(item) => update(item, { status: 'processing', progress: undefined, message: '다시 처리 중' })}
        onCancel={(item) => update(item, { status: 'queued', progress: undefined, message: '처리가 취소되었습니다.' })}
        onRemove={(item) => setQueue((current) => current.filter((entry) => entry.id !== item.id))}
        onOpen={(item) => update(item, { message: '열기 요청됨' })}
      />
    </main>
  );
}

export const UploadAndConversion = {
  name: '업로드와 변환',
  render: () => <UploadAndConversionExample />,
  play: async ({ canvasElement }) => {
    const queue = canvasElement.querySelector('.lk-file-upload-queue');
    if (!queue) throw new Error('FileUploadQueue root is missing.');

    const header = queue.querySelector('header');
    if (!header || !header.textContent?.includes('파일 처리')) {
      throw new Error('FileUploadQueue header must keep its queue title.');
    }

    const summary = header.querySelector('[role="status"]');
    if (summary?.getAttribute('aria-label') !== '진행 1개, 완료 1개, 실패 1개') {
      throw new Error('FileUploadQueue header must expose the current state summary.');
    }
    const stateBadges = Array.from(summary.querySelectorAll('span'))
      .map((badge) => badge.textContent?.trim())
      .filter((label) => label === '진행 1' || label === '완료 1' || label === '실패 1');
    if (stateBadges.length !== 3) {
      throw new Error('FileUploadQueue header must render one badge for every present queue state.');
    }

    const fileNames = Array.from(queue.querySelectorAll('.lk-file-upload-queue__item strong'))
      .map((name) => name.textContent?.trim());
    for (const expectedName of ['system-architecture.pdf', 'operations-guide.docx', 'legacy-report.hwp']) {
      if (!fileNames.includes(expectedName)) {
        throw new Error(`FileUploadQueue must keep the file name visible: ${expectedName}`);
      }
    }

    const progress = queue.querySelector('[role="progressbar"][aria-label="operations-guide.docx 처리 중"]');
    if (progress?.getAttribute('aria-valuenow') !== '72') {
      throw new Error('FileUploadQueue must expose determinate per-file progress.');
    }

    const actionNames = Array.from(queue.querySelectorAll('button'))
      .map((button) => button.getAttribute('aria-label'));
    for (const expectedAction of [
      'system-architecture.pdf 열기',
      'system-architecture.pdf 목록에서 제거',
      'operations-guide.docx 처리 취소',
      'legacy-report.hwp 다시 시도',
      'legacy-report.hwp 제거',
    ]) {
      if (!actionNames.includes(expectedAction)) {
        throw new Error(`FileUploadQueue actions must include the file name: ${expectedAction}`);
      }
    }

    const surfaces = [queue, ...queue.querySelectorAll('.lk-file-upload-queue__item')];
    const overflowing = surfaces.find((surface) => surface.scrollWidth > surface.clientWidth + 1);
    if (overflowing) {
      throw new Error('FileUploadQueue must not introduce horizontal overflow.');
    }
  },
};

export const KeyboardFileSelection = {
  name: '키보드 파일 선택',
  render: () => <FileUpload hint="문서를 선택하세요" />,
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input[type="file"]');
    if (!input) throw new Error('FileUpload must preserve a native file input.');
    if (getComputedStyle(input).display === 'none') throw new Error('The native file input must remain in the accessibility tree.');
    await userEvent.tab();
    if (canvasElement.ownerDocument.activeElement !== input) throw new Error('The native file input must be keyboard focusable.');
  },
};

export const QueueStates = {
  name: '대기 · 업로드 · 빈 상태',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))' }}>
      <FileUploadQueue
        items={[
          { id: 'queued', name: 'queued-map.pgm', status: 'queued' },
          { id: 'uploading', name: 'point-cloud.pcd', status: 'uploading', progress: 38 },
        ]}
        onCancel={() => {}}
        onRemove={() => {}}
      />
      <FileUploadQueue title="완료된 큐" items={[]} emptyLabel="처리 중인 파일이 없습니다." />
    </main>
  ),
};

export const NarrowQueue = {
  name: '좁은 폭 · 진행과 동작',
  render: () => (
    <div style={{ width: 320, maxWidth: '100%' }}>
      <FileUploadQueue
        items={narrowItems}
        onRetry={() => {}}
        onCancel={() => {}}
        onRemove={() => {}}
        onOpen={() => {}}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const queue = canvasElement.querySelector('.lk-file-upload-queue');
    const rows = queue ? Array.from(queue.querySelectorAll('.lk-file-upload-queue__item')) : [];
    if (!queue || rows.length !== narrowItems.length) {
      throw new Error('The narrow queue must preserve every file row.');
    }
    if ([queue, ...rows].some((surface) => surface.scrollWidth > surface.clientWidth + 1)) {
      throw new Error('FileUploadQueue must not create horizontal overflow at 320px.');
    }
    const renderedNames = Array.from(queue.querySelectorAll('.lk-file-upload-queue__item strong'));
    for (const item of narrowItems) {
      if (!renderedNames.some((name) => name.textContent?.trim() === item.name)) {
        throw new Error(`The narrow queue must keep the full file name in the DOM: ${item.name}`);
      }
    }
    if (!renderedNames.some((name) => name.scrollWidth > name.clientWidth + 1)) {
      throw new Error('At least one long file name must exercise the ellipsis contract at 320px.');
    }

    const progressName = narrowItems[1].name;
    const progress = queue.querySelector(`[role="progressbar"][aria-label="${progressName} 처리 중"]`);
    if (progress?.getAttribute('aria-valuenow') !== '64') {
      throw new Error('The narrow queue must keep determinate per-file progress visible.');
    }
    if (!queue.textContent?.includes('좌표계 메타데이터를 읽을 수 없습니다.')) {
      throw new Error('The narrow queue must keep the file-level error message visible.');
    }

    const expectedActions = [
      `${narrowItems[0].name} 열기`,
      `${narrowItems[0].name} 목록에서 제거`,
      `${narrowItems[1].name} 처리 취소`,
      `${narrowItems[2].name} 다시 시도`,
      `${narrowItems[2].name} 제거`,
    ];
    const actions = Array.from(queue.querySelectorAll('button'));
    for (const actionName of expectedActions) {
      if (!actions.some((action) => action.getAttribute('aria-label') === actionName)) {
        throw new Error(`The narrow queue must preserve its row action: ${actionName}`);
      }
    }
    for (const action of actions) {
      const target = action.getBoundingClientRect();
      if (target.width < 32 || target.height < 32) {
        throw new Error('Narrow queue actions must preserve at least a 32px target.');
      }
    }
    const actionGroups = Array.from(queue.querySelectorAll('.lk-file-upload-queue__actions'));
    if (actionGroups.length !== narrowItems.length || actionGroups.some((group) => getComputedStyle(group).gridColumnStart !== '2')) {
      throw new Error('Narrow queue actions must wrap below row content in the second grid column.');
    }
  },
};
