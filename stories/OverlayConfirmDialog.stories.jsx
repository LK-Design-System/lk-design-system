import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import {
  Button,
  ConfirmDialog,
  Modal,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Overlay/Confirm Dialog',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-overlay-confirm-dialog--confirmation-states',
      eyebrow: 'Core / Overlay',
      title: 'Confirm Dialog는 되돌리기 어렵거나 중요한 동작을 실행 전에 확인합니다',
      description:
        '삭제·초기화·권한 해제처럼 결과가 크고 사용자의 명시적 동의가 필요한 단일 결정에 적합합니다. 설명·입력·여러 단계가 필요한 작업에는 Modal을, 위험도가 낮고 되돌릴 수 있는 동작에는 즉시 실행 후 Toast로 결과를 알리는 방식을 고려하세요.',
    },
    docs: {
      description: {
        component: '삭제, 초기화, 게시처럼 명시적 확인이 필요한 액션을 위한 ConfirmDialog입니다.',
      },
    },
  },
};

export default meta;

export const ConfirmationStates = {
  name: '개요',
  parameters: storyDescription(
    '저장되지 않은 변경을 초기화하기 전 위험을 설명하는 danger Confirm Dialog입니다. 제목과 영향 설명이 구체적인지, 취소가 안전한 기본 경로로 보이고 확인 레이블이 실제 동작을 명확히 말하는지 확인하세요.',
  ),
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 720 }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <Button onClick={() => setOpen(true)}>다이얼로그 열기</Button>
          <Button variant="ghost">보조 액션</Button>
        </div>
        <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.6 }}>
          파괴적 작업은 범용 모달이 아니라 명확한 취소/확인 라벨을 가진 ConfirmDialog로 확인합니다.
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
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      const dialog = canvasElement.ownerDocument.querySelector('[role="dialog"][data-tone="danger"]');
      const titleId = dialog?.getAttribute('aria-labelledby');
      const title = titleId && canvasElement.ownerDocument.getElementById(titleId);
      const content = dialog?.firstElementChild;
      if (!dialog || !title || content?.firstElementChild !== title) {
        throw new Error('ConfirmDialog must lead with its title instead of a redundant severity badge.');
      }
    });
  },
};

function OverlayStackFixture() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const closeModal = () => {
    setConfirmOpen(false);
    setModalOpen(false);
  };

  return (
    <main style={{ minHeight: 220 }}>
      <Button data-testid="confirm-stack-base-trigger" onClick={() => setModalOpen(true)}>
        환경 설정 열기
      </Button>
      <Modal
        open={modalOpen}
        title="원격 제어 환경 설정"
        onClose={closeModal}
        footer={<Button variant="outlined" color="assistive" onClick={closeModal}>닫기</Button>}
      >
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <p style={{ margin: 0 }}>변경을 저장하기 전에 영향 범위를 확인합니다.</p>
          <Button
            data-testid="confirm-stack-inner-trigger"
            variant="danger"
            onClick={() => setConfirmOpen(true)}
          >
            원격 제어 해제
          </Button>
        </div>
      </Modal>
      <ConfirmDialog
        open={confirmOpen}
        tone="danger"
        title="원격 제어를 해제할까요?"
        confirmLabel="해제"
        onConfirm={() => setConfirmOpen(false)}
        onCancel={() => setConfirmOpen(false)}
      >
        진행 중인 수동 제어 세션이 종료되며, 다시 권한을 받아야 합니다.
      </ConfirmDialog>
    </main>
  );
}

export const OverlayStackContract = {
  name: '중첩 overlay 초점·Escape 순서',
  tags: ['!dev'],
  render: () => <OverlayStackFixture />,
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    const baseTrigger = canvasElement.querySelector('[data-testid="confirm-stack-base-trigger"]');
    if (!baseTrigger) throw new Error('The ConfirmDialog stack fixture requires a base trigger.');

    await userEvent.click(baseTrigger);
    const innerTrigger = await waitFor(() => {
      const trigger = ownerDocument.querySelector('[data-testid="confirm-stack-inner-trigger"]');
      if (!trigger) throw new Error('The base Modal must expose the ConfirmDialog trigger.');
      return trigger;
    });
    await userEvent.click(innerTrigger);

    await waitFor(() => {
      const dialogs = ownerDocument.querySelectorAll('[role="dialog"]');
      const cancel = dialogs[1]?.querySelector('[data-confirm-dialog-cancel]');
      if (dialogs.length !== 2 || !cancel || ownerDocument.activeElement !== cancel) {
        throw new Error('The topmost ConfirmDialog must move focus to its cancel action.');
      }
    });

    let dialogs = ownerDocument.querySelectorAll('[role="dialog"]');
    const modalPortal = dialogs[0]?.closest('[data-lds-overlay-portal]');
    const confirmPortal = dialogs[1]?.closest('[data-lds-overlay-portal]');
    if (!modalPortal?.hasAttribute('inert') || !confirmPortal || confirmPortal.hasAttribute('inert')) {
      throw new Error('ConfirmDialog must share the modal Portal stack and inert the lower layer.');
    }
    const parentLayer = Number.parseInt(ownerDocument.defaultView.getComputedStyle(dialogs[0].parentElement).zIndex, 10);
    const confirmLayer = Number.parseInt(ownerDocument.defaultView.getComputedStyle(dialogs[1].parentElement).zIndex, 10);
    if (!(confirmLayer > parentLayer)) throw new Error('ConfirmDialog must render above the existing overlay layer.');

    const cancelAction = dialogs[1].querySelector('[data-confirm-dialog-cancel]');
    const confirmAction = dialogs[1].querySelectorAll('button').item(dialogs[1].querySelectorAll('button').length - 1);
    confirmAction.focus();
    await userEvent.tab();
    if (ownerDocument.activeElement !== cancelAction) throw new Error('Tab must wrap inside the topmost ConfirmDialog.');
    cancelAction.focus();
    await userEvent.tab({ shift: true });
    if (ownerDocument.activeElement !== confirmAction) throw new Error('Shift+Tab must wrap inside the topmost ConfirmDialog.');

    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      const remaining = ownerDocument.querySelectorAll('[role="dialog"]');
      if (remaining.length !== 1 || ownerDocument.activeElement !== innerTrigger) {
        throw new Error('Escape must close only ConfirmDialog and restore its Modal trigger.');
      }
    });

    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (ownerDocument.querySelector('[role="dialog"]') || ownerDocument.activeElement !== baseTrigger) {
        throw new Error('The next Escape must close the base Modal and restore the page trigger.');
      }
    });

    await userEvent.click(baseTrigger);
    const reopenedInnerTrigger = await waitFor(() => {
      const trigger = ownerDocument.querySelector('[data-testid="confirm-stack-inner-trigger"]');
      if (!trigger) throw new Error('The reopened Modal must expose the ConfirmDialog trigger.');
      return trigger;
    });
    await userEvent.click(reopenedInnerTrigger);
    await waitFor(() => {
      dialogs = ownerDocument.querySelectorAll('[role="dialog"]');
      if (dialogs.length !== 2 || !dialogs[1].contains(ownerDocument.activeElement)) {
        throw new Error('The representative ConfirmDialog must remain the active visual layer.');
      }
    });
  },
};
