import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import {
  FormField,
  TimePicker,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Selection and Input/Time Picker',
  tags: ['autodocs'],
  component: TimePicker,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-selection-and-input-time-picker--time-input',
      eyebrow: 'Product / Time Picker',
      title: '시간 선택기는 필요한 정밀도에 맞춰 시·분·초를 입력합니다',
      description:
        '예약 시작이나 점검 시각처럼 하루 안의 특정 시간을 고를 때 적합합니다. 날짜나 기간까지 함께 필요하면 Time Picker 하나로 확장하지 말고 Date Picker·Date Range와 조합하세요.',
    },
    docs: {
      description: {
        component: '시·분 입력과 선택적인 초 정밀도를 지원하는 TimePicker 패턴입니다. 날짜와 timezone은 제품이 소유합니다.',
      },
    },
  },
};

function SecondPrecisionExample({ disabled = false, width = 320, secondStep = 1 }) {
  const [value, setValue] = React.useState('08:50:59');
  return <div style={{ width, maxWidth: '100%', display: 'grid', gap: 'var(--space-2)' }}>
    <FormField label="녹화 시각">
      <TimePicker value={value} onChange={setValue} precision="second" minuteStep={1} secondStep={secondStep}
        size="sm" aria-label="녹화 시각" hourLabel="녹화 시" minuteLabel="녹화 분" secondLabel="녹화 초" disabled={disabled} />
    </FormField>
    <output aria-label="선택한 시각">{value}</output>
  </div>;
}

export const SecondPrecision = {
  name: '사용법 · 초 단위 입력',
  parameters: storyDescription('녹화 시각처럼 초까지 필요한 경우 시·분·초를 함께 선택합니다. 기본 입력에는 시·분만 표시됩니다.'),
  render: () => <SecondPrecisionExample />,
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[role="group"][aria-label="녹화 시각"]');
    const [hour, minute, second] = group.querySelectorAll('select');
    if (!second || group.querySelectorAll('select').length !== 3 || second.value !== '59') throw new Error('초 정밀도는 시·분·초를 보존해야 합니다.');
    if (second.getAttribute('aria-label') !== '녹화 초' || second.options.length !== 60) throw new Error('초 select 이름과 기본 1초 간격이 필요합니다.');
    await userEvent.selectOptions(second, '0');
    await waitFor(() => { if (canvasElement.querySelector('output').textContent !== '08:50:00') throw new Error('0초가 HH:MM:SS로 전달되어야 합니다.'); });
    await userEvent.selectOptions(minute, '51');
    await waitFor(() => { if (canvasElement.querySelector('output').textContent !== '08:51:00' || hour.value !== '8') throw new Error('분 변경은 시·초를 보존해야 합니다.'); });
    await userEvent.selectOptions(second, '59');
    await userEvent.selectOptions(minute, '50');
    second.blur();
    if (group.scrollWidth > group.clientWidth) throw new Error('320px 예제에서 시간 입력이 넘치면 안 됩니다.');
  },
};

export const SecondStepAndDisabled = {
  name: '변형·상태 · 초 간격과 비활성',
  parameters: storyDescription('초 선택 간격을 지정한 입력과 선택이 비활성화된 입력을 비교합니다.'),
  render: () => <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
    <SecondPrecisionExample secondStep={10} />
    <SecondPrecisionExample disabled />
    <TimePicker defaultValue="23:59" aria-label="기존 분 단위" />
  </div>,
  play: async ({ canvasElement }) => {
    const groups = canvasElement.querySelectorAll('[role="group"][aria-label="녹화 시각"]');
    const seconds = groups[0].querySelectorAll('select')[2];
    if (seconds.value !== '59' || ![...seconds.options].some(option => option.value === '59')) throw new Error('step 밖 controlled 초도 보존되어야 합니다.');
    if ([...groups[1].querySelectorAll('select')].some(select => !select.disabled)) throw new Error('disabled는 초도 잠가야 합니다.');
    if (canvasElement.querySelector('[aria-label="기존 분 단위"]').querySelectorAll('select').length !== 2) throw new Error('기본 minute UI는 두 select를 유지해야 합니다.');
  },
};

function FieldExample() {
  const [value, setValue] = React.useState('08:50:20');
  const [count, setCount] = React.useState(0);
  return <div style={{ width: 320, maxWidth: '100%' }}>
    <TimePicker value={value} onChange={next => { setValue(next); setCount(current => current + 1); }}
      presentation="field" precision="second" minuteStep={1} minTime="08:30:10" maxTime="09:30:20"
      size="sm" aria-label="필드 녹화 시각" hourLabel="필드 시" minuteLabel="필드 분" secondLabel="필드 초" />
    <output data-commits={count} aria-label="확정 시각">{value}</output>
  </div>;
}

