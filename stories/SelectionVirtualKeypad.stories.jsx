import React from 'react';
import { userEvent } from 'storybook/test';
import { Input, VirtualKeypad } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Selection and Input/Virtual Keypad',
  component: VirtualKeypad,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-selection-and-input-virtual-keypad--virtual-keypad-overview',
      eyebrow: 'Product / Virtual Keypad',
      title: '가상 숫자 키패드는 장치 화면에서도 중간 입력을 잃지 않고 값을 완성하게 합니다',
      description:
        '운영체제 숫자 키보드를 사용할 수 없거나 제품이 직접 입력면을 제공해야 하는 키오스크·임베디드 흐름에 적합합니다. 일반 모바일·데스크톱 폼에서는 운영체제가 제공하는 숫자 키보드를 먼저 사용하세요.',
    },
    docs: {
      description: {
        component:
          '부분 문자열·소수점·부호와 확인 유효성을 분리하는 LK Product Extension 숫자 키패드입니다.',
      },
    },
  },
};

export default meta;

const CHANGE_LABELS = {
  digit: '숫자 입력',
  decimal: '소수점 입력',
  sign: '부호 전환',
  backspace: '한 자리 지우기',
  clear: '모두 지우기',
};

function valueError(value, min, max) {
  if (value === '' || value === '-' || value.endsWith('.')) return undefined;
  const number = Number(value);
  if (!Number.isFinite(number)) return '완성된 숫자를 입력하세요.';
  if (min !== undefined && number < min) return `${min} 이상 입력하세요.`;
  if (max !== undefined && number > max) return `${max} 이하 입력하세요.`;
  return undefined;
}

function KeypadFixture({
  id,
  label,
  helper,
  initialValue = '',
  min,
  max,
  disabled = false,
  confirmDisabled = false,
  dark = false,
  keypadProps = {},
  style,
  fixture,
}) {
  const [value, setValue] = React.useState(initialValue);
  const [confirmed, setConfirmed] = React.useState('');
  const [lastChange, setLastChange] = React.useState(null);
  const error = valueError(value, min, max);
  const descriptionId = `${id}-keypad-description`;
  const description = error ?? helper ?? '입력 중 문자열은 확인할 때까지 변환하거나 반올림하지 않습니다.';

  return (
    <section
      data-fixture={fixture}
      data-theme={dark ? 'dark' : undefined}
      style={{
        display: 'grid',
        gap: 'var(--space-4)',
        width: '100%',
        maxWidth: 360,
        padding: dark ? 'var(--space-4)' : 0,
        boxSizing: 'border-box',
        borderRadius: dark ? 'var(--radius-xl)' : undefined,
        background: dark ? 'var(--color-semantic-background-normal-normal)' : undefined,
        ...style,
      }}
    >
      <Input
        id={id}
        label={label}
        value={value}
        inputMode="none"
        enterKeyHint="done"
        disabled={disabled}
        invalid={error != null}
        status={error ? 'negative' : 'normal'}
        aria-describedby={descriptionId}
        onChange={(event) => setValue(event.target.value)}
      />
      <p
        id={descriptionId}
        role={error ? 'alert' : undefined}
        style={{
          margin: 0,
          color: error
            ? 'var(--color-semantic-status-negative-text)'
            : 'var(--color-semantic-label-alternative)',
          fontSize: 'var(--label1-size)',
          lineHeight: 'var(--label1-line)',
        }}
      >
        {description}
      </p>
      <VirtualKeypad
        aria-label={`${label} 숫자 키패드`}
        aria-describedby={descriptionId}
        targetId={id}
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        confirmDisabled={confirmDisabled}
        onChange={(nextValue, meta) => {
          setValue(nextValue);
          setLastChange(meta);
        }}
        onConfirm={(nextValue) => setConfirmed(nextValue)}
        {...keypadProps}
      />
      <output
        data-confirmed-value
        style={{
          color: 'var(--color-semantic-label-neutral)',
          fontSize: 'var(--label1-size)',
          lineHeight: 'var(--label1-line)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        확인된 값: {confirmed === '' ? '없음' : confirmed}
      </output>
      <span hidden data-current-value>현재 문자열: {value === '' ? '비어 있음' : value}</span>
      <span
        hidden
        data-last-change
        data-last-change-action={lastChange?.action}
        data-last-change-key={lastChange?.key}
      >
        마지막 입력: {lastChange ? `${CHANGE_LABELS[lastChange.action]} / ${lastChange.key}` : '없음'}
      </span>
    </section>
  );
}

function LandscapeExample() {
  const [value, setValue] = React.useState('12.5');
  const [confirmed, setConfirmed] = React.useState('');
  const atLengthLimit = value.length >= 5;
  const descriptionId = 'landscape-dwell-time-description';

  return (
    <main
      data-landscape-keypad
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(240px, 304px)',
        alignItems: 'center',
        gap: 'var(--space-4)',
        width: 568,
        maxWidth: '100%',
        height: 320,
        padding: 'var(--space-2)',
        boxSizing: 'border-box',
        overflow: 'hidden',
        border: 'var(--border-thin) solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--color-semantic-background-elevated-normal)',
      }}
    >
      <section style={{ display: 'grid', gap: 'var(--space-3)', minWidth: 0 }}>
        <Input
          id="landscape-dwell-time"
          label="정차 시간 (초)"
          value={value}
          inputMode="none"
          enterKeyHint="done"
          aria-describedby={descriptionId}
          onChange={(event) => setValue(event.target.value)}
        />
        <p id={descriptionId} data-landscape-limit style={{ margin: 0, color: 'var(--color-semantic-label-alternative)', lineHeight: 1.5 }}>
          {atLengthLimit
            ? '최대 5자리에 도달했습니다. 한 자리를 지우면 계속 입력할 수 있습니다.'
            : '0~60초 범위에서 최대 5자리까지 입력할 수 있습니다.'}
        </p>
        <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.5, fontVariantNumeric: 'tabular-nums' }}>
          확인된 값: <span data-landscape-confirmed>{confirmed || '없음'}</span>
        </p>
      </section>
      <VirtualKeypad
        aria-label="정차 시간 숫자 키패드"
        aria-describedby={descriptionId}
        targetId="landscape-dwell-time"
        value={value}
        mode="decimal"
        min={0}
        max={60}
        maxLength={5}
        onChange={setValue}
        onConfirm={setConfirmed}
        style={{ padding: 0, border: 0, borderRadius: 0, background: 'transparent' }}
      />
    </main>
  );
}

