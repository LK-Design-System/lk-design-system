import React from 'react';
import { userEvent } from 'storybook/test';
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

function BlockedDatesFixture() {
  const [picked, setPicked] = React.useState('');
  // 7월 20·21일은 예약 마감, 7월 10일 이전은 지난 날짜로 잠급니다.
  const isDateDisabled = (date) => date.getMonth() === 6 && [20, 21].includes(date.getDate());
  return (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 420 }}>
      <Calendar
        defaultValue="2026-07-15"
        minDate="2026-07-10"
        isDateDisabled={isDateDisabled}
        onChange={(date) => setPicked(`${date.getMonth() + 1}월 ${date.getDate()}일`)}
      />
      <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.6 }}>
        선택한 날짜: <output data-testid="picked-date">{picked || '없음'}</output>. 마감·휴무일은 흐리게·취소선으로 표시되어 선택되지 않습니다.
      </p>
    </main>
  );
}

export const BlockedDates = {
  name: '변형·상태 · 예약 불가일',
  parameters: storyDescription(
    '예약 가능일 흐름입니다. minDate 이전(지난 날짜)과 isDateDisabled로 지정한 마감일(7월 20·21일)이 비활성으로 표시되고, 클릭해도 선택되지 않는지 확인하세요. 비활성 날짜도 키보드 포커스로 지나갈 수는 있으나 선택만 차단됩니다.',
  ),
  render: () => <BlockedDatesFixture />,
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector('[role="grid"]');
    const output = canvasElement.querySelector('[data-testid="picked-date"]');
    if (!grid || !output) throw new Error('Calendar와 선택 결과 표시가 렌더되어야 합니다.');

    const disabledCells = [...grid.querySelectorAll('button[aria-disabled="true"]')];
    if (disabledCells.length < 3) {
      throw new Error('minDate 이전 날짜와 마감일이 aria-disabled로 비활성 표시되어야 합니다.');
    }
    const before = output.textContent;
    await userEvent.click(disabledCells[0]);
    if (output.textContent !== before) {
      throw new Error('비활성 날짜는 클릭해도 선택되지 않아야 합니다.');
    }

    const enabledMidMonth = [...grid.querySelectorAll('button:not([aria-disabled="true"])')]
      .find((button) => /1[2-9]일/.test(button.getAttribute('aria-label') || ''));
    if (!enabledMidMonth) throw new Error('선택 가능한 날짜가 있어야 합니다.');
    await userEvent.click(enabledMidMonth);
    if (output.textContent === before || output.textContent === '없음') {
      throw new Error('활성 날짜는 클릭 시 선택되어야 합니다.');
    }
  },
};

export const CalendarCard = { ...CalendarCardStory, name: 'Calendar card parity', tags: ['!dev', 'visual-parity'] };
