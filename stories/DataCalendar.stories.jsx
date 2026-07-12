import { Calendar } from '../src/index.js';
import { CalendarCard as CalendarCardStory } from './DataDisplay.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Selection and Input/Calendar',
  parameters: {
    storyGuide: {
      storyId: 'lds-product-selection-and-input-calendar--calendar-pattern',
      eyebrow: 'Product / Calendar',
      title: '캘린더는 한 달의 맥락 안에서 날짜를 탐색하고 선택하게 합니다',
      description:
        '예약 가능일이나 로그 기준일처럼 주변 날짜를 함께 보며 고를 때 적합합니다. 폼 안에서 단일 날짜만 간결하게 입력하면 Calendar 대신 Date Picker를 사용하세요.',
    },
    docs: {
      description: {
        component: '일정, 마감일, 예약일처럼 날짜 데이터를 탐색하는 Calendar 패턴입니다.',
      },
    },
  },
};

export default meta;

export const CalendarPattern = {
  name: '개요',
  parameters: storyDescription(
    '2026년 7월의 날짜를 한 달 맥락에서 탐색하는 기본 캘린더입니다. 선택 날짜와 이전·다음 달 이동이 키보드와 시각 상태로 함께 이해되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 420 }}>
      <Calendar defaultValue="2026-07-05" />
      <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.6 }}>
        마감일, 예약일, 로그 기준일을 한 달 단위로 선택합니다.
      </p>
    </main>
  ),
};

export const CalendarCard = { ...CalendarCardStory, name: 'Calendar card parity', tags: ['!dev', 'visual-parity'] };
