import { Calendar } from '../src/index.js';
import { CalendarCard as CalendarCardStory } from './DataDisplay.shared.jsx';

const meta = {
  title: 'LK Product Extension/Data/Calendar',
  parameters: {
    docs: {
      description: {
        component: '일정, 마감일, 예약일처럼 날짜 데이터를 탐색하는 Calendar 패턴입니다.',
      },
    },
  },
};

export default meta;

export const CalendarPattern = {
  name: '캘린더',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 420 }}>
      <Calendar defaultValue="2026-07-05" />
      <p style={{ margin: 0, color: 'var(--label-neutral)', lineHeight: 1.6 }}>
        마감일, 예약일, 로그 기준일을 한 달 단위로 선택합니다.
      </p>
    </main>
  ),
};

export const CalendarCard = { ...CalendarCardStory, name: 'Calendar card parity', tags: ['!dev', 'visual-parity'] };
