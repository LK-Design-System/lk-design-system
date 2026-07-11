import React from 'react';
import { userEvent } from 'storybook/test';
import { FileUpload, FileUploadQueue } from '../src/index.js';

const meta = {
  title: 'LDS Product/Selection and Input/File Upload Queue',
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
  name: '대기, 업로드, 빈 상태',
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
      <FileUploadQueue items={[]} emptyLabel="처리 중인 파일이 없습니다." />
    </main>
  ),
};
