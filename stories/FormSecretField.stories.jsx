import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Button, SecretField } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Selection and Input/Secret Field',
  tags: ['autodocs'],
  component: SecretField,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-selection-and-input-secret-field--reveal-and-copy',
      eyebrow: 'Product / Secret Field',
      title: '비밀 값 필드는 민감한 값을 제한적으로 확인하고 복사하게 합니다',
      description:
        'API key·token처럼 읽기 전용 값을 잠시 표시하고 복사한 뒤 다시 숨길 때 적합합니다. 사용자가 새 비밀번호를 입력하거나 수정하는 폼에는 Secret Field 대신 Password Input을 사용하세요.',
    },
    docs: {
      description: {
        component: '인증 값을 제한적으로 표시하고 복사하며 자동으로 다시 숨기는 읽기 전용 필드 패턴입니다.',
      },
    },
  },
};

export default meta;

export const RevealAndCopy = {
  name: '개요',
  parameters: storyDescription(
    '마스킹된 access token을 잠시 표시하고 복사하는 기본 상호작용입니다. 보기·숨기기 action 이름과 input type이 현재 상태를 정확히 반영하는지 확인하세요.',
  ),
  render: () => <SecretField label="Access token" value="lk_live_8f21d0c9" revealDurationMs={10000} style={{ maxWidth: 620 }} />,
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input[readonly]');
    const reveal = canvasElement.querySelector('button[aria-label="Access token 보기"]');
    const copy = canvasElement.querySelector('button[aria-label="Access token 복사"]');
    if (!input || !reveal || !copy) throw new Error('SecretField must expose contextual reveal and copy actions.');

    reveal.click();
    await new Promise((resolve) => setTimeout(resolve, 30));
    if (input.type !== 'text' || !canvasElement.querySelector('button[aria-label="Access token 숨기기"]')) {
      throw new Error('Reveal must expose the value and rename the action to the current command.');
    }

    canvasElement.querySelector('button[aria-label="Access token 숨기기"]')?.click();
    await new Promise((resolve) => setTimeout(resolve, 30));
    if (input.type !== 'password') throw new Error('Hide must restore the masked input type.');
  },
};

export const DisabledAndRevealPolicy = {
  name: '변형·상태 · 비활성과 값 표시 정책',
  parameters: storyDescription(
    '복사 전용으로 reveal을 금지한 값과 전체 비활성 값을 비교합니다. 정책으로 숨긴 action과 사용할 수 없는 필드가 서로 다른 제한으로 읽히는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 620 }}>
      <SecretField label="복사 전용 secret" value="lk_live_8f21d0c9" revealable={false} defaultRevealed />
      <SecretField label="사용할 수 없는 secret" value="lk_live_disabled" defaultRevealed disabled />
    </main>
  ),
  play: async ({ canvasElement }) => {
    await new Promise((resolve) => setTimeout(resolve, 30));
    const inputs = canvasElement.querySelectorAll('input');
    if (inputs.length !== 2 || [...inputs].some((input) => input.type !== 'password')) {
      throw new Error('Removing reveal capability or disabling the field must leave the value masked.');
    }
    const disabledInput = inputs[1];
    if (!disabledInput.disabled || !canvasElement.querySelector('button[aria-label="사용할 수 없는 secret 복사"]:disabled')) {
      throw new Error('Disabled state must remove both the input and actions from interaction.');
    }
  },
};

export const ValidationAndNarrowWidth = {
  name: '반응형 · 좁은 폭의 오류와 구분된 동작',
  parameters: storyDescription(
    '260px 폭에서 만료 오류, 보조 key, 긴 token을 함께 보여줍니다. 오류·helper·보기·복사 동작이 줄바꿈 뒤에도 각 필드에 정확히 연결되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: 260, maxWidth: '100%' }}>
      <SecretField label="Primary API 키" value="lk_primary_8f21d0c9_long_value" error="이 키는 만료되었습니다. 새 키를 발급해 주세요." />
      <SecretField
        label={<span>Backup API key <small style={{ color: 'var(--color-semantic-label-neutral)', fontWeight: 'var(--fw-medium)' }}>보조</small></span>}
        actionContext="Backup API key"
        value="lk_backup_5a42f7d1_long_value"
        helper="배포 자동화에서 사용하는 읽기 전용 key입니다."
      />
      <SecretField
        label={<span>Emergency key <small style={{ color: 'var(--color-semantic-status-negative-text)', fontWeight: 'var(--fw-medium)' }}>긴급</small></span>}
        actionContext={false}
        revealLabel="긴급 key 값 보기"
        hideLabel="긴급 key 값 숨기기"
        copyLabel="긴급 key 복사"
        copiedLabel="긴급 key 복사됨"
        copyErrorLabel="긴급 key 복사 실패"
        value="lk_emergency_d3c7a1_long_value"
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll('input[readonly]');
    if (inputs.length !== 3 || inputs[0].getAttribute('aria-invalid') !== 'true') {
      throw new Error('The read-only inputs and invalid state must reach the native controls.');
    }
    if (!canvasElement.querySelector('button[aria-label="Primary API 키 보기"]') || !canvasElement.querySelector('button[aria-label="Backup API key 복사"]') || !canvasElement.querySelector('button[aria-label="긴급 key 복사"]')) {
      throw new Error('Each secret action must include its simple label or explicit ReactNode action context in the accessible name.');
    }
  },
};

