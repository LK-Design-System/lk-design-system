import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Button, Chip, Icon, IconButton, MessageComposer } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Communication/Message Composer',
  component: MessageComposer,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-communication-message-composer--message-composer-overview',
      eyebrow: 'Product / Communication',
      title: '초안과 다음 행동은 하나의 elevated composer shell에 모입니다',
      description:
        'AI 또는 사람 간 대화에서 짧은 요청부터 여러 줄 초안까지 작성할 때 사용합니다. attachment와 utility는 generic slot으로 조합하고, Composer는 controlled value·submit·stop 요청만 담당합니다. 단발성 검색어나 폼의 단일 입력에는 적합하지 않으니 SearchField·Textarea를 사용하세요.',
    },
    docs: {
      description: {
        component:
          'controlled autosize textarea, leading/trailing action slot, explicit keyboard submit mode와 IME 보호를 제공하는 LK Product Extension입니다.',
      },
    },
  },
};

export default meta;

function AttachmentChip({ children }) {
  return (
    <Chip
      size="sm"
      variant="outlined"
      leading={<Icon name="attachment" size={14} />}
      style={{ minWidth: 0, maxWidth: '100%' }}
    >
      <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{children}</span>
    </Chip>
  );
}

function AddFileAction(props) {
  return (
    <IconButton label="파일 추가" size="small" round={false} variant="plain" {...props}>
      <Icon name="attachment" size={16} />
    </IconButton>
  );
}

function MoreOptionsAction() {
  return (
    <IconButton label="작성 옵션" size="small" round={false} variant="plain">
      <Icon name="template" size={16} />
    </IconButton>
  );
}

function ToolsAction() {
  return (
    <IconButton label="도구" size="small" round={false} variant="plain">
      <Icon name="tune" size={16} />
    </IconButton>
  );
}

function VoiceAction() {
  return (
    <IconButton label="음성 입력" size="small" round={false} variant="plain">
      <Icon name="microphone" size={16} />
    </IconButton>
  );
}

function ComposerFixture({ initialValue = '', onSubmit: onSubmitProp, ...props }) {
  const [value, setValue] = React.useState(initialValue);
  const [lastAction, setLastAction] = React.useState('아직 제출하지 않음');
  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)', width: '100%', minWidth: 0 }}>
      <MessageComposer
        {...props}
        value={value}
        onValueChange={setValue}
        onSubmit={(submittedValue, reason) => {
          setLastAction(`${reason}: ${submittedValue}`);
          onSubmitProp?.(submittedValue, reason);
        }}
      />
      <output hidden data-last-action>{lastAction}</output>
    </div>
  );
}

