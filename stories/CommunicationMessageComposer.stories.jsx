import React from 'react';
import { userEvent } from 'storybook/test';
import { Button, Chip, Icon, IconButton, MessageComposer } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Communication/Message Composer',
  component: MessageComposer,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-communication-message-composer--message-composer-overview',
      eyebrow: 'Product / Communication',
      title: '메시지 작성은 초안과 전송 상태를 섞지 않고 다음 행동을 분명하게 보여줍니다',
      description:
        '사람 간 대화와 AI 응답 요청에서 짧은 메시지부터 여러 줄 초안까지 작성할 때 적합합니다. 대화 기록은 Message Feed가, 개별 응답은 Message가 소유하며 Composer는 입력·제출·중지 요청만 담당합니다.',
    },
    docs: {
      description: {
        component:
          '44px에서 시작하는 controlled autosize textarea, 명시적인 keyboard submit mode, IME 보호, product-owned request state를 제공하는 LK Product Extension입니다.',
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
      <output hidden data-last-action="">
        마지막 행동: {lastAction}
      </output>
    </div>
  );
}

export const MessageComposerOverview = {
  name: '개요',
  parameters: storyDescription(
    '운영 질문을 작성하면서 파일과 템플릿 action을 같은 control row에 두는 기본 예시입니다. 입력은 한 줄 높이에서 시작해 내용만큼 커지고, 제출 뒤에도 제품이 값을 바꾸기 전까지 초안과 focus를 유지합니다.',
  ),
  render: () => (
    <main style={{ width: '100%', maxWidth: 720 }}>
      <ComposerFixture
        initialValue="3층 배송 로봇의 현재 경로와 대기 원인을 알려주세요."
        description="Enter로 보내고 Shift+Enter로 줄을 바꿉니다."
        maxLength={300}
        attachmentAction={(
          <IconButton label="파일 첨부" size="small" round={false} variant="plain">
            <Icon name="attachment" size={16} />
          </IconButton>
        )}
        secondaryActions={(
          <IconButton label="응답 템플릿 선택" size="small" round={false} variant="plain">
            <Icon name="template" size={16} />
          </IconButton>
        )}
        attachments={<AttachmentChip>facility-route-summary.pdf</AttachmentChip>}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const textarea = canvasElement.querySelector('[data-composer-input]');
    const utilityButtons = Array.from(canvasElement.querySelectorAll('[data-composer-utilities] button'));
    const submitButton = canvasElement.querySelector('button[type="submit"]');
    if (!textarea || utilityButtons.length !== 2 || !submitButton) {
      throw new Error('MessageComposer overview anatomy is incomplete.');
    }
    const textareaHeight = textarea.getBoundingClientRect().height;
    if (textareaHeight < 44 || textareaHeight > 48) {
      throw new Error(`The compact textarea must start at 44–48px; received ${textareaHeight}px.`);
    }
    for (const utility of utilityButtons) {
      const rect = utility.getBoundingClientRect();
      if (Math.abs(rect.width - 32) > 0.5 || Math.abs(rect.height - 32) > 0.5) {
        throw new Error('Composer utility actions must use the 32px IconButton scale.');
      }
    }
    if (Math.abs(submitButton.getBoundingClientRect().height - 40) > 0.5) {
      throw new Error('Composer submit action must use the 40px Button scale.');
    }
  },
};

function StateExample({ state, label, ...props }) {
  const [value, setValue] = React.useState('경로 분석 결과를 요약해 주세요.');
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

export const RequestStates = {
  name: '변형·상태 · 전송·스트리밍·중지',
  parameters: storyDescription(
    'idle, submitting, streaming, stopping과 read-only·disabled를 함께 비교합니다. 상태 prop은 서버 결과를 흉내 내지 않고 현재 제품 상태만 표시하며, stopping에서는 중복 stop 요청이 차단됩니다.',
  ),
  render: () => (
    <main data-state-grid="" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'var(--space-5)', width: '100%', maxWidth: 1040 }}>
      <StateExample state="idle" label="대기" />
      <StateExample state="submitting" label="전송 중" />
      <StateExample state="streaming" label="응답 생성 중" />
      <StateExample state="stopping" label="중지 요청 중" />
      <StateExample state="idle" label="읽기 전용" readOnly description="전송 기록을 확인하는 동안 편집할 수 없습니다." />
      <StateExample
        state="idle"
        label="비활성 · 이유 포함"
        disabled
        disabledReason="네트워크 연결이 없어 메시지를 보낼 수 없습니다."
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const disabledForm = canvasElement.querySelector('form[aria-disabled="true"]');
    const reason = disabledForm?.querySelector('[data-composer-disabled-reason]');
    const row = disabledForm?.querySelector('[data-composer-control-row]');
    const textarea = disabledForm?.querySelector('textarea');
    if (!disabledForm || !reason || !row || !textarea) {
      throw new Error('Disabled MessageComposer must render a reason and control row.');
    }
    if (!(reason.compareDocumentPosition(row) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      throw new Error('The disabled reason must precede composer controls in DOM order.');
    }
    const describedBy = textarea.getAttribute('aria-describedby')?.split(/\s+/) ?? [];
    if (!reason.id || !describedBy.includes(reason.id)) {
      throw new Error('The disabled textarea must reference its disabled reason.');
    }
    const stopping = canvasElement.querySelector('form[data-state="stopping"]');
    if (!stopping?.querySelector('button[aria-label="응답 중지"]')?.disabled) {
      throw new Error('Stopping state must prevent a repeated stop request.');
    }
    for (const form of canvasElement.querySelectorAll('form[data-state]:not([data-state="idle"])')) {
      if (form.getAttribute('aria-busy') !== 'true') {
        throw new Error('Every non-idle composer state must expose aria-busy.');
      }
    }
  },
};

