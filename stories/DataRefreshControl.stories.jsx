import React from 'react';
import { userEvent } from 'storybook/test';
import { RefreshControl } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const AUTO_REFRESH_OPTIONS = [
  { value: 'off', label: '자동 갱신 끔' },
  { value: '30s', label: '30초마다' },
  { value: '5m', label: '5분마다' },
];

const meta = {
  title: 'LDS Product/Data/Operations/Refresh Control',
  component: RefreshControl,
  parameters: {
    layout: 'padded',
    storyGuide: {
      storyId: 'lds-product-data-operations-refresh-control--controlled-refresh',
      eyebrow: 'Product / Data / Refresh Control',
      title: '사용자가 데이터의 최신 시점과 갱신 방식을 함께 판단합니다',
      description:
        '실시간이 아닌 데이터에서 마지막 갱신 시점·수동 갱신·자동 주기를 제어할 때 적합합니다. 저장이나 제출처럼 데이터 자체를 변경하는 action에는 Refresh Control 대신 명시적인 Button과 작업 상태를 사용하세요.',
    },
    docs: {
      description: {
        component: '데이터 freshness 표시와 수동·자동 새로고침 요청을 담당하는 controlled RefreshControl 패턴입니다. 실제 갱신 실행은 제품 콜백이 소유합니다.',
      },
    },
  },
};

export default meta;

function RefreshDemo() {
  const [event, setEvent] = React.useState('요청 없음');
  const [interval, setInterval] = React.useState('30s');
  return (
    <main style={{ display: 'grid', gap: 'var(--space-3)', width: 'min(100%, 820px)' }}>
      <RefreshControl
        lastUpdated="오늘 14:32"
        autoRefreshValue={interval}
        autoRefreshOptions={AUTO_REFRESH_OPTIONS}
        onAutoRefreshChange={setInterval}
        onRefresh={() => setEvent('새로고침 요청')}
      />
      <span data-testid="operation-event" role="status" style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption1-size)' }}>{event}</span>
    </main>
  );
}

export const ControlledRefresh = {
  name: '개요',
  parameters: storyDescription(
    '마지막 갱신 시점을 확인하고 수동 새로고침이나 자동 갱신 주기를 바꾸는 상황입니다. 요청 callback과 선택 주기가 제품 상태에 정확히 전달되는지 확인하세요.',
  ),
  render: () => <RefreshDemo />,
  play: async ({ canvasElement }) => {
    const refreshButton = [...canvasElement.querySelectorAll('button')].find((button) => button.getAttribute('aria-label') === '새로고침');
    const event = canvasElement.querySelector('[data-testid="operation-event"]');
    if (!refreshButton || !event) throw new Error('Refresh must expose a normal focusable control and a product status target.');
    await userEvent.click(refreshButton);
    if (event.textContent?.trim() !== '새로고침 요청') throw new Error('Refresh must delegate execution to the product callback.');
  },
};

export const RefreshingNarrow = {
  name: '반응형 · 좁은 폭의 갱신 중 상태',
  parameters: storyDescription(
    '320px 폭에서 데이터가 갱신 중인 상태를 보여 주는 상황입니다. 진행 상태와 마지막 갱신 정보가 잘리지 않고 중복 새로고침이 방지되는지 확인하세요.',
  ),
  render: () => (
    <main data-testid="narrow-refresh" style={{ display: 'grid', gap: 'var(--space-4)', width: 320, maxWidth: '100%' }}>
      <RefreshControl refreshing lastUpdated="오늘 14:21" autoRefreshValue="30s" autoRefreshOptions={AUTO_REFRESH_OPTIONS} />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const wrapper = canvasElement.querySelector('[data-testid="narrow-refresh"]');
    if (!wrapper || wrapper.scrollWidth > wrapper.clientWidth + 1) throw new Error('RefreshControl must wrap without horizontal overflow at 320px.');
    const interval = [...canvasElement.querySelectorAll('button')].find((button) => button.getAttribute('aria-label') === '자동 새로고침 간격');
    if (!interval?.disabled) throw new Error('An auto-refresh control without a change callback must not remain interactive.');
  },
};