export const MessageComposerOverview = {
  name: '개요',
  parameters: storyDescription(
    '약 720px에서 attachment preview, leading action, autosize draft, trailing action과 primary send를 하나의 elevated shell로 보여 줍니다. slot 이름은 위치만 표현하며 특정 provider나 product tool을 API에 고정하지 않습니다.',
  ),
  render: () => (
    <main style={{ width: '100%', maxWidth: 720 }}>
      <ComposerFixture
        initialValue="업로드한 회의록에서 결정 사항을 세 문장으로 요약해 주세요."
        description="Enter로 보내고 Shift+Enter로 줄을 바꿉니다."
        maxLength={300}
        attachments={<AttachmentChip>weekly-meeting-notes.pdf</AttachmentChip>}
        leadingActions={<AddFileAction />}
        trailingActions={<MoreOptionsAction />}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const form = canvasElement.querySelector('.lk-message-composer');
    const shell = form?.querySelector('[data-composer-shell]');
    const attachments = form?.querySelector('[data-composer-attachments]');
    const row = form?.querySelector('[data-composer-control-row]');
    const leading = form?.querySelector('[data-composer-leading-actions]');
    const textarea = form?.querySelector('[data-composer-input]');
    const trailing = form?.querySelector('[data-composer-trailing-actions]');
    const primary = form?.querySelector('[data-composer-primary-action]');
    if (!form || !shell || !attachments || !row || !leading || !textarea || !trailing || !primary) {
      throw new Error('MessageComposer overview anatomy is incomplete.');
    }
    if (attachments.parentElement !== shell || row.parentElement !== shell
      || !(attachments.compareDocumentPosition(row) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      throw new Error('Attachments and the control row must share one shell in reading order.');
    }
    if (!(textarea.compareDocumentPosition(leading) & Node.DOCUMENT_POSITION_FOLLOWING)
      || !(leading.compareDocumentPosition(trailing) & Node.DOCUMENT_POSITION_FOLLOWING)
      || !(trailing.compareDocumentPosition(primary) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      throw new Error('Control order must be textarea → leading → trailing → primary action.');
    }
    for (const button of row.querySelectorAll('button')) {
      const rect = button.getBoundingClientRect();
      if (rect.width < 24 || rect.height < 24) {
        throw new Error('Composer actions must retain an operable control target.');
      }
    }
    await userEvent.click(textarea);
    await waitFor(() => {
      if (shell.dataset.focused !== 'true') throw new Error('Textarea focus must activate the shared shell focus state.');
    });
    const send = primary.querySelector('button[type="submit"]');
    if (!send || send.disabled) throw new Error('A non-empty controlled draft must enable the send action.');
  },
};

function StateExample({ state, label, ...props }) {
  const [value, setValue] = React.useState('핵심 결론과 다음 행동을 정리해 주세요.');
  return (
    <section style={{ display: 'grid', gap: 'var(--space-2)', minWidth: 0 }}>
      <strong style={{ color: 'var(--color-semantic-label-strong)', fontSize: 'var(--label1-size)' }}>{label}</strong>
      <MessageComposer
        {...props}
        state={state}
        value={value}
        onValueChange={setValue}
        onSubmit={() => {}}
        onStop={() => {}}
      />
    </section>
  );
}

function DisabledStateExample() {
  const [actionCount, setActionCount] = React.useState(0);
  return (
    <div data-disabled-action-probe data-action-count={actionCount}>
      <StateExample
        state="idle"
        label="비활성 · 이유 포함"
        disabled
        disabledReason="현재 연결을 확인할 수 없어 메시지를 보낼 수 없습니다."
        leadingActions={<AddFileAction onClick={() => setActionCount((count) => count + 1)} />}
      />
    </div>
  );
}

export const RequestStates = {
  name: '변형·상태 · 전송·스트리밍·중지',
  parameters: storyDescription(
    'idle, submitting, streaming, stopping과 read-only·disabled를 비교합니다. non-idle은 성공이나 실패가 아닌 neutral phase이며, stopping에서는 중복 stop 요청을 막습니다.',
  ),
  render: () => (
    <main data-state-grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'var(--space-5)', width: '100%', maxWidth: 1040 }}>
      <StateExample state="idle" label="대기" />
      <StateExample state="submitting" label="전송 중" />
      <StateExample state="streaming" label="응답 생성 중" />
      <StateExample state="stopping" label="중지 요청 중" />
      <StateExample state="idle" label="읽기 전용" readOnly description="전송 기록을 확인하는 동안 편집할 수 없습니다." />
      <DisabledStateExample />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const disabledForm = canvasElement.querySelector('form[aria-disabled="true"]');
    const reason = disabledForm?.querySelector('[data-composer-disabled-reason]');
    const row = disabledForm?.querySelector('[data-composer-control-row]');
    const textarea = disabledForm?.querySelector('textarea');
    if (!disabledForm || !reason || !row || !textarea) {
      throw new Error('Disabled MessageComposer must render its reason and controls.');
    }
    if (!(reason.compareDocumentPosition(row) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      throw new Error('The disabled reason must precede composer controls.');
    }
    const describedBy = textarea.getAttribute('aria-describedby')?.split(/\s+/) ?? [];
    if (!reason.id || !describedBy.includes(reason.id)) {
      throw new Error('The disabled textarea must reference its visible reason.');
    }
    const disabledShell = disabledForm.querySelector('[data-composer-shell]');
    const disabledAction = disabledForm.querySelector('[data-composer-leading-actions] button');
    const disabledProbe = canvasElement.querySelector('[data-disabled-action-probe]');
    if (!disabledShell?.hasAttribute('inert') || !disabledAction || !disabledProbe) {
      throw new Error('The disabled composer must make its complete slot-bearing shell inert.');
    }
    disabledAction.click();
    disabledAction.focus();
    if (disabledProbe.dataset.actionCount !== '0' || document.activeElement === disabledAction) {
      throw new Error('Actions composed into a disabled shell must not activate or receive focus.');
    }
    const stopping = canvasElement.querySelector('form[data-state="stopping"]');
    if (!stopping?.querySelector('button[aria-label="응답 중지"]')?.disabled) {
      throw new Error('Stopping must prevent a duplicate stop request.');
    }
    for (const form of canvasElement.querySelectorAll('form[data-state]:not([data-state="idle"])')) {
      if (form.getAttribute('aria-busy') !== 'true') {
        throw new Error('Every non-idle composer must expose aria-busy.');
      }
      if (!form.querySelector('[data-composer-primary-action] button')) {
        throw new Error('Every non-idle composer must retain its named primary action.');
      }
    }
  },
};

function DarkFixture() {
  const [value, setValue] = React.useState('다크 테마에서도 같은 semantic input token을 사용합니다.');
  return (
    <MessageComposer
      value={value}
      onValueChange={setValue}
      onSubmit={() => {}}
      description="별도 inverse prop 없이 dark scope 안에서 동작합니다."
      leadingActions={<AddFileAction />}
      trailingActions={<MoreOptionsAction />}
    />
  );
}

export const DarkTheme = {
  name: '변형·상태 · 다크 테마',
  parameters: storyDescription(
    'elevated shell, input text, focus, helper와 icon action이 dark semantic scope에서 전환되는지 확인합니다. 고정 흰색 surface나 별도 composer palette를 만들지 않습니다.',
  ),
  render: () => (
    <main
      data-theme="dark"
      data-dark-composer
      style={{ width: '100%', maxWidth: 720, padding: 'var(--space-5)', boxSizing: 'border-box', background: 'var(--color-semantic-background-normal-normal)' }}
    >
      <DarkFixture />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-dark-composer]');
    const shell = fixture?.querySelector('[data-composer-shell]');
    const input = fixture?.querySelector('[data-composer-input]');
    if (!fixture || !shell || !input) throw new Error('The dark composer fixture is incomplete.');
    const style = getComputedStyle(shell);
    if (style.backgroundColor === 'rgba(0, 0, 0, 0)' || style.borderTopWidth === '0px') {
      throw new Error('The dark composer must retain its elevated input-shell boundary.');
    }
    if (fixture.scrollWidth > fixture.clientWidth + 1 || input.scrollWidth > input.clientWidth + 1) {
      throw new Error('The dark composer must not create horizontal overflow.');
    }
  },
};

