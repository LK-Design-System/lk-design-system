import React from 'react';
import { WheelPicker } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Selection and Input/Wheel Picker',
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