function DarkFixture() {
  const [value, setValue] = React.useState('다크 운영 화면에서도 동일한 semantic token을 사용합니다.');
  return (
    <MessageComposer
      value={value}
      onValueChange={setValue}
      onSubmit={() => {}}
      description="별도의 inverse prop 없이 dark theme 안에서 동작합니다."
      attachmentAction={(
        <IconButton label="파일 첨부" size="small" round={false} variant="plain">
          <Icon name="attachment" size={16} />
        </IconButton>
      )}
    />
  );
}

export const DarkTheme = {
  name: '변형·상태 · 다크 테마',
  parameters: storyDescription(
    '같은 input·label·line semantic token이 dark scope에서 전환되는지 확인합니다. 별도 composer palette나 고정된 흰색 surface를 만들지 않습니다.',
  ),
  render: () => (
    <main
      data-theme="dark"
      style={{ width: '100%', maxWidth: 720, padding: 'var(--space-5)', boxSizing: 'border-box', borderRadius: 'var(--radius-xl)', background: 'var(--color-semantic-background-normal-normal)' }}
    >
      <DarkFixture />
    </main>
  ),
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
          value="생성 중인 응답"
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
    'IME 조합 Enter, 일반 Enter, Ctrl·Meta+Enter, button-only, Escape와 명시적 stop을 비교합니다. 제출 callback은 reason만 전달하고 value clear나 transport 완료를 수행하지 않습니다.',
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
    '가상 키보드가 올라와 짧아진 제품 영역을 가정한 320px 예시입니다. 긴 attachment 이름과 utility·submit action이 있어도 composer가 가로로 넘치지 않고 제품 shell이 정한 하단 영역 안에 머무는지 확인합니다.',
  ),
  render: () => (
    <main
      data-narrow-composer=""
      style={{ display: 'flex', alignItems: 'flex-end', width: 320, maxWidth: '100%', height: 240, boxSizing: 'border-box', overflow: 'auto' }}
    >
      <ComposerFixture
        initialValue="엘리베이터 탑승 지점과 경사 구역을 함께 확인해 주세요."
        maxLength={120}
        attachments={<AttachmentChip>very-long-facility-transition-route-reference-file.pdf</AttachmentChip>}
        attachmentAction={(
          <IconButton label="파일 첨부" size="small" round={false} variant="plain">
            <Icon name="attachment" size={16} />
          </IconButton>
        )}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-narrow-composer]');
    const composer = fixture?.querySelector('.lk-message-composer');
    if (!fixture || !composer) throw new Error('The 320px composer fixture is missing.');
    if (fixture.scrollWidth > fixture.clientWidth + 1 || composer.scrollWidth > composer.clientWidth + 1) {
      throw new Error('MessageComposer must not create horizontal overflow at 320px.');
    }
    const fixtureRect = fixture.getBoundingClientRect();
    const composerRect = composer.getBoundingClientRect();
    if (composerRect.left < fixtureRect.left - 1 || composerRect.right > fixtureRect.right + 1) {
      throw new Error('MessageComposer escaped the narrow product region.');
    }
  },
};

export const ButtonOnlyExample = {
  name: '사용법 · 버튼으로만 제출',
  parameters: storyDescription(
    '키오스크·다중 줄 작성처럼 Enter를 항상 줄바꿈으로 보존해야 할 때 button-only를 선택합니다. 숨은 keyboard shortcut 없이 이름이 있는 40px 전송 action을 사용합니다.',
  ),
  render: () => (
    <main style={{ width: '100%', maxWidth: 720 }}>
      <ComposerFixture
        initialValue={'1층 대기 구역을 확인했습니다.\n다음 작업을 알려주세요.'}
        submitMode="button-only"
        minRows={2}
        maxRows={4}
      />
    </main>
  ),
};
