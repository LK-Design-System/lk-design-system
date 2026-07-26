import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { WheelPicker } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Selection and Input/Wheel Picker',
  tags: ['autodocs'],
  component: WheelPicker,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-selection-and-input-wheel-picker--wheel-pickers',
      eyebrow: 'Product / Wheel Picker',
      title: '휠 피커는 짧고 순차적인 값을 터치 중심으로 빠르게 고르게 합니다',
      description:
        '층·시·분처럼 순서가 있고 선택지가 짧은 값을 모바일에서 조절할 때 적합합니다. 긴 목록이나 키보드 중심 데스크톱 폼에는 Wheel Picker 대신 Select를 사용하세요.',
    },
    docs: {
      description: {
        component:
          'iOS식 드럼/휠로 짧은 순차 값을 고르는 WheelPicker 패턴입니다. 층 선택, 시·분 선택, 단계 선택에 씁니다.',
      },
    },
  },
};

export default meta;

const floorOptions = ['B2', 'B1', '1F', '2F', '3F', '4F', '5F'];
const hourOptions = Array.from({ length: 24 }, (_, hour) => ({
  value: hour,
  label: String(hour).padStart(2, '0'),
}));
const minuteOptions = Array.from({ length: 12 }, (_, index) => {
  const value = index * 5;
  return { value, label: String(value).padStart(2, '0') };
});
const speedOptions = [
  { value: 'slow', label: '느림' },
  { value: 'normal', label: '보통' },
  { value: 'fast', label: '빠름', disabled: true },
  { value: 'turbo', label: '터보' },
];