function KeyboardFixture() {
  const [logs, setLogs] = React.useState({ enter: [], modifier: [], button: [], stop: 0 });
  const append = (key, reason) => setLogs((current) => ({ ...current, [key]: [...current[key], reason] }));
  return (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 760 }}>
      <section data-keyboard-case="enter" data-log={logs.enter.join(',')}>
        <ComposerFixture initialValue="Enter 제출" submitMode="enter" onSubmit={(_, reason) => append('enter', reason)} />
      </section>
      <section data-keyboard-case="modifier" data-log={logs.modifier.join(',')}>
        <ComposerFixture initialValue="수정자 제출" submitMode="modifier-enter" onSubmit={(_, reason) => append('modifier', reason)} />
      </section>
      <section data-keyboard-case="button" data-log={logs.button.join(',')}>
        <ComposerFixture initialValue="버튼 제출" submitMode="button-only" onSubmit={(_, reason) => append('button', reason)} />
      </section>
      <section data-keyboard-case="stop" data-stop-count={logs.stop}>
        <MessageComposer
          value="현재 응답 생성을 중지합니다."
          onValueChange={() => {}}
          onSubmit={() => {}}
          state="streaming"
          onStop={() => setLogs((current) => ({ ...current, stop: current.stop + 1 }))}
        />
      </section>
    </main>
  );
}

