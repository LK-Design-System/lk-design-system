import React from 'react';
import {
  Button,
  ConfirmDialog,
} from '../src/index.js';

const meta = {
  title: 'WDS Core/3 Component/7 Feedback/Confirm Dialog',
  parameters: {
    docs: {
      description: {
        component: '삭제, reset, 게시처럼 명시적 확인이 필요한 액션을 위한 ConfirmDialog입니다.',
      },
    },
  },
};

export default meta;

export const ConfirmationStates = {
  name: '확인 상태',
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 720 }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <Button onClick={() => setOpen(true)}>다이얼로그 열기</Button>
          <Button variant="ghost">보조 액션</Button>
        </div>
        <p style={{ margin: 0, color: 'var(--label-neutral)', lineHeight: 1.6 }}>
          파괴적 작업은 generic modal이 아니라 명확한 취소/확인 라벨을 가진 ConfirmDialog로 확인합니다.
        </p>
        <ConfirmDialog
          open={open}
          tone="danger"
          title="변경 사항을 초기화할까요?"
          confirmLabel="초기화"
          cancelLabel="취소"
          onConfirm={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        >
          저장되지 않은 변경 사항이 사라집니다. 이 작업은 실행 후 되돌릴 수 없습니다.
        </ConfirmDialog>
      </main>
    );
  },
};