export const VirtualKeypadOverview = {
  name: '개요',
  parameters: storyDescription(
    '정수 입력을 007처럼 선행 0이 있는 문자열로 유지한 뒤 확인하는 기본 구성입니다. 대상 입력 필드에 이미 초점이 있다면 터치 키를 눌러도 초점이 이탈하지 않습니다.',
  ),
  render: () => (
    <main style={{ width: '100%', maxWidth: 520 }}>
      <KeypadFixture
        fixture="overview"
        id="asset-code"
        label="장치 번호"
        helper="최대 6자리 숫자를 입력하세요."
        keypadProps={{ maxLength: 6 }}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-fixture="overview"]');
    const input = fixture?.querySelector('#asset-code');
    const zero = fixture?.querySelector('[data-keypad-action="digit"][data-keypad-key="0"]');
    const seven = fixture?.querySelector('[data-keypad-action="digit"][data-keypad-key="7"]');
    const confirm = fixture?.querySelector('[data-keypad-action="confirm"]');
    if (!fixture || !input || !zero || !seven || !confirm) {
      throw new Error('VirtualKeypad overview contract targets are required.');
    }

    input.focus();
    await userEvent.click(zero);
    await userEvent.click(zero);
    await userEvent.click(seven);
    if (input.value !== '007') throw new Error('Leading zeroes must remain in the controlled string.');
    if (canvasElement.ownerDocument.activeElement !== input) {
      throw new Error('Pointer activation must preserve an already-focused target input.');
    }
    const lastChange = fixture.querySelector('[data-last-change]');
    if (lastChange?.getAttribute('data-last-change-action') !== 'digit'
      || lastChange?.getAttribute('data-last-change-key') !== '7') {
      throw new Error('Digit activation must expose canonical change metadata.');
    }
    if (confirm.disabled) throw new Error('A complete in-range integer must be confirmable.');
    await userEvent.click(confirm);
    if (fixture.querySelector('[data-confirmed-value]')?.textContent?.includes('007') !== true) {
      throw new Error('Confirmation must return the unchanged canonical string.');
    }
  },
};

