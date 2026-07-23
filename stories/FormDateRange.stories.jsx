import React from 'react';
import { userEvent } from 'storybook/test';
import { DateRangeField, FilterChip } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Selection and Input/Date Range',
  component: DateRangeField,
  parameters: {
    layout: 'padded',
    storyGuide: {
      storyId: 'lds-product-selection-and-input-date-range--range-and-product-presets',
      eyebrow: 'Product / Date Range',
      title: '기간 입력은 시작일과 종료일의 관계를 하나의 선택으로 다룹니다',
      description:
        '조회·예약 기간처럼 두 날짜의 순서 검증과 자주 쓰는 preset이 필요할 때 적합합니다. 날짜 하나만 받는 폼에는 Date Range 대신 Date Picker를 사용하세요.',
    },
    docs: {
      description: {
        component: '두 날짜 선택기를 시작·종료 label, 순서 검증, preset slot과 함께 묶는 controlled 기간 입력 패턴입니다.',
      },
    },
  },
};

export default meta;

function ControlledRangeDemo() {
  const [range, setRange] = React.useState({ start: '2026-07-01', end: '2026-07-11' });
  return (
    <DateRangeField
      data-testid="controlled-date-range"
      value={range}
      onChange={setRange}
      presets={(
        <>
          <FilterChip size="sm" onClick={() => setRange({ start: '2026-07-11', end: '2026-07-11' })}>오늘</FilterChip>
          <FilterChip size="sm" onClick={() => setRange({ start: '2026-07-05', end: '2026-07-11' })}>최근 7일</FilterChip>
          <FilterChip size="sm" active onClick={() => setRange({ start: '2026-07-01', end: '2026-07-11' })}>이번 달</FilterChip>
        </>
      )}
      style={{ width: 'min(100%, 560px)' }}
    />
  );
}

export const RangeAndProductPresets = {
  name: '개요',
  parameters: storyDescription(
    'controlled 시작·종료 날짜와 오늘·최근 7일·이번 달 preset을 함께 사용합니다. preset 선택이 두 날짜를 일관되게 갱신하고 일반 키보드 제어로 남는지 확인하세요.',
  ),
  render: () => <ControlledRangeDemo />,
  play: async ({ canvasElement }) => {
    const preset = canvasElement.querySelector('button[aria-pressed="false"]');
    const presets = canvasElement.querySelectorAll('[data-date-range-presets] button');
    if (!preset || presets.length !== 3) throw new Error('Product date presets must remain normal focusable controls.');
    await userEvent.click(presets[1]);
    const start = canvasElement.querySelector('button[aria-label^="시작일,"]');
    const end = canvasElement.querySelector('button[aria-label^="종료일,"]');
    if (!start?.getAttribute('aria-label')?.includes('2026. 07. 05') || !end?.getAttribute('aria-label')?.includes('2026. 07. 11')) {
      throw new Error('A product-owned preset must update both controlled DatePicker triggers.');
    }
  },
};

export const NarrowInvalidRange = {
  name: '반응형 · 좁은 폭과 잘못된 순서',
  parameters: storyDescription(
    '320px 폭에서 종료일이 시작일보다 앞선 오류 상태입니다. 두 필드의 관계와 오류 메시지가 잘리지 않고 group의 invalid 상태로 전달되는지 확인하세요.',
  ),
  render: () => (
    <div data-testid="narrow-date-range" style={{ width: 320, maxWidth: '100%' }}>
      <DateRangeField defaultValue={{ start: '2026-07-11', end: '2026-07-01' }} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const wrapper = canvasElement.querySelector('[data-testid="narrow-date-range"]');
    const group = canvasElement.querySelector('[role="group"][aria-label="기간 선택"]');
    const alert = canvasElement.querySelector('[role="alert"]');
    if (!group || group.dataset.dateRangeInvalid !== 'true' || !alert) {
      throw new Error('A reversed date range must expose the invalid range state and a visible alert.');
    }
    if (group.hasAttribute('aria-invalid')) {
      throw new Error('role="group" does not support aria-invalid in ARIA 1.2; the date fields must carry it.');
    }
    if (group.getAttribute('aria-describedby') !== alert.id) {
      throw new Error('The range group must be described by the order-error alert.');
    }
    const triggers = [...canvasElement.querySelectorAll('button[aria-haspopup="dialog"]')];
    if (triggers.length !== 2 || triggers.some((trigger) => trigger.getAttribute('aria-invalid') !== 'true')) {
      throw new Error('Both date triggers must expose aria-invalid so the error reaches a role that supports it.');
    }
    if (triggers.some((trigger) => trigger.getAttribute('aria-describedby') !== alert.id)) {
      throw new Error('Each invalid date trigger must be described by the range error message.');
    }
    if (!wrapper || wrapper.scrollWidth > wrapper.clientWidth + 1) {
      throw new Error('DateRangeField must stack without horizontal overflow at 320px.');
    }
  },
};

export const RichLabelsAndDisabled = {
  name: '변형·상태 · 복합 라벨과 비활성 범위',
  parameters: storyDescription(
    'UTC 보조 표기가 있는 시작·종료 label과 전체 비활성 상태를 보여줍니다. 시각 label과 접근 가능한 이름이 분리되고 두 날짜가 모두 사용할 수 없음으로 전달되는지 확인하세요.',
  ),
  render: () => (
    <DateRangeField
      startLabel={<span>조회 시작 <small aria-hidden="true">UTC</small></span>}
      endLabel={<span>조회 종료 <small aria-hidden="true">UTC</small></span>}
      startAccessibleLabel="조회 시작일"
      endAccessibleLabel="조회 종료일"
      disabled
      style={{ width: 'min(100%, 560px)' }}
    />
  ),
  play: async ({ canvasElement }) => {
    const start = canvasElement.querySelector('button[aria-label^="조회 시작일"]');
    const end = canvasElement.querySelector('button[aria-label^="조회 종료일"]');
    if (!start?.disabled || !end?.disabled || start.getAttribute('aria-label')?.includes('[object Object]')) {
      throw new Error('Rich field labels need explicit plain accessible names and must preserve the disabled contract.');
    }
  },
};
