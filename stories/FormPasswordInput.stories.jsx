import { userEvent, waitFor } from 'storybook/test';
import { PasswordInput } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Selection and Input/Password Input',
  tags: ['autodocs'],
  component: PasswordInput,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-selection-and-input-password-input--password-input-overview',
      eyebrow: 'Core / Password Input',
      title: '비밀번호 입력은 민감한 값을 기본적으로 가리고 필요할 때만 확인하게 합니다',
      description:
        '사용자가 직접 비밀번호를 작성하는 로그인과 계정 설정에 사용하세요. 이미 발급된 비밀값을 읽거나 복사하는 화면은 Secret Field가 더 적합합니다.',
    },
  },
};

export default meta;

export const PasswordInputOverview = {
  name: '개요',
  parameters: storyDescription(
    '라벨과 설명은 입력 목적을 알리고, 보기 버튼은 현재 필드와 다음 행동을 함께 읽습니다.',
  ),
  render: () => (
    <main style={{ maxWidth: 520 }}>
      <PasswordInput label="비밀번호" helper="8자 이상으로 입력하세요." defaultValue="design-system" />
    </main>
  ),
};

export const PasswordInputStates = {
  name: '상태와 좁은 너비',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: 280, maxWidth: '100%' }}>
      <PasswordInput label="오류" defaultValue="short" error="비밀번호 길이를 확인하세요." />
      <PasswordInput label="완료" defaultValue="valid-password" status="positive" helper="사용할 수 있는 비밀번호입니다." />
      <PasswordInput label="읽기 전용" defaultValue="readonly" readOnly />
      <PasswordInput label="비활성" defaultValue="disabled" disabled />
    </main>
  ),
};

export const PasswordRevealContract = {
  name: '보기 버튼 계약',
  tags: ['!dev'],
  render: () => <PasswordInput label="계정 비밀번호" defaultValue="secret-value" />,
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    const button = canvasElement.querySelector('button[aria-label="계정 비밀번호 보기"]');
    if (!input || !button || input.type !== 'password') throw new Error('The masked field and contextual reveal action are required.');
    await userEvent.click(button);
    if (input.type !== 'text' || !canvasElement.querySelector('button[aria-label="계정 비밀번호 숨기기"]')) {
      throw new Error('The reveal action must expose the value and rename itself to the next action.');
    }
  },
};

export const PasswordAutofillContract = {
  name: '자동완성·평문 보호 계약',
  tags: ['!dev'],
  render: () => (
    <form
      onSubmit={(event) => event.preventDefault()}
      style={{ display: 'grid', gap: 'var(--space-5)', width: 320, maxWidth: '100%' }}
    >
      <PasswordInput label="계정 비밀번호" defaultValue="secret-value" />
      <PasswordInput label="새 비밀번호" autoComplete="new-password" defaultValue="" />
    </form>
  ),
  play: async ({ canvasElement }) => {
    const [current, next] = Array.from(canvasElement.querySelectorAll('input'));
    if (!current || !next) throw new Error('The sign-in and new-password fields are required.');

    // WCAG 1.3.5 Identify Input Purpose / GOV.UK Password input.
    if (current.getAttribute('autocomplete') !== 'current-password') {
      throw new Error('A password field must default to autocomplete="current-password" so password managers can fill it.');
    }
    if (next.getAttribute('autocomplete') !== 'new-password') {
      throw new Error('The autoComplete prop must let a sign-up form switch to "new-password".');
    }
    for (const field of [current, next]) {
      if (field.spellcheck !== false
        || field.getAttribute('autocapitalize') !== 'off'
        || field.getAttribute('autocorrect') !== 'off') {
        throw new Error('A revealed password must never be sent to spellcheck / autocorrect services.');
      }
    }

    // A revealed value must not survive submission.
    const reveal = canvasElement.querySelector('button[aria-label="계정 비밀번호 보기"]');
    if (!reveal) throw new Error('The contextual reveal action is missing.');
    await userEvent.click(reveal);
    if (current.type !== 'text') throw new Error('The reveal action must expose the value.');
    const form = current.closest('form');
    if (form?.requestSubmit) form.requestSubmit();
    else form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await waitFor(() => {
      if (current.type !== 'password') {
        throw new Error('Submitting the owning form must re-mask a revealed password field.');
      }
    });

    // Caps Lock warning. `modifierCapsLock` is the only way to express a held
    // Caps Lock in a synthetic event; skip the assertion where the platform
    // cannot express it rather than failing on an untestable capability.
    const capsDown = new KeyboardEvent('keydown', { key: 'a', bubbles: true, modifierCapsLock: true });
    if (capsDown.getModifierState('CapsLock')) {
      current.focus();
      current.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      current.dispatchEvent(capsDown);
      await waitFor(() => {
        if (!canvasElement.textContent?.includes('Caps Lock이 켜져 있습니다.')) {
          throw new Error('A focused password field must warn while Caps Lock is on.');
        }
      });
      const announcer = canvasElement.querySelector('[role="status"][aria-live="polite"]');
      if (!announcer?.textContent?.includes('Caps Lock')) {
        throw new Error('The Caps Lock warning must also reach a persistent polite live region.');
      }
    }

    // Return to the named state: masked, no Caps Lock notice, nothing focused.
    current.dispatchEvent(new KeyboardEvent('keyup', { key: 'a', bubbles: true }));
    current.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    canvasElement.ownerDocument.activeElement?.blur?.();
    await waitFor(() => {
      if (canvasElement.textContent?.includes('Caps Lock이 켜져 있습니다.') || current.type !== 'password') {
        throw new Error('The Caps Lock notice must clear when the field loses focus.');
      }
    });
  },
};
