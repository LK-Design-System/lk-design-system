import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Button, Chip, Icon, IconButton, MessageComposer } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Communication/Message Composer',
  tags: ['autodocs'],
  component: MessageComposer,
  argTypes: {
    value: {
      description: '완전 제어 방식의 초안 값입니다. 제출 뒤에도 컴포넌트가 값을 지우지 않습니다.',
      control: 'text',
      table: { category: 'Draft', type: { summary: 'string' } },
    },
    onValueChange: {
      description: '텍스트가 바뀔 때 다음 값과 원래 textarea change event를 전달합니다.',
      control: false,
      table: { category: 'Draft', type: { summary: '(value, event) => void' } },
    },
    onSubmit: {
      description: '제출 가능한 초안이 전송될 때 현재 값과 enter, modifier-enter 또는 button 이유를 전달합니다.',
      control: false,
      table: { category: 'Submission', type: { summary: '(value, reason) => void' } },
    },
    state: {
      description: '제품이 소유하는 요청 수명주기입니다. idle은 보내기, submitting/streaming은 중지, stopping은 비활성 중지를 표시합니다.',
      options: ['idle', 'submitting', 'streaming', 'stopping'],
      control: { type: 'select' },
      table: { category: 'Submission', type: { summary: 'idle | submitting | streaming | stopping' }, defaultValue: { summary: 'idle' } },
    },
    density: {
      description: 'stacked 입력은 comfortable 40px, compact 32px에서 시작합니다. inline은 44px 입력/동작 target을 사용하며 모두 입력 글자 16px를 유지합니다.',
      options: ['comfortable', 'compact'],
      control: { type: 'inline-radio' },
      table: { category: 'Layout', type: { summary: "'comfortable' | 'compact'" }, defaultValue: { summary: 'comfortable' } },
    },
    layout: {
      description: 'inline은 단순 입력과 보내기를 약 50px 한 행에 배치합니다. 긴 초안은 자동 확장하고 첨부/utility slot은 full-width stacked 구조로 확장합니다. 기본 stacked를 유지합니다.',
      options: ['stacked', 'inline'],
      control: { type: 'inline-radio' },
      table: { category: 'Layout', type: { summary: "'stacked' | 'inline'" }, defaultValue: { summary: 'stacked' } },
    },
    submitMode: {
      description: '키보드 제출 규칙입니다. enter는 Enter, modifier-enter는 Alt 없이 Ctrl/Meta+Enter, button-only는 명시적 버튼만 사용합니다. IME 조합 확정 Enter와 Shift+Enter는 제출하지 않습니다.',
      options: ['enter', 'modifier-enter', 'button-only'],
      control: { type: 'radio' },
      table: { category: 'Submission', type: { summary: 'enter | modifier-enter | button-only' }, defaultValue: { summary: 'enter' } },
    },
    canSubmit: {
      description: '제품 규칙으로 제출 가능 여부를 덮어씁니다. 생략하면 공백을 제거한 value가 있을 때만 제출할 수 있습니다.',
      control: 'boolean',
      table: { category: 'Submission', type: { summary: 'boolean' }, defaultValue: { summary: 'trim(value).length > 0' } },
    },
    readOnly: {
      description: '초안의 포커스와 복사는 유지하되 편집과 제출을 막습니다. 이용 불가 상태를 설명해야 한다면 disabled와 disabledReason을 사용합니다.',
      control: 'boolean',
      table: { category: 'Availability', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    disabled: {
      description: 'textarea와 slot action을 포함한 composer 전체를 비활성화합니다. true일 때 disabledReason이 필수입니다.',
      control: 'boolean',
      table: { category: 'Availability', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    disabledReason: {
      description: 'disabled=true일 때 controls 앞에 표시되고 textarea의 aria-describedby에 연결되는 필수 이용 불가 설명입니다.',
      control: 'text',
      table: { category: 'Availability', type: { summary: 'ReactNode' } },
    },
    statusLabel: {
      description: '상태 영역의 표시·알림 문구입니다. undefined는 기본 lifecycle 문구를 사용하고 null은 문구를 숨깁니다.',
      control: 'text',
      table: { category: 'Status', type: { summary: 'ReactNode' }, defaultValue: { summary: 'state별 기본 문구' } },
    },
    formLabel: {
      description: 'composer form의 접근 가능한 이름입니다.',
      control: 'text',
      table: { category: 'Accessibility', type: { summary: 'string' }, defaultValue: { summary: '메시지 작성' } },
    },
    inputLabel: {
      description: '내부 textarea의 접근 가능한 이름입니다.',
      control: 'text',
      table: { category: 'Accessibility', type: { summary: 'string' }, defaultValue: { summary: '메시지 입력' } },
    },
    placeholder: {
      description: '내부 textarea의 placeholder입니다. inputLabel을 대신하지 않습니다.',
      control: 'text',
      table: { category: 'Draft', type: { summary: 'string' }, defaultValue: { summary: '메시지를 입력하세요.' } },
    },
    description: {
      description: '입력 앞에 표시되고 textarea의 aria-describedby에 연결되는 사용 안내입니다.',
      control: 'text',
      table: { category: 'Accessibility', type: { summary: 'ReactNode' } },
    },
    maxLength: {
      description: 'native 최대 글자 수 제한과 보이는 현재/최대 글자 수 counter를 함께 제공합니다.',
      control: { type: 'number', min: 1 },
      table: { category: 'Draft', type: { summary: 'number' } },
    },
    minRows: {
      description: '자동 높이 조절의 최소 행 수입니다. 1행은 comfortable 40px, compact 32px에서 시작하고 내용·폭 변경에 따라 확장합니다.',
      control: { type: 'number', min: 1, step: 1 },
      table: { category: 'Layout', type: { summary: 'number' }, defaultValue: { summary: '1' } },
    },
    maxRows: {
      description: '내부 세로 스크롤을 시작하기 전 자동 높이 조절의 최대 행 수입니다.',
      control: { type: 'number', min: 1, step: 1 },
      table: { category: 'Layout', type: { summary: 'number' }, defaultValue: { summary: '6' } },
    },
    attachments: {
      description: 'control row 앞, 동일한 shell 안에 표시하는 첨부 미리보기 또는 목록 slot입니다. 업로드 수명주기는 소비자가 소유합니다.',
      control: false,
      table: { category: 'Slots', type: { summary: 'ReactNode' } },
    },
    leadingActions: {
      description: 'textarea 아래 action band의 앞쪽에 배치하는 명명된 utility action slot입니다.',
      control: false,
      table: { category: 'Slots', type: { summary: 'ReactNode' } },
    },
    trailingActions: {
      description: 'primary 보내기/중지 control 앞에 배치하는 명명된 utility action slot입니다.',
      control: false,
      table: { category: 'Slots', type: { summary: 'ReactNode' } },
    },
    submitLabel: {
      description: 'icon-only 보내기 버튼의 접근 가능한 이름입니다.',
      control: 'text',
      table: { category: 'Accessibility', type: { summary: 'string' }, defaultValue: { summary: '메시지 보내기' } },
    },
    stopLabel: {
      description: 'submitting/streaming 상태에서 표시되는 icon-only 중지 버튼의 접근 가능한 이름입니다.',
      control: 'text',
      table: { category: 'Accessibility', type: { summary: 'string' }, defaultValue: { summary: '응답 중지' } },
    },
    onStop: {
      description: 'submitting 또는 streaming 상태의 명시적 중지 버튼이 transport 취소를 요청할 때 호출됩니다. Escape는 중지 shortcut이 아닙니다.',
      control: false,
      table: { category: 'Submission', type: { summary: '() => void' } },
    },
    textareaProps: {
      description: '컴포넌트가 소유하지 않는 native textarea 속성과 event hook입니다. value, rows, disabled, readOnly, maxLength, placeholder는 사용할 수 없습니다.',
      control: 'object',
      table: { category: 'Advanced', type: { summary: 'TextareaHTMLAttributes' } },
    },
    className: {
      description: 'composer form에 추가할 class name입니다.',
      control: 'text',
      table: { category: 'Form', type: { summary: 'string' } },
    },
    style: {
      description: 'composer form root에 병합할 React inline style입니다.',
      control: 'object',
      table: { category: 'Form', type: { summary: 'CSSProperties' } },
    },
  },
  parameters: {
    controls: { disable: true },
    storyGuide: {
      storyId: 'lds-product-communication-message-composer--message-composer-overview',
      eyebrow: 'Product / Communication',
      title: '초안과 전송 행동을 하나의 입력 영역에 모읍니다',
      description:
        '사람 또는 AI와 대화하며 짧은 요청과 여러 줄 초안을 작성할 때 사용합니다. 보조 행동은 slot으로 조합하고 작성기는 값·전송·중지만 소유합니다. 즉시 명령은 열고 닫는 명령 메뉴에, 안내·연속 설정은 비모달 팝오버에 두며 외부 렌더·닫기·배치는 각 기반 요소가 소유합니다. 단발성 검색에는 독립 검색 입력을 사용하세요.',
      decisionGuidance: {
        useWhen: '사람 또는 AI와 대화하며 짧은 요청과 여러 줄 초안을 작성하고 전송·중지 상태를 한 입력 영역에서 보여 줄 때 사용합니다.',
        avoidWhen: '대화 맥락이 없는 단발성 검색, 일반 폼 입력, 제품 전용 명령 실행에는 사용하지 않습니다.',
      },
    },
    docs: {
      description: {
        component:
          'controlled autosize textarea, leading/trailing action slot, 명시적 키보드 제출 모드와 IME 보호를 제공하는 LK Product Extension입니다. Enter 모드는 Enter 제출·Shift+Enter 줄바꿈, modifier-enter 모드는 Alt 없는 Ctrl/Meta+Enter 제출, button-only 모드는 버튼 제출만 허용합니다. submitting/streaming에서는 이름 있는 중지 버튼을 제공하며, readOnly는 읽기·포커스를 유지하고 disabled는 보이는 disabledReason과 함께 전체 shell을 이용 불가로 만듭니다. slot에는 즉시 실행 명령 메뉴와 안내·단일 선택·범위 조절 같은 연속 설정 패널을 조합할 수 있지만, 작성기 자체 API는 provider·외부 렌더·overlay dismiss 상태를 소유하지 않습니다.',
      },
    },
  },
};

export default meta;

function WidthAutosizeFixture() {
  const [narrow, setNarrow] = React.useState(false);
  const [value, setValue] = React.useState('프로젝트 자료와 장비 점검 기록을 함께 검토하고 다음 회의에서 확인할 질문을 정리해 주세요. Model evaluation results and deployment notes need to stay visible when the panel width changes.');
  return <div style={{ display: 'grid', gap: 'var(--space-3)', maxWidth: '100%' }}>
    <button type="button" onClick={() => setNarrow((previous) => !previous)}>작성 폭 전환</button>
    <div data-autosize-width={narrow ? 'narrow' : 'wide'} style={{ width: narrow ? 320 : 700, maxWidth: '100%' }}>
      <MessageComposer value={value} onValueChange={setValue} onSubmit={() => {}} density="compact" submitMode="button-only" />
    </div>
    <MessageComposer value="" onValueChange={() => {}} onSubmit={() => {}} placeholder="한 줄 질문을 시작하세요." />
  </div>;
}

export const WidthAutosize = {
  name: '상호작용 · 초안 유지와 폭 변경 자동 높이',
  render: () => <WidthAutosizeFixture />,
  play: async ({ canvasElement }) => {
    const textarea = canvasElement.querySelector('textarea');
    const value = textarea.value;
    const before = textarea.getBoundingClientRect().height;
    const beforeWidth = textarea.getBoundingClientRect().width;
    await userEvent.click(canvasElement.querySelector('button'));
    await waitFor(() => {
      const widthDelta = beforeWidth - textarea.getBoundingClientRect().width;
      if (textarea.value !== value || (widthDelta > 100 && textarea.getBoundingClientRect().height <= before)) throw new Error('Changing width reflows the same draft and grows its input.');
      if (textarea.scrollHeight > textarea.clientHeight + 1 && getComputedStyle(textarea).overflowY !== 'auto') throw new Error('Overflowing draft lines remain scrollable.');
    });
    await userEvent.click(canvasElement.querySelector('button'));
    await waitFor(() => {
      if (textarea.getBoundingClientRect().height > before + 1) throw new Error('Widening returns the same draft to its natural height.');
    });
  },
};

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

// One focus indicator: the shell's neutral border step. The inner textarea draws
// no outline of its own and the shell adds no halo (MessageComposer.prompt.md).
async function expectNeutralShellFocus(shell, input, idleShadow) {
  // Resolve the token once, outside waitFor: a probe inserted inside the
  // callback would itself trigger waitFor's MutationObserver on every run.
  const probe = document.createElement('span');
  probe.style.color = 'var(--component-message-composer-border-focus)';
  shell.appendChild(probe);
  const expected = getComputedStyle(probe).color;
  probe.remove();
  await waitFor(() => {
    if (shell.dataset.focused !== 'true') throw new Error('Textarea focus must activate the shared shell focus state.');
    const inputStyle = getComputedStyle(input);
    if (inputStyle.outlineStyle !== 'none' && (Number.parseFloat(inputStyle.outlineWidth) || 0) > 0) {
      throw new Error('The composer textarea must not draw its own focus outline inside the shared shell.');
    }
    const shellStyle = getComputedStyle(shell);
    if (shellStyle.boxShadow !== idleShadow) {
      throw new Error('The focused composer shell must keep its idle elevation without a focus halo.');
    }
    if (shellStyle.borderTopColor !== expected) {
      throw new Error(`The focused composer shell must use the neutral focus border (${expected}), got ${shellStyle.borderTopColor}.`);
    }
  });
}

function ComposerFixture({
  initialValue = '',
  value: controlledValue,
  onValueChange: onValueChangeProp,
  onSubmit: onSubmitProp,
  ...props
}) {
  const [value, setValue] = React.useState(controlledValue ?? initialValue);
  const [lastAction, setLastAction] = React.useState('아직 제출하지 않음');
  React.useEffect(() => {
    if (controlledValue !== undefined) setValue(controlledValue);
  }, [controlledValue]);
  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)', width: '100%', minWidth: 0 }}>
      <MessageComposer
        {...props}
        value={value}
        onValueChange={(nextValue, event) => {
          setValue(nextValue);
          onValueChangeProp?.(nextValue, event);
        }}
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
  parameters: {
    ...storyDescription(
      '약 720px에서 attachment preview, leading action, autosize draft, trailing action과 primary send를 하나의 elevated shell로 보여 줍니다. slot 이름은 위치만 표현하며 특정 provider나 product tool을 API에 고정하지 않습니다. Controls는 이 개요의 실제 composer props에 연결됩니다.',
    ),
    controls: { disable: false },
  },
  args: {
    value: '업로드한 회의록에서 결정 사항을 세 문장으로 요약해 주세요.',
    state: 'idle',
    submitMode: 'enter',
    readOnly: false,
    disabled: false,
    disabledReason: '현재 연결을 확인할 수 없어 메시지를 보낼 수 없습니다.',
    formLabel: '메시지 작성',
    inputLabel: '메시지 입력',
    placeholder: '메시지를 입력하세요.',
    description: 'Enter로 보내고 Shift+Enter로 줄을 바꿉니다.',
    maxLength: 300,
    minRows: 1,
    maxRows: 6,
    submitLabel: '메시지 보내기',
    stopLabel: '응답 중지',
  },
  render: (args) => (
    <main style={{ width: '100%', maxWidth: 720 }}>
      <ComposerFixture
        {...args}
        disabledReason={args.disabled ? (args.disabledReason || '현재 메시지를 작성할 수 없습니다.') : undefined}
        onStop={args.onStop ?? (() => {})}
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
    const description = form?.querySelector('[data-composer-description]');
    const counter = form?.querySelector('[data-composer-counter]');
    if (!form || !shell || !attachments || !row || !leading || !textarea || !trailing || !primary) {
      throw new Error('MessageComposer overview anatomy is incomplete.');
    }
    if (form.getAttribute('aria-label') !== '메시지 작성'
      || textarea.getAttribute('aria-label') !== null
      || !textarea.labels?.length
      || textarea.labels[0].textContent !== '메시지 입력') {
      throw new Error('The composer form and textarea must expose their default accessible names.');
    }
    const describedBy = textarea.getAttribute('aria-describedby')?.split(/\s+/) ?? [];
    if (!description?.id || !counter?.id
      || !describedBy.includes(description.id) || !describedBy.includes(counter.id)) {
      throw new Error('Visible guidance and the character counter must describe the textarea.');
    }
    if (textarea.getAttribute('enterkeyhint') !== 'send') {
      throw new Error('Enter submit mode must advertise a send enter-key hint.');
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
    const idleShadow = getComputedStyle(shell).boxShadow;
    await userEvent.click(textarea);
    await expectNeutralShellFocus(shell, textarea, idleShadow);
    const send = primary.querySelector('button[type="submit"]');
    if (!send || send.disabled) throw new Error('A non-empty controlled draft must enable the send action.');
  },
};

export const CompactDensity = {
  name: '반응형 · 조밀한 밀도',
  parameters: storyDescription(
    '360px의 좁은 대화 열에서 compact 작성기를 확인합니다. 텍스트 입력 영역, 보조 동작, 기본 보내기 동작의 읽기 순서와 최소 조작 영역은 유지하고 동작은 겹치지 않아야 합니다.',
  ),
  render: () => (
    <main data-compact-composer style={{ width: 360, maxWidth: '100%', minWidth: 0 }}>
      <ComposerFixture
        density="compact"
        initialValue="간단한 초안"
        formLabel="조밀한 메시지 작성"
        inputLabel="메시지"
        placeholder="메시지를 작성하세요"
        minRows={1}
        maxRows={2}
        leadingActions={<AddFileAction />}
        trailingActions={<MoreOptionsAction />}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-compact-composer]');
    const composer = fixture?.querySelector('.lk-message-composer');
    const shell = composer?.querySelector('[data-composer-shell]');
    const row = composer?.querySelector('[data-composer-control-row]');
    const input = composer?.querySelector('[data-composer-input]');
    const leading = composer?.querySelector('[data-composer-leading-actions]');
    const trailing = composer?.querySelector('[data-composer-trailing-actions]');
    const primary = composer?.querySelector('[data-composer-primary-action]');
    const actions = row ? Array.from(row.querySelectorAll('button')) : [];
    const send = primary?.querySelector('button[type="submit"]');
    if (!fixture || !composer || !shell || !row || !input || !leading || !trailing || !primary || !send || actions.length !== 3) {
      throw new Error('The compact composer fixture is incomplete.');
    }
    const host = fixture.parentElement;
    const hostStyle = host ? getComputedStyle(host) : null;
    const availableWidth = host
      ? host.clientWidth - (Number.parseFloat(hostStyle.paddingLeft) || 0) - (Number.parseFloat(hostStyle.paddingRight) || 0)
      : 360;
    if (Math.abs(fixture.getBoundingClientRect().width - Math.min(360, availableWidth)) > 1) {
      throw new Error('The compact composer fixture must fill the available container up to 360px.');
    }
    if (composer.dataset.density !== 'compact') {
      throw new Error('MessageComposer must expose data-density="compact".');
    }
    const hasRadius = (element, expected) => {
      const style = getComputedStyle(element);
      return [
        style.borderTopLeftRadius,
        style.borderTopRightRadius,
        style.borderBottomRightRadius,
        style.borderBottomLeftRadius,
      ].every((radius) => Math.abs(Number.parseFloat(radius) - expected) <= 0.5);
    };
    if (!hasRadius(shell, 12)) {
      throw new Error('Compact MessageComposer must retain a 12px shell radius.');
    }
    if (Math.abs(input.getBoundingClientRect().height - 32) > 1) {
      throw new Error('Compact MessageComposer starts its one-row textarea at 32px.');
    }
    if (fixture.scrollWidth > fixture.clientWidth + 1 || composer.scrollWidth > composer.clientWidth + 1) {
      throw new Error('Compact MessageComposer must not create horizontal overflow.');
    }
    if (!(input.compareDocumentPosition(leading) & Node.DOCUMENT_POSITION_FOLLOWING)
      || !(leading.compareDocumentPosition(trailing) & Node.DOCUMENT_POSITION_FOLLOWING)
      || !(trailing.compareDocumentPosition(primary) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      throw new Error('Compact composer controls must preserve input, utilities, and primary action DOM order.');
    }
    for (let index = 0; index < actions.length; index += 1) {
      const current = actions[index].getBoundingClientRect();
      if (current.width < 24 || current.height < 24) {
        throw new Error('Compact MessageComposer actions must retain a minimum 24px target.');
      }
      if (Math.abs(current.width - 32) > 1 || Math.abs(current.height - 32) > 1 || !hasRadius(actions[index], 8)) {
        throw new Error('Compact MessageComposer utility and primary actions must keep 32px targets with an 8px radius.');
      }
      for (const candidate of actions.slice(index + 1)) {
        const next = candidate.getBoundingClientRect();
        const overlaps = current.left < next.right - 0.5
          && current.right > next.left + 0.5
          && current.top < next.bottom - 0.5
          && current.bottom > next.top + 0.5;
        if (overlaps) throw new Error('Compact MessageComposer actions must not overlap.');
      }
    }
    const idleShadow = getComputedStyle(shell).boxShadow;
    input.focus();
    await expectNeutralShellFocus(shell, input, idleShadow);
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await waitFor(() => {
      if (document.activeElement !== send || !send.matches(':focus-visible')) {
        throw new Error('The compact send action must receive the keyboard focus ring.');
      }
    });
    const shellRect = shell.getBoundingClientRect();
    const sendRect = send.getBoundingClientRect();
    const sendStyle = getComputedStyle(send);
    const outlineWidth = Number.parseFloat(sendStyle.outlineWidth) || 0;
    const outlineOffset = Math.max(0, Number.parseFloat(sendStyle.outlineOffset) || 0);
    const focusOutset = outlineWidth + outlineOffset;
    const rightInset = shellRect.right - sendRect.right;
    const bottomInset = shellRect.bottom - sendRect.bottom;
    if (outlineWidth < 2 || sendStyle.outlineStyle === 'none') {
      throw new Error('The compact send action must keep its visible focus outline.');
    }
    if (rightInset <= 0 || bottomInset <= 0) {
      throw new Error('The compact send action must retain positive right and bottom shell insets.');
    }
    if (sendRect.right + focusOutset > shellRect.right + 0.5
      || sendRect.bottom + focusOutset > shellRect.bottom + 0.5) {
      throw new Error('The compact send focus outline must clear the shell edge without clipping or overlap.');
    }
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
    'idle, submitting, streaming, stopping과 read-only·disabled를 비교합니다. readOnly는 내용을 읽고 복사할 수 있도록 focus를 유지하지만 제출은 막습니다. disabled는 보이는 disabledReason을 textarea에 연결하고 slot action까지 비활성화합니다. non-idle은 성공이나 실패가 아닌 neutral phase이며, stopping에서는 중복 stop 요청을 막습니다.',
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
    const readOnlyForm = [...canvasElement.querySelectorAll('form[data-state="idle"]')]
      .find((candidate) => candidate.querySelector('textarea[readonly]'));
    const readOnlyInput = readOnlyForm?.querySelector('textarea');
    const readOnlySubmit = readOnlyForm?.querySelector('button[type="submit"]');
    if (!readOnlyInput || readOnlyInput.disabled || !readOnlySubmit?.disabled) {
      throw new Error('Read-only must preserve a focusable textarea while preventing submission.');
    }
    readOnlyInput.focus();
    if (document.activeElement !== readOnlyInput) {
      throw new Error('Read-only content must remain keyboard focusable for review and copy.');
    }
    const stopping = canvasElement.querySelector('form[data-state="stopping"]');
    const stoppingButton = stopping?.querySelector('button[aria-label="응답 중지"]');
    if (stoppingButton?.getAttribute('aria-disabled') !== 'true') {
      throw new Error('Stopping must prevent a duplicate stop request.');
    }
    /* native disabled는 방금 stop을 누른 사용자의 초점을 <body>로 떨어뜨린다. */
    if (stoppingButton.disabled) {
      throw new Error('Stopping must refuse the duplicate request without removing the control from the tab order.');
    }
    stoppingButton.focus();
    if (document.activeElement !== stoppingButton) {
      throw new Error('A stopping composer must keep its stop control focusable.');
    }
    stoppingButton.blur();
    readOnlyInput.focus();
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
    const idleShadow = style.boxShadow;
    await userEvent.click(input);
    await expectNeutralShellFocus(shell, input, idleShadow);
  },
};

function KeyboardFixture() {
  const [logs, setLogs] = React.useState({ enter: [], modifier: [], button: [], stop: 0 });
  const append = (key, reason) => setLogs((current) => ({ ...current, [key]: [...current[key], reason] }));
  return (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 760 }}>
      <section data-keyboard-case="enter" data-log={logs.enter.join(',')}>
        <ComposerFixture formLabel="Enter 제출 메시지 작성" initialValue="Enter 제출" submitMode="enter" onSubmit={(_, reason) => append('enter', reason)} />
      </section>
      <section data-keyboard-case="modifier" data-log={logs.modifier.join(',')}>
        <ComposerFixture formLabel="수정자 Enter 제출 메시지 작성" initialValue="수정자 제출" submitMode="modifier-enter" onSubmit={(_, reason) => append('modifier', reason)} />
      </section>
      <section data-keyboard-case="button" data-log={logs.button.join(',')}>
        <ComposerFixture formLabel="버튼 제출 메시지 작성" initialValue="버튼 제출" submitMode="button-only" onSubmit={(_, reason) => append('button', reason)} />
      </section>
      <section data-keyboard-case="stop" data-stop-count={logs.stop}>
        <MessageComposer
          value="현재 응답 생성을 중지합니다."
          onValueChange={() => {}}
          onSubmit={() => {}}
          state="streaming"
          formLabel="스트리밍 응답 메시지 작성"
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
    altKey: init.altKey,
    metaKey: init.metaKey,
    isComposing: init.isComposing,
  }));
}

