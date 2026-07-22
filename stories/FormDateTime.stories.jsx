import { userEvent } from 'storybook/test';
import {
  DatePicker,
  FormField,
} from '../src/index.js';
import { DatePickerCard as DatePickerCardStory } from './FormsFull.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Selection and Input/Date Picker',
  component: DatePicker,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-selection-and-input-date-picker--date-input',
      eyebrow: 'Product / Date Picker',
      title: '날짜 선택기는 폼에서 단일 날짜 값을 간결하게 입력합니다',
      description:
        '예약일·마감일처럼 한 날짜를 필드 맥락에서 입력할 때 적합합니다. 시작과 종료가 함께 필요하면 Date Range를, 월 전체를 탐색해야 하면 Calendar를 사용하세요.',
    },
    docs: {
      description: {
        component: '예약일처럼 날짜 값을 입력하는 DatePicker 패턴입니다.',
      },
    },
  },
};

export default meta;

export const DateInput = {
  name: '개요',
  parameters: storyDescription(
    '예약일 한 값을 FormField 안에서 입력하는 기본 Date Picker입니다. 필드 label과 선택 날짜가 연결되고 달력 열기 동작이 분명한지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 520 }}>
      <FormField label="예약일">
        <DatePicker aria-label="예약일" defaultValue="2026-07-05" />
      </FormField>
    </main>
  ),
};

export const BlockedDates = {
  name: '변형·상태 · 예약 불가일',
  parameters: storyDescription(
    '실사 희망일 필드에서 지난 날짜(minDate 이전)와 마감일(7월 20·21일)을 선택 불가로 막는 구성입니다. 트리거를 열면 Calendar 팝오버로 비활성 날짜가 그대로 전달되어 흐리게 표시되고 선택되지 않는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 520 }}>
      <FormField label="실사 희망일">
        <DatePicker
          aria-label="실사 희망일"
          defaultValue="2026-07-15"
          minDate="2026-07-10"
          isDateDisabled={(date) => date.getMonth() === 6 && [20, 21].includes(date.getDate())}
        />
      </FormField>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('button[aria-haspopup="dialog"]');
    if (!trigger) throw new Error('DatePicker 트리거가 렌더되어야 합니다.');
    await userEvent.click(trigger);
    const grid = canvasElement.querySelector('[role="dialog"] [role="grid"]');
    if (!grid) throw new Error('트리거를 열면 Calendar 팝오버가 나타나야 합니다.');
    const disabled = grid.querySelectorAll('button[aria-disabled="true"]');
    if (disabled.length < 3) {
      throw new Error('DatePicker의 minDate·isDateDisabled가 Calendar 팝오버로 전달되어 비활성 날짜로 표시되어야 합니다.');
    }
    await userEvent.keyboard('{Escape}');
  },
};

export const DatePickerCard = { ...DatePickerCardStory, name: 'DatePicker card parity', tags: ['!dev', 'visual-parity'] };
