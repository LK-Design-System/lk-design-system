import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Button, Modal } from '../src/index.js';
import {
  ModalCard as ModalCardStory,
  ModalOpen as ModalOpenStory,
} from './Overlay.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const fieldStyle = {
  width: '100%',
  boxSizing: 'border-box',
  height: 'var(--component-input-height)',
  padding: '0 var(--component-input-padding-x)',
  border: 'var(--component-input-border-width) solid var(--component-input-border-color)',
  borderRadius: 'var(--component-input-radius)',
  background: 'var(--component-input-bg)',
  color: 'var(--component-input-text-color)',
  font: 'inherit',
};

function OpenModalExample() {
  const [open, setOpen] = React.useState(true);
  return (
    <main style={{ minHeight: 180 }}>
      <Button onClick={() => setOpen(true)}>항목 상세 열기</Button>
      <Modal
        open={open}
        title="항목 상세"
        onClose={() => setOpen(false)}
        footer={<Button size="sm" onClick={() => setOpen(false)}>확인</Button>}
      >
        모달은 헤더, 본문, 푸터를 분리해 비교적 긴 정보를 담습니다.
      </Modal>
    </main>
  );
}

function ModalFocusFixture() {
  const [open, setOpen] = React.useState(false);
  const [nestedOpen, setNestedOpen] = React.useState(false);
  const firstFieldRef = React.useRef(null);

  const closeMain = () => {
    setNestedOpen(false);
    setOpen(false);
  };

  return (
    <main data-testid="modal-focus-fixture" style={{ minHeight: 220, display: 'grid', alignContent: 'start', gap: 'var(--space-4)', maxWidth: 760 }}>
      <Button data-testid="modal-trigger" onClick={() => setOpen(true)}>환경 설정 열기</Button>
      <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.6 }}>
        열린 표면 안에서 초점이 순환하고, 닫힌 뒤 실제 호출 버튼으로 돌아갑니다.
      </p>
      <Modal
        open={open}
        title="현장 알림과 장치 상태 표시 설정"
        initialFocusRef={firstFieldRef}
        onClose={closeMain}
        footer={(
          <>
            <Button variant="outlined" color="assistive" onClick={closeMain}>취소</Button>
            <Button data-testid="modal-save" onClick={closeMain}>저장</Button>
          </>
        )}
      >
        <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
          <label style={{ display: 'grid', gap: 'var(--space-2)', color: 'var(--color-semantic-label-normal)', fontWeight: 'var(--fw-semibold)' }}>
            설정 이름
            <input ref={firstFieldRef} data-testid="modal-initial-focus" defaultValue="야간 운영 알림" style={fieldStyle} />
          </label>
          <p style={{ margin: 0 }}>
            여러 문단이나 입력이 있는 작업에서는 가장 먼저 이해하거나 입력할 요소를 명시적인 초기 초점으로 지정합니다.
          </p>
          <Button data-testid="nested-modal-trigger" variant="secondary" onClick={() => setNestedOpen(true)}>
            변경 영향 확인
          </Button>
        </div>
      </Modal>
      <Modal
        open={nestedOpen}
        title="변경 영향 확인"
        width={360}
        onClose={() => setNestedOpen(false)}
        footer={<Button onClick={() => setNestedOpen(false)}>계속 편집</Button>}
      >
        이 확인 표면이 열려 있는 동안에는 바로 아래 Modal이 아닌 최상위 표면만 키보드 입력을 받습니다.
      </Modal>
    </main>
  );
}

function NarrowModalFixture() {
  const [open, setOpen] = React.useState(true);
  return (
    <main style={{ minHeight: 220 }}>
      <Button onClick={() => setOpen(true)}>좁은 폭 예시 열기</Button>
      <Modal
        open={open}
        title="긴 제목과 여러 동작이 있는 알림 환경 설정"
        onClose={() => setOpen(false)}
        footer={(
          <>
            <Button variant="outlined" color="assistive" onClick={() => setOpen(false)}>나중에</Button>
            <Button onClick={() => setOpen(false)}>변경 저장</Button>
          </>
        )}
      >
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <p style={{ margin: 0 }}>320px viewport에서도 제목, 본문, 동작이 읽기 순서대로 줄바꿈되어야 합니다.</p>
          <label style={{ display: 'grid', gap: 'var(--space-2)' }}>
            긴 설정 이름
            <input defaultValue="모든 장치의 점검 결과를 운영 채널에 알림" style={fieldStyle} />
          </label>
        </div>
      </Modal>
    </main>
  );
}

const meta = {
  title: 'LDS Core/Components/Overlay/Modal',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-overlay-modal--modal-open',
      eyebrow: 'Core / Overlay',
      title: 'Modal은 현재 흐름 위에서 집중해야 하는 상세 작업을 완결합니다',
      description:
        '입력, 긴 설명, 여러 동작처럼 별도 집중 공간이 필요하지만 현재 페이지 맥락으로 돌아와야 하는 작업에 적합합니다. 짧은 확인만 필요하면 Alert나 Confirm Dialog를, 페이지 흐름을 막지 않는 정보에는 Drawer나 인라인 영역을 사용하세요.',
    },
    docs: {
      description: {
        component: '현재 흐름 위에 상세 작업이나 확인 영역을 띄우는 Modal 패턴입니다.',
      },
    },
  },
};

export default meta;

export const ModalOpen = {
  ...ModalOpenStory,
  name: '개요',
  parameters: storyDescription(
    '항목 상세 정보를 헤더·본문·푸터로 나눠 보여주는 기본 Modal입니다. 호출 버튼으로 다시 열 수 있고, 제목과 본문을 읽은 뒤 확인 동작으로 자연스럽게 이어지는지 확인하세요.',
  ),
  render: () => <OpenModalExample />,
};