export const KeyboardAndImeContract = {
  name: '상호작용 · 조합 입력과 제출 방식',
  parameters: storyDescription(
    '제품의 canonical keyboard 계약입니다. enter는 Enter로 제출하고 Shift+Enter로 줄을 바꾸며, modifier-enter는 Alt가 없는 Ctrl+Enter 또는 Meta+Enter로만 제출합니다. Ctrl+Alt/AltGr 조합은 제출하지 않습니다. button-only는 Enter를 항상 줄바꿈으로 남기고 이름 있는 보내기 버튼만 사용합니다. 모든 모드는 IME 조합 확정 Enter를 제출하지 않습니다. streaming 중지는 이름 있는 버튼으로만 요청하며 Escape shortcut을 만들지 않습니다. submit callback은 reason을 전달하고 value clear나 transport 완료를 수행하지 않습니다.',
  ),
  render: () => <KeyboardFixture />,
  play: async ({ canvasElement }) => {
    const formLabels = Array.from(canvasElement.querySelectorAll('form')).map((form) => form.getAttribute('aria-label'));
    if (formLabels.length !== 4 || new Set(formLabels).size !== formLabels.length) {
      throw new Error('여러 composer를 비교하는 story는 각 form landmark에 고유한 이름을 제공해야 합니다.');
    }
    const enterCase = canvasElement.querySelector('[data-keyboard-case="enter"]');
    const enterInput = enterCase?.querySelector('textarea');
    if (!enterCase || !enterInput) throw new Error('Enter keyboard fixture is missing.');
    if (enterInput.getAttribute('enterkeyhint') !== 'send') {
      throw new Error('Enter mode must expose enterKeyHint="send" to software keyboards.');
    }
    enterInput.focus();
    enterInput.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true, data: '한' }));
    dispatchKey(enterInput, { key: 'Enter', code: 'Enter', isComposing: true });
    enterInput.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '한' }));
    await nextPaint();
    if (enterCase.dataset.log) throw new Error('IME confirmation Enter must not submit.');
    dispatchKey(enterInput, { key: 'Enter', code: 'Enter', shiftKey: true });
    await nextPaint();
    if (enterCase.dataset.log) throw new Error('Shift+Enter must remain a newline in Enter mode.');
    dispatchKey(enterInput, { key: 'Enter', code: 'Enter' });
    await nextPaint();
    if (enterCase.dataset.log !== 'enter') throw new Error('Enter mode must report the enter reason.');
    if (document.activeElement !== enterInput || enterInput.value !== 'Enter 제출') {
      throw new Error('Keyboard submit must preserve the controlled value and textarea focus.');
    }

    const modifierCase = canvasElement.querySelector('[data-keyboard-case="modifier"]');
    const modifierInput = modifierCase?.querySelector('textarea');
    if (!modifierCase || !modifierInput) throw new Error('Modifier keyboard fixture is missing.');
    if (modifierInput.getAttribute('enterkeyhint') !== 'enter') {
      throw new Error('Modifier mode must keep the software keyboard Enter affordance.');
    }
    modifierInput.focus();
    dispatchKey(modifierInput, { key: 'Enter', code: 'Enter' });
    await nextPaint();
    if (modifierCase.dataset.log) throw new Error('Plain Enter must remain a newline in modifier mode.');
    dispatchKey(modifierInput, { key: 'Enter', code: 'Enter', ctrlKey: true, altKey: true });
    await nextPaint();
    if (modifierCase.dataset.log) throw new Error('Ctrl+Alt/AltGr+Enter must not submit in modifier mode.');
    dispatchKey(modifierInput, { key: 'Enter', code: 'Enter', ctrlKey: true });
    await nextPaint();
    if (modifierCase.dataset.log !== 'modifier-enter') {
      throw new Error('Modifier mode must report the modifier-enter reason.');
    }
    dispatchKey(modifierInput, { key: 'Enter', code: 'Enter', metaKey: true });
    await nextPaint();
    if (modifierCase.dataset.log !== 'modifier-enter,modifier-enter') {
      throw new Error('Meta+Enter must use the same modifier-enter submission reason.');
    }

    const buttonCase = canvasElement.querySelector('[data-keyboard-case="button"]');
    const buttonInput = buttonCase?.querySelector('textarea');
    const buttonSubmit = buttonCase?.querySelector('button[type="submit"]');
    if (!buttonCase || !buttonInput || !buttonSubmit) throw new Error('Button-only fixture is missing.');
    if (buttonInput.getAttribute('enterkeyhint') !== 'enter'
      || buttonSubmit.getAttribute('aria-label') !== '메시지 보내기') {
      throw new Error('Button-only mode must expose newline Enter and a named submit action.');
    }
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
    if (stopButton.type !== 'button' || stopButton.disabled) {
      throw new Error('Streaming must expose an enabled, non-submit stop action.');
    }
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