export const Field = {
  name: '상호작용 · 단일 필드에서 선택과 취소',
  parameters: storyDescription('한 필드에서 시간 선택기를 열고 확인으로 적용합니다. 취소하면 이전 시각을 유지합니다.'),
  render: () => <FieldExample />,
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('button[aria-haspopup="dialog"]');
    const output = canvasElement.querySelector('output');
    const popup = () => canvasElement.ownerDocument.querySelector('[role="dialog"][aria-label="필드 녹화 시각"]');
    const action = (name) => [...popup().querySelectorAll('button')].find(button => button.textContent === name);
    await userEvent.click(trigger);
    await waitFor(() => { if (!popup()) throw new Error('단일 필드는 이름 있는 Core Popover를 열어야 합니다.'); });
    await userEvent.selectOptions(popup().querySelector('[aria-label="필드 분"]'), '55');
    if (output.textContent !== '08:50:20' || output.dataset.commits !== '0') throw new Error('draft 선택은 아직 확정하면 안 됩니다.');
    await userEvent.click(action('취소'));
    await waitFor(() => { if (popup() || canvasElement.ownerDocument.activeElement !== trigger) throw new Error('취소는 값 보존·trigger focus 복원을 해야 합니다.'); });
    await userEvent.click(trigger);
    await userEvent.selectOptions(popup().querySelector('[aria-label="필드 시"]'), '9');
    const [hour, minute, second] = popup().querySelectorAll('select');
    if (minute.value !== '30' || second.value !== '20') throw new Error('hour 변경이 경계에 걸리면 유효 시간으로 clamp해야 합니다.');
    if (!hour.querySelector('option[value="10"]').disabled || !minute.querySelector('option[value="31"]').disabled || !second.querySelector('option[value="21"]').disabled) throw new Error('범위 밖 시간 단위는 disabled여야 합니다.');
    await userEvent.click(action('확인'));
    await waitFor(() => { if (output.textContent !== '09:30:20' || output.dataset.commits !== '1') throw new Error('확인은 HH:MM:SS를 한 번만 전달해야 합니다.'); });
    await userEvent.click(trigger);
    await userEvent.selectOptions(popup().querySelector('[aria-label="필드 분"]'), '20');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => { if (popup() || output.textContent !== '09:30:20' || output.dataset.commits !== '1' || canvasElement.ownerDocument.activeElement !== trigger) throw new Error('Escape는 draft를 버리고 focus를 복원해야 합니다.'); });
    await userEvent.click(trigger);
    await userEvent.click(canvasElement);
    await waitFor(() => { if (popup() || output.dataset.commits !== '1' || canvasElement.ownerDocument.activeElement !== trigger) throw new Error('외부 클릭은 확정하지 않고 focus를 복원해야 합니다.'); });
  },
};

export const BoundsAndUnavailable = {
  name: '변형·상태 · 선택 범위와 선택 불가',
  parameters: storyDescription('가능한 시간 범위가 한정되거나 유효한 시각이 없는 상태를 비교합니다.'),
  render: () => <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
    <TimePicker presentation="field" value="09:30" minTime="08:30" maxTime="09:30" aria-label="분 단위 필드" />
    <TimePicker presentation="field" value="" disabled aria-label="자료 없음" />
    <TimePicker presentation="field" value="09:00" minTime="09:00" maxTime="08:00" aria-label="뒤집힌 범위" />
    <TimePicker value="08:30" minTime="08:30:10" maxTime="08:30:20" aria-label="표현 불가 분 범위" />
  </div>,
  play: async ({ canvasElement }) => {
    for (const label of ['자료 없음', '뒤집힌 범위']) {
      const trigger = canvasElement.querySelector(`button[aria-label^="${label}"]`);
      if (!trigger?.disabled) throw new Error(`${label} 필드는 선택할 수 없어야 합니다.`);
    }
    if ([...canvasElement.querySelector('[aria-label="표현 불가 분 범위"]').querySelectorAll('select')].some(select => !select.disabled)) throw new Error('분 단위로 표현할 수 없는 범위를 넓혀서는 안 됩니다.');
  },
};

