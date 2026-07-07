import {
  DatePicker,
  TimePicker,
} from '../src/index.js';
import { DatePickerCard as DatePickerCardStory } from './FormsFull.shared.jsx';

const meta = {
  title: 'LK Product Extension/Selection and Input/Date and Time',
  parameters: {
    docs: {
      description: {
        component: '예약일, 시작 시간, 점검 시간처럼 시간 기반 값을 입력하는 DatePicker와 TimePicker 패턴입니다.',
      },
    },
  },
};

export default meta;

export const DateTimeInputs = {
  name: '날짜와 시간',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 520 }}>
      <DatePicker defaultValue="2026-07-05" />
      <TimePicker defaultValue="09:30" />
    </main>
  ),
};

export const DatePickerCard = { ...DatePickerCardStory, name: 'DatePicker card parity', tags: ['!dev', 'visual-parity'] };