function Stage({ children }) {
  return (
    <main
      style={{
        display: 'flex',
        gap: 'var(--space-6)',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {children}
    </main>
  );
}

function PickerBlock({ label, children, value }) {
  return (
    <section style={{ display: 'grid', gap: 'var(--space-2)', justifyItems: 'center' }}>
      {children}
      <div
        aria-live="polite"
        style={{
          minHeight: 22,
          padding: '0 var(--space-2)',
          display: 'inline-flex',
          alignItems: 'center',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--color-semantic-fill-normal)',
          color: 'var(--color-semantic-label-neutral)',
          fontSize: 'var(--label2-size)',
          lineHeight: 'var(--label2-line)',
          fontWeight: 'var(--fw-semibold)',
        }}
      >
        {label}: {value}
      </div>
    </section>
  );
}

function ControlledFloorExample() {
  const [floor, setFloor] = React.useState('1F');

  return (
    <PickerBlock label="층" value={floor}>
      <WheelPicker
        options={floorOptions}
        value={floor}
        onChange={setFloor}
        label="층 선택"
      />
    </PickerBlock>
  );
}

function ControlledHourExample() {
  const [hour, setHour] = React.useState(9);

  return (
    <PickerBlock label="시간" value={String(hour).padStart(2, '0')}>
      <WheelPicker
        options={hourOptions}
        value={hour}
        onChange={setHour}
        label="시간 선택"
        width={96}
      />
    </PickerBlock>
  );
}

function DisabledSpeedExample() {
  const [speed, setSpeed] = React.useState('normal');
  const label = speedOptions.find((option) => option.value === speed)?.label ?? speed;

  return (
    <PickerBlock label="속도" value={label}>
      <WheelPicker options={speedOptions} value={speed} onChange={setSpeed} label="속도 선택" />
    </PickerBlock>
  );
}

function TimeExample() {
  const [hour, setHour] = React.useState(9);
  const [minute, setMinute] = React.useState(30);

  return (
    <Stage>
      <PickerBlock label="시" value={String(hour).padStart(2, '0')}>
        <WheelPicker
          options={hourOptions}
          value={hour}
          onChange={setHour}
          label="시 선택"
          width={96}
        />
      </PickerBlock>
      <PickerBlock label="분" value={String(minute).padStart(2, '0')}>
        <WheelPicker
          options={minuteOptions}
          value={minute}
          onChange={setMinute}
          label="분 선택"
          width={96}
        />
      </PickerBlock>
    </Stage>
  );
}

export const WheelPickers = {
  name: '개요',
  parameters: storyDescription(
    '층과 시각처럼 짧고 순차적인 값을 두 개의 controlled 휠로 선택합니다. 가운데 선택 영역과 현재 값이 스크롤 뒤에도 동기화되는지 확인하세요.',
  ),
  render: () => (
    <Stage>
      <ControlledFloorExample />
      <ControlledHourExample />
    </Stage>
  ),
};

export const TimePicker = {
  name: '사용법 · 시간 선택',
  parameters: storyDescription(
    '시·분 두 휠을 조합해 하나의 시간 값을 만드는 구성입니다. 각 휠 label과 결합된 결과가 명확하고 순환 탐색이 예측 가능한지 확인하세요.',
  ),
  render: () => <TimeExample />,
};

export const DisabledOptions = {
  name: '변형·상태 · 비활성 옵션',
  parameters: storyDescription(
    '일부 옵션 비활성, 읽기 전용, 전체 비활성 휠을 비교합니다. 건너뛸 값과 변경할 수 없는 제어가 서로 다른 상태로 전달되는지 확인하세요.',
  ),
  render: () => (
    <Stage>
      <DisabledSpeedExample />
      <PickerBlock label="읽기" value="2F">
        <WheelPicker options={floorOptions} defaultValue="2F" label="읽기 전용 층 선택" readOnly />
      </PickerBlock>
      <PickerBlock label="비활성" value="1F">
        <WheelPicker options={floorOptions} defaultValue="1F" label="비활성 층 선택" disabled />
      </PickerBlock>
    </Stage>
  ),
};

const keyboardOptions = [
  { value: 'B2', label: 'B2' },
  { value: 'B1', label: 'B1' },
  { value: '1F', label: '1F' },
  { value: '2F', label: '2F', disabled: true },
  { value: '3F', label: '3F' },
  { value: '4F', label: '4F' },
  { value: '5F', label: '5F' },
];

function KeyboardContractFixture() {
  const [floor, setFloor] = React.useState('1F');
  return (
    <Stage>
      <PickerBlock label="층" value={floor}>
        <WheelPicker
          data-testid="keyboard-wheel"
          options={keyboardOptions}
          value={floor}
          onChange={setFloor}
          label="층 선택"
        />
      </PickerBlock>
      <PickerBlock label="읽기" value="2F">
        <WheelPicker
          data-testid="readonly-wheel"
          options={floorOptions}
          defaultValue="2F"
          label="읽기 전용 층 선택"
          readOnly
        />
      </PickerBlock>
      <PickerBlock label="비활성" value="1F">
        <WheelPicker
          data-testid="disabled-wheel"
          options={floorOptions}
          defaultValue="1F"
          label="비활성 층 선택"
          disabled
        />
      </PickerBlock>
    </Stage>
  );
}

export const KeyboardContract = {
  name: '키보드 선택 계약',
  tags: ['!dev'],
  render: () => <KeyboardContractFixture />,
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const wheel = canvasElement.querySelector('[data-testid="keyboard-wheel"]');
    const list = wheel?.querySelector('[role="listbox"]');
    if (!list) throw new Error('WheelPicker는 role="listbox"를 노출해야 합니다.');
    if (list.getAttribute('aria-label') !== '층 선택') {
      throw new Error('listbox에는 accessible name이 있어야 합니다.');
    }

    const activeLabel = () => {
      const id = list.getAttribute('aria-activedescendant');
      return id ? doc.getElementById(id)?.textContent : null;
    };
    const expectActive = async (expected, message) => {
      await waitFor(() => {
        if (activeLabel() !== expected) throw new Error(`${message} (현재: ${activeLabel()})`);
        const selected = list.querySelector('[role="option"][aria-selected="true"]');
        if (selected?.textContent !== expected) {
          throw new Error(`${message} — aria-selected가 따라오지 않았습니다. (현재: ${selected?.textContent})`);
        }
      });
    };

    await expectActive('1F', 'aria-activedescendant는 선택된 옵션을 가리켜야 합니다.');

    /* 초점 이벤트는 보내지 않는다. 키보드 경로는 activeElement만 사용하고, focus
       상태를 켜면 캡처에 초점 링이 남아 이름난 상태가 오염된다. */
    list.focus();
    if (doc.activeElement !== list) throw new Error('활성 listbox는 Tab으로 진입할 수 있어야 합니다.');

    await userEvent.keyboard('{ArrowDown}');
    await expectActive('3F', 'ArrowDown은 disabled 옵션(2F)을 건너뛰어야 합니다.');
    await userEvent.keyboard('{ArrowUp}');
    await expectActive('1F', 'ArrowUp도 disabled 옵션을 건너뛰어야 합니다.');

    await userEvent.keyboard('{Home}');
    await expectActive('B2', 'Home은 첫 옵션으로 이동해야 합니다.');
    await userEvent.keyboard('{End}');
    await expectActive('5F', 'End는 마지막 옵션으로 이동해야 합니다.');
    await userEvent.keyboard('{PageUp}');
    await expectActive('3F', 'PageUp은 보이는 행의 절반만큼 위로 이동해야 합니다.');
    await userEvent.keyboard('{PageDown}');
    await expectActive('5F', 'PageDown은 보이는 행의 절반만큼 아래로 이동해야 합니다.');

    await userEvent.keyboard('b');
    await expectActive('B2', 'type-ahead는 label 앞부분이 일치하는 옵션으로 이동해야 합니다.');
    await userEvent.keyboard('b');
    await expectActive('B1', '같은 문자를 반복하면 다음 일치 옵션으로 순환해야 합니다.');

    const readOnly = canvasElement.querySelector('[data-testid="readonly-wheel"] [role="listbox"]');
    if (readOnly.getAttribute('aria-readonly') !== 'true') {
      throw new Error('readOnly 휠은 aria-readonly를 노출해야 합니다.');
    }
    const readOnlyBefore = readOnly.getAttribute('aria-activedescendant');
    readOnly.focus();
    if (doc.activeElement !== readOnly) throw new Error('readOnly 휠은 읽기 위해 초점을 받을 수 있어야 합니다.');
    await userEvent.keyboard('{ArrowDown}');
    if (readOnly.getAttribute('aria-activedescendant') !== readOnlyBefore) {
      throw new Error('readOnly 휠은 키보드로 값이 바뀌지 않아야 합니다.');
    }

    const disabledList = canvasElement.querySelector('[data-testid="disabled-wheel"] [role="listbox"]');
    if (disabledList.getAttribute('tabindex') !== '-1' || disabledList.getAttribute('aria-disabled') !== 'true') {
      throw new Error('disabled 휠은 Tab 진입을 막고 aria-disabled를 노출해야 합니다.');
    }

    // 이름난 상태로 복귀: 1F 선택, 초점 없음, 스크롤 원위치.
    list.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expectActive('1F', '이름난 상태(1F)로 복귀해야 합니다.');
    doc.activeElement?.blur?.();
    doc.defaultView?.scrollTo(0, 0);
  },
};

export const Empty = {
  name: '변형·상태 · 항목 없음',
  parameters: storyDescription(
    '선택할 항목이 전혀 없는 휠 상태입니다. 빈 메시지가 선택 viewport를 대신하고 사용자가 값을 조절할 수 있다고 오인하지 않는지 확인하세요.',
  ),
  render: () => (
    <Stage>
      <WheelPicker
        options={[]}
        emptyLabel="표시할 항목이 없습니다"
        label="빈 휠 선택"
        width={180}
      />
    </Stage>
  ),
};
