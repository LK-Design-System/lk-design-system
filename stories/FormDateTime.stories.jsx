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

export const DatePickerCard = { ...DatePickerCardStory, name: 'DatePicker card parity', tags: ['!dev', 'visual-parity'] };
