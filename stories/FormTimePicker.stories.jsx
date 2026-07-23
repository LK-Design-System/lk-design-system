import { userEvent, waitFor } from 'storybook/test';
import {
  FormField,
  TimePicker,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Selection and Input/Time Picker',
  component: TimePicker,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-selection-and-input-time-picker--time-input',
      eyebrow: 'Product / Time Picker',
      title: '시간 선택기는 시와 분을 구분해 정확한 시각 값을 입력합니다',
      description:
        '예약 시작이나 점검 시각처럼 하루 안의 특정 시간을 고를 때 적합합니다. 날짜나 기간까지 함께 필요하면 Time Picker 하나로 확장하지 말고 Date Picker·Date Range와 조합하세요.',
    },
    docs: {
      description: {
        component: '시작 시간, 점검 시간처럼 시·분 값을 입력하는 TimePicker 패턴입니다.',
      },
    },
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