const nextPaint = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));

function dispatchKey(target, init) {
  target.dispatchEvent(new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key: init.key,
    code: init.code ?? init.key,
    shiftKey: init.shiftKey,
    ctrlKey: init.ctrlKey,
    metaKey: init.metaKey,
    isComposing: init.isComposing,
  }));
}

export const KeyboardAndImeContract = {
  name: '상호작용 · 조합 입력과 제출 방식',
  parameters: storyDescription(
    'IME 조합 Enter, 일반 Enter, Ctrl·Meta+Enter, button-only와 explicit stop을 비교합니다. submit callback은 reason을 전달하고 value clear나 transport 완료를 수행하지 않습니다.',
  ),
  render: () => <KeyboardFixture />,
  play: async ({ canvasElement }) => {
    const enterCase = canvasElement.querySelector('[data-keyboard-case="enter"]');
    const enterInput = enterCase?.querySelector('textarea');
    if (!enterCase || !enterInput) throw new Error('Enter keyboard fixture is missing.');
    enterInput.focus();
    enterInput.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true, data: '한' }));
    dispatchKey(enterInput, { key: 'Enter', code: 'Enter', isComposing: true });
    enterInput.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '한' }));
    await nextPaint();
    if (enterCase.dataset.log) throw new Error('IME confirmation Enter must not submit.');
    dispatchKey(enterInput, { key: 'Enter', code: 'Enter' });
    await nextPaint();
    if (enterCase.dataset.log !== 'enter') throw new Error('Enter mode must report the enter reason.');
    if (document.activeElement !== enterInput || enterInput.value !== 'Enter 제출') {
      throw new Error('Keyboard submit must preserve the controlled value and textarea focus.');
    }

    const modifierCase = canvasElement.querySelector('[data-keyboard-case="modifier"]');
    const modifierInput = modifierCase?.querySelector('textarea');
    if (!modifierCase || !modifierInput) throw new Error('Modifier keyboard fixture is missing.');
    modifierInput.focus();
    dispatchKey(modifierInput, { key: 'Enter', code: 'Enter' });
    await nextPaint();
    if (modifierCase.dataset.log) throw new Error('Plain Enter must remain a newline in modifier mode.');
    dispatchKey(modifierInput, { key: 'Enter', code: 'Enter', ctrlKey: true });
    await nextPaint();
    if (modifierCase.dataset.log !== 'modifier-enter') {
      throw new Error('Modifier mode must report the modifier-enter reason.');
    }

    const buttonCase = canvasElement.querySelector('[data-keyboard-case="button"]');
    const buttonInput = buttonCase?.querySelector('textarea');
    const buttonSubmit = buttonCase?.querySelector('button[type="submit"]');
    if (!buttonCase || !buttonInput || !buttonSubmit) throw new Error('Button-only fixture is missing.');
    buttonInput.focus();
    dispatchKey(buttonInput, { key: 'Enter', code: 'Enter' });
    await nextPaint();
    if (buttonCase.dataset.log) throw new Error('Button-only mode must not submit from the keyboard.');
    await userEvent.click(buttonSubmit);
    await nextPaint();
    if (buttonCase.dataset.log !== 'button' || document.activeElement !== buttonInput) {
      throw new Error('Button submit must report its reason and restore textarea focus.');
    }

    const stopCase = canvasElement.querySelector('[data-keyboard-case="stop"]');
    const stopInput = stopCase?.querySelector('textarea');
    const stopButton = stopCase?.querySelector('button[aria-label="응답 중지"]');
    if (!stopCase || !stopInput || !stopButton) throw new Error('Stop fixture is missing.');
    stopInput.focus();
    dispatchKey(stopInput, { key: 'Escape', code: 'Escape' });
    await nextPaint();
    if (stopCase.dataset.stopCount !== '0') throw new Error('Escape must not request stop.');
    await userEvent.click(stopButton);
    await nextPaint();
    if (stopCase.dataset.stopCount !== '1') throw new Error('The named stop action must request stop once.');
  },
};