export const DecimalAndSignedInput = {
  name: '사용법 · 소수점과 부호',
  parameters: storyDescription(
    '독일어 설정에서는 쉼표 키를 보여 주되 내부 값은 점을 쓰고, 부호만 있는 값과 0. 같은 중간 상태를 그대로 유지하는 구성입니다.',
  ),
  render: () => (
    <main style={{ width: '100%', maxWidth: 520 }}>
      <KeypadFixture
        fixture="decimal"
        id="offset-value"
        label="보정값"
        helper="-2.0~2.0 범위, 소수 입력"
        min={-2}
        max={2}
        keypadProps={{ mode: 'decimal', allowNegative: true, locale: 'de-DE', maxLength: 5 }}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-fixture="decimal"]');
    const input = fixture?.querySelector('#offset-value');
    const sign = fixture?.querySelector('[data-keypad-action="sign"]');
    const decimal = fixture?.querySelector('[data-keypad-action="decimal"]');
    const five = fixture?.querySelector('[data-keypad-action="digit"][data-keypad-key="5"]');
    const clear = fixture?.querySelector('[data-keypad-action="clear"]');
    const confirm = fixture?.querySelector('[data-keypad-action="confirm"]');
    if (!fixture || !input || !sign || !decimal || !five || !clear || !confirm) {
      throw new Error('Decimal VirtualKeypad contract targets are required.');
    }

    if (decimal.textContent?.trim() !== ',' || decimal.getAttribute('data-keypad-key') !== '.') {
      throw new Error('The decimal key must localize its display while retaining canonical dot metadata.');
    }
    await userEvent.click(sign);
    if (input.value !== '-') throw new Error('A sign-only editing state must be preserved.');
    await userEvent.click(decimal);
    if (input.value !== '-0.') throw new Error('Decimal insertion after a sign must preserve -0.');
    if (!confirm.disabled) throw new Error('A trailing decimal point is incomplete and cannot be confirmed.');
    await userEvent.click(five);
    if (input.value !== '-0.5') throw new Error('Localized decimal input must emit a canonical dot string.');
    if (confirm.disabled) throw new Error('A complete in-range decimal must be confirmable.');
    await userEvent.click(sign);
    if (input.value !== '0.5') throw new Error('Sign toggle must remove only the leading minus.');
    await userEvent.click(clear);
    await userEvent.click(decimal);
    if (input.value !== '0.') throw new Error('Decimal insertion into an empty value must preserve 0.');
  },
};

export const RangeAndDisabledStates = {
  name: '변형·상태 · 범위 오류와 비활성',
  parameters: storyDescription(
    '범위를 벗어난 값, 유효하지만 확인만 잠긴 값, 키패드 전체가 비활성인 값을 비교합니다. 범위 오류는 문자열을 강제로 고치지 않고 확인 동작만 차단합니다.',
  ),
  render: () => (
    <main style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <KeypadFixture
        fixture="range"
        id="range-value"
        label="대기 시간"
        initialValue="12"
        min={0}
        max={10}
      />
      <KeypadFixture
        fixture="confirm-disabled"
        id="approval-value"
        label="승인 대기 값"
        helper="상위 승인이 완료되면 확인할 수 있습니다."
        initialValue="5"
        confirmDisabled
      />
      <KeypadFixture
        fixture="disabled"
        id="locked-value"
        label="잠긴 값"
        helper="설정이 잠겨 있어 값을 변경할 수 없습니다."
        initialValue="5"
        disabled
        dark
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const range = canvasElement.querySelector('[data-fixture="range"]');
    const input = range?.querySelector('#range-value');
    const nine = range?.querySelector('[data-keypad-action="digit"][data-keypad-key="9"]');
    const backspace = range?.querySelector('[data-keypad-action="backspace"]');
    const rangeConfirm = range?.querySelector('[data-keypad-action="confirm"]');
    const approvalConfirm = canvasElement.querySelector('[data-fixture="confirm-disabled"] [data-keypad-action="confirm"]');
    const disabledButtons = [...canvasElement.querySelectorAll('[data-fixture="disabled"] button')];
    if (!range || !input || !nine || !backspace || !rangeConfirm || !approvalConfirm || disabledButtons.length === 0) {
      throw new Error('VirtualKeypad state targets are required.');
    }

    if (!rangeConfirm.disabled) throw new Error('An out-of-range value must disable confirmation.');
    if (nine.disabled) throw new Error('Range invalidity must not disable or clamp editing keys.');
    await userEvent.click(nine);
    if (input.value !== '129') throw new Error('min/max must not clamp the intermediate controlled string.');
    await userEvent.click(backspace);
    await userEvent.click(backspace);
    if (input.value !== '1' || rangeConfirm.disabled) {
      throw new Error('Editing back into range must re-enable confirmation without coercion.');
    }
    if (!approvalConfirm.disabled) throw new Error('confirmDisabled must independently block confirmation.');
    if (disabledButtons.some((button) => !button.disabled)) {
      throw new Error('disabled must make every native keypad button unavailable.');
    }
  },
};

