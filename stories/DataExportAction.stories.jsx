import React from 'react';
import { userEvent } from 'storybook/test';
import { DataExportAction } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Data/Operations/Export Action',
  component: DataExportAction,
  parameters: {
    layout: 'padded',
    storyGuide: {
      storyId: 'lds-product-data-operations-export-action--controlled-export',
      eyebrow: 'Product / Data / Export Action',
      title: '사용자가 내보낼 데이터 범위와 형식을 확인한 뒤 요청합니다',
      description:
        '전체 또는 선택 데이터를 파일로 만들며 형식·권한·진행 상태를 명시해야 할 때 적합합니다. 즉시 복사하거나 단일 링크를 내려받는 단순 작업에는 Export Action 대신 Copy Button 또는 Link를 사용하세요.',
    },
    docs: {
      description: {
        component: '내보내기 범위·형식·권한·진행 상태를 controlled 제품 action으로 다루는 DataExportAction 패턴입니다. 실제 파일 생성은 제품 콜백이 소유합니다.',
      },
    },
  },
};

export default meta;

function ExportDemo() {
  const [event, setEvent] = React.useState('요청 없음');
  return (
    <main style={{ display: 'grid', gap: 'var(--space-3)', width: 'min(100%, 820px)' }}>
      <DataExportAction
        selectedCount={3}
        totalCount={128}
        onExport={({ format, scope }) => setEvent(`${format} · ${scope}`)}
      />
      <span data-testid="operation-event" role="status" style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption1-size)' }}>{event}</span>
    </main>
  );
}

export const ControlledExport = {
  name: '개요',
  parameters: storyDescription(
    '선택 항목과 전체 항목 중 범위를 고르고 파일 형식을 선택해 내보내는 상황입니다. 사용자가 확정한 scope와 format이 제품 callback에 정확히 전달되는지 확인하세요.',
  ),
  render: () => <ExportDemo />,
  play: async ({ canvasElement }) => {
    const exportButton = [...canvasElement.querySelectorAll('button')].find((button) => button.textContent?.includes('내보내기'));
    const event = canvasElement.querySelector('[data-testid="operation-event"]');
    if (!exportButton || !event) throw new Error('Export must expose a normal focusable control and a product status target.');
    await userEvent.click(exportButton);
    if (event.textContent?.trim() !== 'csv · currentPage') throw new Error('Export must send the controlled format and scope to the product callback.');
  },
};

export const NarrowProgressAndPermission = {
  name: '반응형 · 좁은 폭의 진행과 권한 제한',
  parameters: storyDescription(
    '320px 폭에서 내보내기 진행 상태와 권한 부족 상태를 비교하는 상황입니다. 긴 상태 문구가 감싸지고 진행 중 중복 요청과 허용되지 않은 action이 차단되는지 확인하세요.',
  ),
  render: () => (
    <main data-testid="narrow-operations" style={{ display: 'grid', gap: 'var(--space-6)', width: 320, maxWidth: '100%' }}>
      <DataExportAction state="processing" progress={42} selectedCount={3} totalCount={128} />
      <DataExportAction allowed={false} unavailableReason="분석가 권한을 요청한 뒤 내보낼 수 있습니다." />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const wrapper = canvasElement.querySelector('[data-testid="narrow-operations"]');
    const progress = canvasElement.querySelector('[role="progressbar"]');
    const restricted = canvasElement.querySelector('[data-unavailable-reason]');
    const disabledButtons = [...canvasElement.querySelectorAll('button:disabled')];
    if (!wrapper || wrapper.scrollWidth > wrapper.clientWidth + 1) throw new Error('Export actions must wrap without horizontal overflow at 320px.');
    if (progress?.getAttribute('aria-valuenow') !== '42' || !restricted || disabledButtons.length < 1) {
      throw new Error('Processing and permission-restricted actions must expose progress, reason and disabled semantics.');
    }
  },
};

function SelectionScopeFallbackDemo() {
  const [selectedCount, setSelectedCount] = React.useState(3);
  const [event, setEvent] = React.useState('요청 없음');
  return (
    <main style={{ display: 'grid', gap: 'var(--space-3)', width: 'min(100%, 520px)' }}>
      <button type="button" onClick={() => setSelectedCount(0)}>선택 해제</button>
      <DataExportAction
        defaultScopeValue="selected"
        selectedCount={selectedCount}
        totalCount={128}
        onExport={({ format, scope }) => setEvent(`${format} · ${scope}`)}
      />
      <span data-testid="scope-fallback-event" role="status">{event}</span>
    </main>
  );
}

export const SelectionScopeFallback = {
  name: '사용법 · 사라진 선택 범위 복구',
  parameters: storyDescription(
    '선택된 행이 없어져 더 이상 selection scope를 사용할 수 없는 상황입니다. control이 유효한 전체 범위로 복구되고 잘못된 선택 상태로 내보내지 않는지 확인하세요.',
  ),
  render: () => <SelectionScopeFallbackDemo />,
  play: async ({ canvasElement }) => {
    await userEvent.click([...canvasElement.querySelectorAll('button')].find((button) => button.textContent?.trim() === '선택 해제'));
    await userEvent.click([...canvasElement.querySelectorAll('button')].find((button) => button.textContent?.includes('내보내기')));
    if (canvasElement.querySelector('[data-testid="scope-fallback-event"]')?.textContent?.trim() !== 'csv · currentPage') {
      throw new Error('When selected rows disappear, export must fall back to the first valid scope.');
    }
  },
};