function LifecycleFocusFixture() {
  const [state, setState] = React.useState('streaming');
  const [value, setValue] = React.useState('');
  return (
    <main data-lifecycle-fixture style={{ width: '100%', maxWidth: 720 }}>
      <MessageComposer
        value={value}
        onValueChange={setValue}
        onSubmit={() => {}}
        state={state}
        formLabel="중지 흐름 메시지 작성"
        onStop={() => {
          setState('stopping');
          // 제품이 소유하는 transport가 취소를 확정하는 순간을 흉내 낸다.
          window.setTimeout(() => setState('idle'), 60);
        }}
      />
    </main>
  );
}

export const LifecycleStatusAndFocusContract = {
  name: '상태 알림과 중지 초점 계약',
  tags: ['!dev'],
  render: () => <LifecycleFocusFixture />,
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    const form = canvasElement.querySelector('.lk-message-composer');
    const live = form?.querySelector('[data-composer-live-status]');
    const textarea = form?.querySelector('[data-composer-input]');
    const stop = form?.querySelector('button[aria-label="응답 중지"]');
    if (!form || !live || !textarea || !stop) throw new Error('중지 흐름 fixture가 불완전합니다.');
    if (live.getAttribute('role') !== 'status' || live.getAttribute('aria-live') !== 'polite') {
      throw new Error('상태 문구는 polite status region으로 전달해야 합니다.');
    }
    if (live.textContent !== '응답을 생성하는 중입니다.') {
      throw new Error('live region은 현재 lifecycle 문구를 담아야 합니다.');
    }

    stop.focus();
    if (ownerDocument.activeElement !== stop) throw new Error('streaming stop 컨트롤은 초점을 받을 수 있어야 합니다.');
    await userEvent.click(stop);
    await waitFor(() => {
      if (form.dataset.state !== 'stopping') throw new Error('stop 요청은 stopping 상태로 이어져야 합니다.');
    });
    if (stop.getAttribute('aria-disabled') !== 'true' || stop.disabled) {
      throw new Error('중복 stop 요청은 native disabled가 아니라 aria-disabled로 막아야 합니다.');
    }
    if (ownerDocument.activeElement !== stop) {
      throw new Error('중지 요청 중에도 초점은 stop 컨트롤에 남아 있어야 합니다.');
    }
    if (live.textContent !== '응답 중지를 요청하는 중입니다.') {
      throw new Error('상태 문구는 새 region을 mount하지 않고 같은 region에서 교체되어야 합니다.');
    }

    await waitFor(() => {
      if (form.dataset.state !== 'idle') throw new Error('transport가 끝나면 idle로 돌아가야 합니다.');
    });
    await waitFor(() => {
      if (ownerDocument.activeElement !== textarea) {
        throw new Error('요청이 끝나 send로 바뀔 때 초점이 사라지지 않고 입력으로 돌아가야 합니다.');
      }
    });
    if (!form.contains(live) || live.textContent !== '') {
      throw new Error('idle에서도 같은 live region이 비어 있는 상태로 남아 있어야 합니다.');
    }
    textarea.blur();
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

function InlineLayoutFixture() {
  const [value, setValue] = React.useState('');
  const [narrow, setNarrow] = React.useState(false);
  const [attachment, setAttachment] = React.useState(false);
  const [utilities, setUtilities] = React.useState(false);
  return (
    <main style={{ width: narrow ? 320 : 720, maxWidth: '100%', display: 'grid', gap: 'var(--space-4)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <Button size="sm" onClick={() => setNarrow(!narrow)}>폭 전환</Button>
        <Button size="sm" onClick={() => setAttachment(!attachment)}>첨부 전환</Button>
        <Button size="sm" onClick={() => setUtilities(!utilities)}>추가 동작 전환</Button>
        <Button size="sm" onClick={() => setValue(value ? '' : '긴 초안은 입력 폭과 내용에 맞춰 자동 확장합니다. '.repeat(12))}>긴 초안 전환</Button>
      </div>
      <section aria-label="한 행 작성 비교">
        <p>inline · 빈 초안 약 50px · 입력 16px · 보내기/중지 44px</p>
        <MessageComposer layout="inline" density="compact" value={value} onValueChange={setValue}
          onSubmit={() => {}} minRows={1} maxRows={4} submitMode="button-only"
          placeholder="무엇을 도와드릴까요?" formLabel="한 행 메시지 작성"
          attachments={attachment ? <Chip>제품 자료.pdf</Chip> : undefined}
          leadingActions={utilities ? <IconButton label="파일 첨부" style={{ minWidth: 44, minHeight: 44 }}><Icon name="attachment" size={20} /></IconButton> : undefined}
          trailingActions={utilities ? <IconButton label="음성 입력" style={{ minWidth: 44, minHeight: 44 }}><Icon name="microphone" size={20} /></IconButton> : undefined}
        />
      </section>
      <section aria-label="기본 구조 비교">
        <p>기본 stacked · 기존 compact 구조 · 같은 초안</p>
        <MessageComposer density="compact" value={value} onValueChange={setValue} onSubmit={() => {}}
          minRows={1} maxRows={4} submitMode="button-only" formLabel="기본 메시지 작성" />
      </section>
    </main>
  );
}

export const InlineLayout = {
  name: '상호작용 · 한 행 작성과 구조 확장',
  parameters: storyDescription('layout=inline을 명시한 단순 작성은 약 50px 한 행입니다. 긴 초안/폭 변경은 자동 높이, 첨부·추가 동작은 기존 full-width action band로 확장합니다. 기본 stacked는 유지하며 inline primary target은 항상 44px입니다. Claude 마케팅 CTA는 실사용 홈 근거가 아닙니다.'),
  render: () => <InlineLayoutFixture />,
  play: async ({ canvasElement }) => {
    const form = canvasElement.querySelector('form[aria-label="한 행 메시지 작성"]');
    const textarea = form.querySelector('textarea');
    const shell = form.querySelector('[data-composer-shell]');
    const send = form.querySelector('button[aria-label="메시지 보내기"]');
    await waitFor(() => {
      if (form.dataset.composerLayout !== 'inline' || shell.getBoundingClientRect().height > 52) throw new Error('빈 초안은 한 행 약 50px shell입니다.');
    });
    if (send.getBoundingClientRect().width < 44 || send.getBoundingClientRect().height < 44) throw new Error('inline primary touch target은 44px 이상입니다.');
    if (parseFloat(canvasElement.ownerDocument.defaultView.getComputedStyle(textarea).fontSize) < 16) throw new Error('입력은 16px 이상입니다.');
    const initialHeight = textarea.getBoundingClientRect().height;
    await userEvent.type(textarea, '짧은 초안');
    if (form.dataset.composerLayout !== 'inline') throw new Error('짧은 초안은 inline을 유지합니다.');
    await userEvent.click([...canvasElement.querySelectorAll('button')].find((button) => button.textContent === '긴 초안 전환'));
    // The existing short draft is cleared first, then the long draft is inserted.
    await userEvent.click([...canvasElement.querySelectorAll('button')].find((button) => button.textContent === '긴 초안 전환'));
    await waitFor(() => {
      if (textarea.getBoundingClientRect().height <= initialHeight) throw new Error('긴 초안은 입력 높이가 확장됩니다.');
    });
    const draft = textarea.value;
    await userEvent.click([...canvasElement.querySelectorAll('button')].find((button) => button.textContent === '첨부 전환'));
    await waitFor(() => {
      if (form.dataset.composerLayout !== 'stacked' || !form.querySelector('[data-composer-attachments]')) throw new Error('첨부는 기존 stacked anatomy로 확장됩니다.');
    });
    if (form.querySelector('textarea') !== textarea || textarea.value !== draft) throw new Error('구조 확장에도 입력 DOM과 초안을 유지합니다.');
    if (send.getBoundingClientRect().width < 44 || send.getBoundingClientRect().height < 44) throw new Error('확장 후에도 inline target을 유지합니다.');
    await userEvent.click([...canvasElement.querySelectorAll('button')].find((button) => button.textContent === '첨부 전환'));
    await userEvent.click([...canvasElement.querySelectorAll('button')].find((button) => button.textContent === '긴 초안 전환'));
    await waitFor(() => {
      if (form.dataset.composerLayout !== 'inline' || shell.getBoundingClientRect().height > 52) throw new Error('초안을 비우면 한 행 높이로 돌아갑니다.');
    });
  },
};