export const TargetFocusPreservation = {
  name: '상호작용 · 대상 입력 초점 유지',
  parameters: storyDescription(
    '키패드 대상에 이미 초점이 있는 경우에만 터치 입력 뒤에도 그 초점을 유지합니다. 다른 입력에 초점이 있다면 키패드가 문서 전체의 초점을 임의로 되돌리지 않습니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 520 }}>
      <Input id="other-field" label="다른 입력" defaultValue="비교 대상" />
      <KeypadFixture
        fixture="focus"
        id="focus-target"
        label="키패드 대상"
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const target = canvasElement.querySelector('#focus-target');
    const other = canvasElement.querySelector('#other-field');
    const one = canvasElement.querySelector('[data-fixture="focus"] [data-keypad-action="digit"][data-keypad-key="1"]');
    const two = canvasElement.querySelector('[data-fixture="focus"] [data-keypad-action="digit"][data-keypad-key="2"]');
    if (!target || !other || !one || !two) throw new Error('Focus-preservation targets are required.');

    target.focus();
    await userEvent.type(target, '4');
    await userEvent.click(one);
    if (target.value !== '41') {
      throw new Error('Native input and keypad activation must update the same controlled canonical value.');
    }
    if (canvasElement.ownerDocument.activeElement !== target) {
      throw new Error('The already-focused target input must retain focus.');
    }

    other.focus();
    await userEvent.click(two);
    if (canvasElement.ownerDocument.activeElement !== two) {
      throw new Error('The keypad must not preserve or restore a target that was not focused.');
    }
  },
};

export const Narrow320 = {
  name: '반응형 · 320px 좁은 폭',
  parameters: storyDescription(
    '320px 컨테이너에서 입력 필드와 3열 키패드가 가로 스크롤 없이 줄어드는 구성입니다. 모든 인접 터치 영역은 48px 높이를 유지합니다.',
  ),
  render: () => (
    <main
      data-narrow-keypad
      style={{ width: 320, maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}
    >
      <KeypadFixture
        fixture="narrow"
        id="narrow-value"
        label="작업 수량"
        initialValue="007"
        style={{ maxWidth: '100%' }}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const wrapper = canvasElement.querySelector('[data-narrow-keypad]');
    const keypad = wrapper?.querySelector('[data-lds-virtual-keypad]');
    const buttons = [...(keypad?.querySelectorAll('button') ?? [])];
    if (!wrapper || !keypad || buttons.length === 0) throw new Error('Narrow keypad targets are required.');
    if (wrapper.scrollWidth > wrapper.clientWidth + 1 || keypad.scrollWidth > keypad.clientWidth + 1) {
      throw new Error('VirtualKeypad must not create horizontal overflow at 320px.');
    }
    for (const button of buttons) {
      if (Math.abs(button.getBoundingClientRect().height - 48) > 0.5) {
        throw new Error('Every VirtualKeypad key must retain the 48px LDS large Button target.');
      }
    }
  },
};

export const LandscapeKiosk = {
  name: '반응형 · 낮은 가로 화면',
  parameters: storyDescription(
    '568×320px 가로형 키오스크에서 값 설명과 키패드를 나란히 놓는 구성입니다. 확인 키를 포함한 전체 입력면이 짧은 화면 높이 안에 남습니다.',
  ),
  render: () => <LandscapeExample />,
  play: async ({ canvasElement }) => {
    const wrapper = canvasElement.querySelector('[data-landscape-keypad]');
    const keypad = wrapper?.querySelector('[data-lds-virtual-keypad]');
    const confirm = keypad?.querySelector('[data-keypad-action="confirm"]');
    const input = wrapper?.querySelector('#landscape-dwell-time');
    const six = keypad?.querySelector('[data-keypad-action="digit"][data-keypad-key="6"]');
    if (!wrapper || !keypad || !confirm || !input || !six) throw new Error('Landscape keypad targets are required.');
    const wrapperRect = wrapper.getBoundingClientRect();
    const keypadRect = keypad.getBoundingClientRect();
    const confirmRect = confirm.getBoundingClientRect();
    if (wrapperRect.height > 320.5 || keypadRect.top < wrapperRect.top - 0.5 || keypadRect.bottom > wrapperRect.bottom + 0.5) {
      throw new Error('The complete keypad must remain inside the 320px landscape fixture.');
    }
    if (confirmRect.bottom > wrapperRect.bottom + 0.5) {
      throw new Error('The confirmation action must remain visible in the landscape kiosk fixture.');
    }
    input.focus();
    await userEvent.click(six);
    if (input.value !== '12.56') throw new Error('The landscape keypad must remain interactive.');
    await userEvent.click(confirm);
    if (wrapper.querySelector('[data-landscape-confirmed]')?.textContent !== '12.56') {
      throw new Error('Landscape confirmation must preserve the canonical value.');
    }
  },
};

export const VirtualKeypadVisualParity = {
  ...RangeAndDisabledStates,
  name: 'Virtual keypad visual parity',
  tags: ['!dev', 'visual-parity'],
};
