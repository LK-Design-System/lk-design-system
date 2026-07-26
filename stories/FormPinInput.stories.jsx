import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import {
  FormField,
  PinInput,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Selection and Input/Pin Input',
  tags: ['autodocs'],
  component: PinInput,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-selection-and-input-pin-input--code-input',
      eyebrow: 'Product / Pin Input',
      title: 'PIN 입력은 자릿수가 정해진 일회성 코드를 빠르게 완성하게 합니다',
      description:
        '인증·장치 연결처럼 길이가 고정된 짧은 숫자 코드를 입력할 때 적합합니다. 지속적으로 보관하는 비밀번호나 토큰에는 Pin Input 대신 Password Input 또는 Secret Field를 사용하세요.',
    },
    docs: {
      description: {
        component: '인증 코드처럼 자릿수가 정해진 값을 입력하는 PinInput 제품 확장 컴포넌트입니다.',
      },
    },
  },
};

export default meta;

export const CodeInput = {
  name: '개요',
  parameters: storyDescription(
    '6자리 인증 코드 중 일부가 입력된 상태입니다. 각 자릿수의 순서, 남은 입력 위치, 전체 필드의 접근 가능한 이름이 명확한지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 520 }}>
      <FormField label="인증 코드" helper="6자리 코드를 입력하세요.">
        <PinInput aria-label="인증 코드" defaultValue="1205" length={6} />
      </FormField>
    </main>
  ),
};

export const PinInputStates = {
  name: '마스킹·오류·비활성',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 520 }}>
      <FormField label="장치 PIN" helper="숫자 4자리">
        <PinInput aria-label="장치 PIN" defaultValue="1234" length={4} mask size="sm" />
      </FormField>
      <FormField label="인증 코드" error="코드가 일치하지 않습니다.">
        <PinInput aria-label="인증 코드" defaultValue="1205" length={6} invalid />
      </FormField>
      <FormField label="비활성 코드" helper="세션이 만료되었습니다.">
        <PinInput aria-label="비활성 코드" defaultValue="1205" length={6} disabled />
      </FormField>
    </main>
  ),
};

function PinInputContractExample() {
  const [completed, setCompleted] = React.useState('');
  return (
    <div data-testid="pin-contract" data-completed={completed}>
      <PinInput aria-label="인증 코드" length={6} onComplete={setCompleted} />
    </div>
  );
}

export const PinInputContract = {
  name: '코드 입력 계약',
  tags: ['!dev'],
  render: () => <PinInputContractExample />,
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const root = canvasElement.querySelector('[data-testid="pin-contract"]');
    const group = root?.querySelector('[role="group"]');
    const cells = Array.from(root?.querySelectorAll('input') ?? []);
    if (cells.length !== 6) throw new Error('PinInput must render one cell per digit.');
    if (group?.getAttribute('aria-label') !== '인증 코드') {
      throw new Error('PinInput must expose the group name it was given.');
    }

    cells.forEach((cell, index) => {
      // WHATWG autofill: without one-time-code, iOS/Android never offer the
      // SMS code, which is the whole point of an OTP field.
      if (cell.getAttribute('autocomplete') !== 'one-time-code') {
        throw new Error(`Cell ${index + 1} must default to autocomplete="one-time-code".`);
      }
      if (cell.getAttribute('inputmode') !== 'numeric') {
        throw new Error(`Cell ${index + 1} must request a numeric keypad for a numeric charset.`);
      }
      if (cell.getAttribute('aria-label') !== `인증 코드 ${index + 1}/6`) {
        throw new Error(`Cell ${index + 1} must announce its position and the total digit count.`);
      }
    });

    // Typing advances to the next cell.
    await userEvent.type(cells[0], '1');
    await waitFor(() => {
      if (cells[0].value !== '1' || doc.activeElement !== cells[1]) {
        throw new Error('Entering a digit must fill the cell and advance focus.');
      }
    });

    // Arrow / Home / End move between cells.
    await userEvent.keyboard('{ArrowLeft}');
    if (doc.activeElement !== cells[0]) throw new Error('ArrowLeft must step to the previous cell.');
    await userEvent.keyboard('{ArrowRight}');
    if (doc.activeElement !== cells[1]) throw new Error('ArrowRight must step to the next cell.');
    await userEvent.keyboard('{End}');
    if (doc.activeElement !== cells[5]) throw new Error('End must move to the last cell.');
    await userEvent.keyboard('{Home}');
    if (doc.activeElement !== cells[0]) throw new Error('Home must move to the first cell.');

    // A pasted (or platform-autofilled) code is distributed across the row.
    const paste = new Event('paste', { bubbles: true, cancelable: true });
    Object.defineProperty(paste, 'clipboardData', { value: { getData: () => '9 8 7 6 5 4' } });
    cells[0].dispatchEvent(paste);
    await waitFor(() => {
      if (cells.map((cell) => cell.value).join('') !== '987654') {
        throw new Error('A multi-character code must be distributed one character per cell.');
      }
    });
    if (root.dataset.completed !== '987654') {
      throw new Error('onComplete must fire with the finished code once every cell is filled.');
    }

    // Backspace clears in place, then steps back.
    cells[5].focus();
    await userEvent.keyboard('{Backspace}');
    if (cells[5].value !== '') throw new Error('Backspace must clear the current cell first.');
    await userEvent.keyboard('{Backspace}');
    await waitFor(() => {
      if (cells[4].value !== '' || doc.activeElement !== cells[4]) {
        throw new Error('Backspace on an empty cell must clear and focus the previous cell.');
      }
    });

    // Empty the row again so the story ends in its named state.
    for (let press = 0; press < 8; press += 1) await userEvent.keyboard('{Backspace}');

    // Characters outside the charset never reach a cell.
    await userEvent.type(cells[0], 'a');
    await waitFor(() => {
      if (cells.some((cell) => cell.value !== '')) {
        throw new Error('charset="numeric" must reject letters in every cell.');
      }
    });

    for (const cell of cells) cell.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    doc.activeElement?.blur?.();
  },
};