export const ClipboardFeedback = {
  name: '시나리오 · 복사 성공과 실패 알림',
  parameters: storyDescription(
    '클립보드 복사 성공과 차단 결과를 나란히 비교합니다. 짧은 결과 문구가 해당 Secret Field에 귀속되고 성공·실패가 색만으로 구분되지 않는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 620 }}>
      <section data-testid="clipboard-success">
        <SecretField
          label="Deploy token"
          value="lk_deploy_success"
          revealable={false}
          copiedLabel="복사 완료"
        />
      </section>
      <section data-testid="clipboard-error">
        <SecretField
          label="Recovery token"
          value="lk_recovery_failure"
          revealable={false}
          copyErrorLabel="복사 차단"
        />
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const successField = canvasElement.querySelector('[data-testid="clipboard-success"]');
    const errorField = canvasElement.querySelector('[data-testid="clipboard-error"]');
    const successCopy = successField?.querySelector('button[aria-label="Deploy token 복사"]');
    const errorCopy = errorField?.querySelector('button[aria-label="Recovery token 복사"]');
    if (!successField || !errorField || !successCopy || !errorCopy) {
      throw new Error('Clipboard feedback fixture must expose contextual copy action names.');
    }

    const idleSuccessIcon = successCopy.querySelector('svg[aria-hidden="true"]')?.innerHTML;
    const idleErrorIcon = errorCopy.querySelector('svg[aria-hidden="true"]')?.innerHTML;
    const view = canvasElement.ownerDocument.defaultView;
    const navigatorObject = view.navigator;
    const originalClipboardDescriptor = Object.getOwnPropertyDescriptor(navigatorObject, 'clipboard');
    const attempts = [];
    let outcome = 'success';

    Object.defineProperty(navigatorObject, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (value) => {
          attempts.push({ outcome, value });
          if (outcome === 'error') throw new Error('Clipboard permission denied by test fixture.');
        },
      },
    });

    try {
      await userEvent.click(successCopy);
      await waitFor(() => {
        const copiedButton = successField.querySelector('button[aria-label="Deploy token 복사 완료"]');
        const liveStatus = successField.querySelector('[role="status"][aria-live="polite"]');
        const icon = copiedButton?.querySelector('svg[aria-hidden="true"]');
        if (!copiedButton || liveStatus?.textContent?.trim() !== 'Deploy token 복사 완료') {
          throw new Error('copiedLabel must update both the accessible action name and polite live status.');
        }
        if (copiedButton.style.color !== 'var(--color-semantic-status-positive)' || !icon) {
          throw new Error('Successful copy feedback must use the positive icon tone.');
        }
        if (view.getComputedStyle(icon).color !== view.getComputedStyle(copiedButton).color || icon.innerHTML === idleSuccessIcon) {
          throw new Error('The success icon must inherit the positive action tone and replace the idle copy icon.');
        }
      });
      if (attempts.length !== 1 || attempts[0].outcome !== 'success' || attempts[0].value !== 'lk_deploy_success') {
        throw new Error('Successful copy must pass the exact secret value to navigator.clipboard.writeText.');
      }

      outcome = 'error';
      await userEvent.click(errorCopy);
      await waitFor(() => {
        const failedButton = errorField.querySelector('button[aria-label="Recovery token 복사 차단"]');
        const liveStatus = errorField.querySelector('[role="status"][aria-live="polite"]');
        const icon = failedButton?.querySelector('svg[aria-hidden="true"]');
        if (!failedButton || liveStatus?.textContent?.trim() !== 'Recovery token 복사 차단') {
          throw new Error('copyErrorLabel must update both the accessible action name and polite live status.');
        }
        if (failedButton.style.color !== 'var(--color-semantic-status-negative)' || !icon) {
          throw new Error('Failed copy feedback must use the negative icon tone.');
        }
        if (view.getComputedStyle(icon).color !== view.getComputedStyle(failedButton).color || icon.innerHTML === idleErrorIcon) {
          throw new Error('The failure icon must inherit the negative action tone and replace the idle copy icon.');
        }
      });
      if (attempts.length !== 2 || attempts[1].outcome !== 'error' || attempts[1].value !== 'lk_recovery_failure') {
        throw new Error('Failed copy must still attempt the exact secret value through navigator.clipboard.writeText.');
      }
    } finally {
      if (originalClipboardDescriptor) {
        Object.defineProperty(navigatorObject, 'clipboard', originalClipboardDescriptor);
      } else {
        delete navigatorObject.clipboard;
      }
    }
  },
};

export const ControlledAutoHide = {
  name: '상호작용 · 외부 제어 값 자동 숨김',
  parameters: storyDescription(
    '외부 제어로 token을 표시한 뒤 1.2초 후 자동으로 다시 마스킹합니다. controlled state와 내부 timer가 한 번만 상태를 되돌리고 현재 결과가 보이는지 확인하세요.',
  ),
  render: function Example() {
    const [revealed, setRevealed] = React.useState(false);
    return (
      <div style={{ display: 'grid', gap: 'var(--space-3)', maxWidth: 560 }}>
        <Button variant="outlined" color="assistive" onClick={() => setRevealed(true)}>외부에서 값 보기</Button>
        <SecretField label="Controlled access token" value="lk_live_8f21d0c9" revealed={revealed} onRevealChange={setRevealed} revealDurationMs={1200} />
        <output style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)' }}>revealed: {String(revealed)}</output>
      </div>
    );
  },
};
