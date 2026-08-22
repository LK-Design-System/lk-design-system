import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Calendar } from '../src/index.js';
import { CalendarCard as CalendarCardStory } from './DataDisplay.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Selection and Input/Calendar',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-selection-and-input-calendar--calendar-pattern',
      eyebrow: 'Core / Calendar',
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

export const KeyboardMonthNavigationContract = {
  name: '키보드 월 탐색 계약',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 420 }}>
      <Calendar data-testid="keyboard-calendar" defaultValue="2026-07-15" />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const root = canvasElement.querySelector('[data-testid="keyboard-calendar"]');
    const grid = root?.querySelector('[role="grid"]');
    if (!root || !grid) throw new Error('Calendar 그리드가 렌더되어야 합니다.');

    const month = () => grid.getAttribute('aria-label');
    const expectMonth = async (expected, message) => {
      await waitFor(() => {
        if (month() !== expected) throw new Error(`${message} (표시 중인 달: ${month()})`);
      });
    };
    const focusedLabel = () => doc.activeElement?.getAttribute('aria-label') || '';
    const expectFocusedDate = async (fragment, message) => {
      await waitFor(() => {
        if (!focusedLabel().includes(fragment)) throw new Error(`${message} (초점: ${focusedLabel() || '없음'})`);
      });
    };

    await expectMonth('2026년 7월', '선택 날짜가 있는 달로 시작해야 합니다.');

    const selectedButton = grid.querySelector('button[aria-label*="선택됨"]');
    if (!selectedButton?.getAttribute('aria-label')?.includes('7월 15일')) {
      throw new Error('선택된 날짜 button의 accessible name에 선택 상태가 실려야 합니다.');
    }
    if (selectedButton.closest('[role="gridcell"]')?.getAttribute('aria-selected') !== 'true') {
      throw new Error('선택된 날짜의 gridcell은 aria-selected="true"를 노출해야 합니다.');
    }

    const tabStops = grid.querySelectorAll('button[tabindex="0"]');
    if (tabStops.length !== 1) {
      throw new Error(`날짜 그리드는 roving Tab stop 하나만 노출해야 하는데 ${tabStops.length}개입니다.`);
    }
    /* 초점 이벤트는 일부러 보내지 않는다. 그리드 탐색은 activeElement만 사용하고,
       focus 상태를 켜면 캡처에 초점 링이 남아 이름난 상태가 오염된다. */
    tabStops[0].focus();
    if (doc.activeElement !== tabStops[0]) throw new Error('roving Tab stop이 초점을 받아야 합니다.');

    // 회귀 가드: 선택 값이 있으면 view가 선택된 달로 되돌려지던 버그.
    await userEvent.keyboard('{PageDown}');
    await expectMonth('2026년 8월', '선택 값이 있어도 PageDown이 다음 달로 이동해야 합니다.');
    await userEvent.keyboard('{PageUp}');
    await expectMonth('2026년 7월', 'PageUp이 이전 달로 돌아와야 합니다.');

    await userEvent.keyboard('{Shift>}{PageDown}{/Shift}');
    await expectMonth('2027년 7월', 'Shift+PageDown은 다음 해로 이동해야 합니다.');
    await userEvent.keyboard('{Shift>}{PageUp}{/Shift}');
    await expectMonth('2026년 7월', 'Shift+PageUp은 이전 해로 돌아와야 합니다.');

    for (let step = 0; step < 3; step += 1) await userEvent.keyboard('{ArrowDown}');
    await expectMonth('2026년 8월', 'Arrow 이동은 월 경계를 넘어야 합니다.');
    await expectFocusedDate('8월 5일', '월 경계를 넘은 뒤 초점이 이동한 날짜에 있어야 합니다.');
    for (let step = 0; step < 3; step += 1) await userEvent.keyboard('{ArrowUp}');
    await expectMonth('2026년 7월', 'ArrowUp도 월 경계를 넘어 돌아와야 합니다.');
    await expectFocusedDate('7월 15일', 'Arrow 왕복 후 원래 날짜로 돌아와야 합니다.');

    await userEvent.keyboard('{Home}');
    await expectFocusedDate('7월 12일 일요일', 'Home은 주의 시작으로 이동해야 합니다.');
    await userEvent.keyboard('{End}');
    await expectFocusedDate('7월 18일 토요일', 'End는 주의 끝으로 이동해야 합니다.');

    const next = root.querySelector('button[aria-label="다음 달"]');
    const previous = root.querySelector('button[aria-label="이전 달"]');
    if (!next || !previous) throw new Error('이전·다음 달 버튼이 있어야 합니다.');

    await userEvent.click(next);
    await expectMonth('2026년 8월', '다음 달 버튼은 선택 값이 있어도 달을 이동해야 합니다.');
    if (grid.contains(doc.activeElement)) {
      throw new Error('월 이동 버튼은 초점을 날짜 셀로 빼앗지 않아야 합니다. 버튼을 연타해 여러 달을 넘길 수 없게 됩니다.');
    }
    await userEvent.click(next);
    await expectMonth('2026년 9월', '월 이동 버튼 연타로 여러 달을 넘길 수 있어야 합니다.');
    await userEvent.click(previous);
    await userEvent.click(previous);
    await expectMonth('2026년 7월', '이전 달 버튼도 같은 계약을 따라야 합니다.');

    const stillSelected = grid.querySelector('button[aria-label*="선택됨"]');
    if (!stillSelected?.getAttribute('aria-label')?.includes('7월 15일')) {
      throw new Error('월 탐색은 선택 값을 바꾸지 않아야 합니다.');
    }

    // 이름난 상태로 복귀: 2026년 7월 그리드, 초점 없음.
    doc.activeElement?.blur?.();
  },
};

export const CalendarCard = { ...CalendarCardStory, name: 'Calendar card parity', tags: ['!dev', 'visual-parity'] };