export const NarrowWidth = {
  name: '반응형 · 320px 좁은 폭',
  parameters: storyDescription(
    '320px에서 긴 attachment, 양쪽의 여러 utility, multiline draft와 primary action을 함께 확인합니다. textarea가 전체 폭을 먼저 확보하고 하단 action band만 wrap하며 가로 overflow를 만들지 않아야 합니다.',
  ),
  render: () => (
    <main
      data-narrow-composer
      style={{ display: 'flex', alignItems: 'flex-end', width: 320, maxWidth: '100%', minHeight: 240, boxSizing: 'border-box' }}
    >
      <ComposerFixture
        initialValue="긴 문서를 읽고 결정 사항과 다음 행동을 함께 정리해 주세요."
        maxLength={160}
        minRows={2}
        attachments={<AttachmentChip>quarterly-product-planning-notes-with-review-history.pdf</AttachmentChip>}
        leadingActions={(
          <>
            <AddFileAction />
            <ToolsAction />
          </>
        )}
        trailingActions={(
          <>
            <Button type="button" size="sm" variant="ghost">
              모델 <Icon name="chevron-down-small" size={14} aria-hidden="true" />
            </Button>
            <VoiceAction />
          </>
        )}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-narrow-composer]');
    const composer = fixture?.querySelector('.lk-message-composer');
    const row = composer?.querySelector('[data-composer-control-row]');
    const leading = composer?.querySelector('[data-composer-leading-actions]');
    const input = composer?.querySelector('[data-composer-input]');
    const trailing = composer?.querySelector('[data-composer-trailing-actions]');
    const primary = composer?.querySelector('[data-composer-primary-action]');
    if (!fixture || !composer || !row || !leading || !input || !trailing || !primary) {
      throw new Error('The narrow composer anatomy is incomplete.');
    }
    if (fixture.scrollWidth > fixture.clientWidth + 1 || composer.scrollWidth > composer.clientWidth + 1) {
      throw new Error('MessageComposer must not create horizontal overflow at 320px.');
    }
    const fixtureRect = fixture.getBoundingClientRect();
    const composerRect = composer.getBoundingClientRect();
    if (composerRect.left < fixtureRect.left - 1 || composerRect.right > fixtureRect.right + 1) {
      throw new Error('MessageComposer escaped the narrow conversation column.');
    }
    if (!(input.compareDocumentPosition(leading) & Node.DOCUMENT_POSITION_FOLLOWING)
      || !(leading.compareDocumentPosition(trailing) & Node.DOCUMENT_POSITION_FOLLOWING)
      || !(trailing.compareDocumentPosition(primary) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      throw new Error('Narrow controls must preserve input → leading → trailing → primary order.');
    }
    if (input.getBoundingClientRect().width < 240) {
      throw new Error('The narrow composer must preserve a full-width usable draft row before utility actions.');
    }
    for (const button of row.querySelectorAll('button')) {
      const rect = button.getBoundingClientRect();
      if (rect.left < row.getBoundingClientRect().left - 1 || rect.right > row.getBoundingClientRect().right + 1) {
        throw new Error('A composer action escaped the narrow control row.');
      }
    }
  },
};

export const ButtonOnlyExample = {
  name: '사용법 · 버튼으로만 제출',
  parameters: storyDescription(
    '여러 줄 작성처럼 Enter를 항상 줄바꿈으로 보존해야 할 때 button-only를 사용합니다. 숨은 shortcut 없이 접근 가능한 이름과 focus를 가진 send action으로만 제출합니다.',
  ),
  render: () => (
    <main style={{ width: '100%', maxWidth: 720 }}>
      <ComposerFixture
        initialValue={'첫 번째 문단을 작성했습니다.\n다음 문단을 이어서 작성합니다.'}
        submitMode="button-only"
        minRows={2}
        maxRows={5}
        leadingActions={<AddFileAction />}
      />
    </main>
  ),
};