export const ModalFocusContract = {
  name: '상호작용 · 초점 순환과 복원',
  parameters: storyDescription(
    '입력 중심 Modal과 그 위에 열리는 두 번째 Modal의 초점·레이어 계약입니다. 지정한 첫 입력으로 초점이 이동하고 최상위 표면 안에서 순환하며 Escape를 누를 때 한 층씩 닫혀 각 호출 요소로 복원되는지 확인하세요.',
  ),
  render: () => <ModalFocusFixture />,
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    const trigger = canvasElement.querySelector('[data-testid="modal-trigger"]');
    if (!trigger) throw new Error('The Modal focus fixture requires an invoker.');

    await userEvent.click(trigger);
    await waitFor(() => {
      const initial = canvasElement.querySelector('[data-testid="modal-initial-focus"]');
      if (!initial || ownerDocument.activeElement !== initial) {
        throw new Error('Modal must honor initialFocusRef when it opens.');
      }
    });

    const mainDialog = canvasElement.querySelector('[role="dialog"]');
    const labelledTitle = mainDialog && ownerDocument.getElementById(mainDialog.getAttribute('aria-labelledby'));
    if (!mainDialog || mainDialog.getAttribute('aria-modal') !== 'true' || !labelledTitle?.textContent?.includes('현장 알림')) {
      throw new Error('Modal must expose a named modal dialog surface.');
    }

    const firstTabStop = mainDialog.querySelector('button[aria-label="닫기"]');
    const lastTabStop = mainDialog.querySelector('[data-testid="modal-save"]');
    if (!firstTabStop || !lastTabStop) throw new Error('The Modal fixture requires first and last tab stops.');
    lastTabStop.focus();
    await userEvent.tab();
    if (ownerDocument.activeElement !== firstTabStop) throw new Error('Tab must wrap from the final Modal action to the first action.');
    firstTabStop.focus();
    await userEvent.tab({ shift: true });
    if (ownerDocument.activeElement !== lastTabStop) throw new Error('Shift+Tab must wrap from the first Modal action to the final action.');

    trigger.focus();
    await waitFor(() => {
      if (!mainDialog.contains(ownerDocument.activeElement)) throw new Error('Focus must remain inside the topmost Modal.');
    });

    const nestedTrigger = mainDialog.querySelector('[data-testid="nested-modal-trigger"]');
    await userEvent.click(nestedTrigger);
    await waitFor(() => {
      const dialogs = canvasElement.querySelectorAll('[role="dialog"]');
      if (dialogs.length !== 2 || !dialogs[1].contains(ownerDocument.activeElement)) {
        throw new Error('The latest Modal must become the active focus layer.');
      }
    });

    const dialogs = canvasElement.querySelectorAll('[role="dialog"]');
    const parentLayer = Number.parseInt(ownerDocument.defaultView.getComputedStyle(dialogs[0].parentElement).zIndex, 10);
    const topLayer = Number.parseInt(ownerDocument.defaultView.getComputedStyle(dialogs[1].parentElement).zIndex, 10);
    if (!(topLayer > parentLayer)) throw new Error('The latest Modal must render above the previous overlay layer.');

    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (canvasElement.querySelectorAll('[role="dialog"]').length !== 1 || ownerDocument.activeElement !== nestedTrigger) {
        throw new Error('Escape must close only the topmost Modal and restore its inner trigger.');
      }
    });

    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (canvasElement.querySelector('[role="dialog"]') || ownerDocument.activeElement !== trigger) {
        throw new Error('Closing the base Modal must restore focus to its invoker.');
      }
    });

    await userEvent.click(trigger);
    await waitFor(() => {
      if (ownerDocument.activeElement !== canvasElement.querySelector('[data-testid="modal-initial-focus"]')) {
        throw new Error('The representative Modal must remain open with its initial focus for visual review.');
      }
    });
  },
};

export const ModalNarrowContent = {
  name: '반응형 · 좁은 폭과 긴 콘텐츠',
  parameters: storyDescription(
    '320px 폭에서 긴 제목, 입력값, 두 개의 푸터 동작을 담는 Modal입니다. 읽기 순서대로 자연스럽게 줄바꿈되고 가로 스크롤 없이 모든 내용과 동작을 사용할 수 있는지 확인하세요.',
  ),
  render: () => <NarrowModalFixture />,
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    await waitFor(() => {
      const dialog = canvasElement.querySelector('[role="dialog"]');
      if (!dialog || !dialog.contains(ownerDocument.activeElement)) {
        throw new Error('The narrow Modal must move focus into its surface.');
      }
    });
    const dialog = canvasElement.querySelector('[role="dialog"]');
    const title = ownerDocument.getElementById(dialog.getAttribute('aria-labelledby'));
    const rect = dialog.getBoundingClientRect();
    if (!title?.textContent?.includes('긴 제목') || rect.left < 0 || rect.right > ownerDocument.defaultView.innerWidth) {
      throw new Error('The narrow Modal title and surface must remain inside the viewport.');
    }
    if (dialog.scrollWidth > dialog.clientWidth || ownerDocument.documentElement.scrollWidth > ownerDocument.documentElement.clientWidth) {
      throw new Error('The narrow Modal must not create horizontal overflow.');
    }
  },
};

export const ModalCard = { ...ModalCardStory, name: 'Modal card parity', tags: ['!dev', 'visual-parity'] };