function AllowedRangesExample() {
  const [value, setValue] = React.useState('08:30:10');
  const [count, setCount] = React.useState(0);
  return <div style={{display:'grid',gap:'var(--space-4)',width:320,maxWidth:'100%'}}>
    <TimePicker presentation="field" precision="second" minuteStep={1} value={value} onChange={next=>{setValue(next);setCount(count+1);}}
      allowedTimeRanges={[{start:'08:30:10',end:'08:30:20'},{start:'09:00:05',end:'09:00:10'}]}
      aria-label="불연속 시각" hourLabel="허용 시" minuteLabel="허용 분" secondLabel="허용 초" />
    <output aria-label="허용 시각 결과" data-commits={count}>{value}</output>
    <TimePicker value="08:31" minuteStep={1} allowedTimeRanges={[{start:'08:30:10',end:'08:31:20'}]} aria-label="분 정밀도 교집합" />
    <TimePicker presentation="field" value="08:30" allowedTimeRanges={[]} aria-label="허용 구간 없음" />
  </div>;
}
export const AllowedTimeRanges = {
  name: '상호작용 · 떨어진 시간 구간 선택',
  parameters: storyDescription('한 날짜에 녹화가 여러 구간에 걸쳐 있는 경우 구간 사이의 시각은 선택할 수 없습니다.'),
  render:()=> <AllowedRangesExample />,
  play:async({canvasElement})=>{
    const trigger=canvasElement.querySelector('button[aria-label^="불연속 시각"]');
    const output=canvasElement.querySelector('output');
    const popup=()=>canvasElement.ownerDocument.querySelector('[role="dialog"][aria-label="불연속 시각"]');
    await userEvent.click(trigger);
    await waitFor(()=>{if(!popup())throw new Error('허용 시간 필드는 Core Popover를 열어야 합니다.');});
    let [hour,minute,second]=popup().querySelectorAll('select');
    if(!hour.querySelector('option[value="7"]').disabled||!minute.querySelector('option[value="31"]').disabled||!second.querySelector('option[value="9"]').disabled||second.querySelector('option[value="10"]').disabled)throw new Error('공백 시·분·초는 disabled이고 유효 초는 선택 가능해야 합니다.');
    await userEvent.selectOptions(hour,'9');
    await waitFor(()=>{[hour,minute,second]=popup().querySelectorAll('select');if(minute.value!=='0'||second.value!=='10')throw new Error('다른 허용 구간으로 이동할 때 선택한 시 안의 유효 시각으로 제한해야 합니다.');});
    if(!second.querySelector('option[value="4"]').disabled||!second.querySelector('option[value="11"]').disabled)throw new Error('새 시각에서도 초 공백을 막아야 합니다.');
    if(output.dataset.commits!=='0')throw new Error('필드 단위 선택은 아직 확정하지 않아야 합니다.');
    await userEvent.click([...popup().querySelectorAll('button')].find(button=>button.textContent==='확인'));
    await waitFor(()=>{if(output.textContent!=='09:00:10'||output.dataset.commits!=='1')throw new Error('확인 때 유효 시각만 한 번 전달해야 합니다.');});
    const group=canvasElement.querySelector('[role="group"][aria-label="분 정밀도 교집합"]');
    const minuteOnly=group.querySelectorAll('select')[1];
    if(!minuteOnly.querySelector('option[value="30"]').disabled||minuteOnly.querySelector('option[value="31"]').disabled)throw new Error('분 정밀도는 실제 :00 시각과 허용 구간의 교집합이어야 합니다.');
    if(!canvasElement.querySelector('button[aria-label^="허용 구간 없음"]').disabled)throw new Error('빈 구간은 선택할 수 없어야 합니다.');
  },
};

export default meta;

export const TimeInput = {
  name: '개요',
  parameters: storyDescription(
    '09시 30분 시작 시간을 시·분 제어로 나누어 입력합니다. 두 값의 label과 최종 시간 의미가 하나의 FormField 안에서 자연스럽게 읽히는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 520 }}>
      <FormField label="시작 시간">
        <TimePicker defaultValue="09:30" aria-label="시작 시간" hourLabel="시작 시" minuteLabel="시작 분" />
      </FormField>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[role="group"][aria-label="시작 시간"]');
    if (!group) throw new Error('시·분 select는 이름 있는 group으로 묶여 어느 필드의 시각인지 전달해야 합니다.');
    const [hour, minute] = group.querySelectorAll('select');
    if (!hour || !minute) throw new Error('시·분 native select가 렌더되어야 합니다.');
    if (hour.getAttribute('aria-label') !== '시작 시' || minute.getAttribute('aria-label') !== '시작 분') {
      throw new Error('두 select는 각자의 accessible name을 유지해야 합니다.');
    }
    if (hour.value !== '9' || minute.value !== '30') {
      throw new Error(`defaultValue "09:30"이 두 select에 반영되어야 합니다. (${hour.value}:${minute.value})`);
    }
    const minuteValues = [...minute.options].map((option) => option.value);
    if (minuteValues.length !== 12 || minuteValues[1] !== '5') {
      throw new Error(`minuteStep 기본값 5는 12개의 분 option을 만들어야 합니다. (${minuteValues.length}개)`);
    }

    await userEvent.selectOptions(minute, '45');
    await waitFor(() => {
      if (minute.value !== '45') throw new Error('분 select 변경이 값으로 커밋되어야 합니다.');
      if (hour.value !== '9') throw new Error('분만 바꿔도 시 값은 유지되어야 합니다.');
    });

    // 이름난 상태(09:30)로 복귀.
    await userEvent.selectOptions(minute, '30');
    await waitFor(() => {
      if (minute.value !== '30') throw new Error('이름난 상태(09:30)로 복귀해야 합니다.');
    });
    minute.blur();
  },
};
