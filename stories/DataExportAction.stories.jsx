import React from 'react';
import { userEvent } from 'storybook/test';
import { DataExportAction } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Data/Operations/Export Action',
  tags: ['autodocs'],
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
    const groups = [...canvasElement.querySelectorAll('[role="group"][aria-label="데이터 내보내기"]')];
    if (!wrapper || wrapper.scrollWidth > wrapper.clientWidth + 1) throw new Error('Export actions must wrap without horizontal overflow at 320px.');
    if (progress?.getAttribute('aria-valuenow') !== '42' || !restricted || groups.length !== 2) {
      throw new Error('Processing and permission-restricted actions must expose progress, reason and a named action group.');
    }
    if (groups[0].querySelectorAll('[role="combobox"][disabled]').length !== 2) {
      throw new Error('처리 중에는 형식과 범위 선택이 잠겨야 합니다.');
    }

    const restrictedGroup = groups[1];
    const exportButton = [...restrictedGroup.querySelectorAll('button')].find((button) => button.textContent?.includes('내보내기'));
    if (!exportButton) throw new Error('Export action must expose a named trigger.');
    if (exportButton.hasAttribute('disabled')) {
      throw new Error('권한이 없는 export action에 native disabled를 쓰면 Tab으로 사유에 도달할 수 없고, 권한이 회수되는 순간 포커스가 <body>로 떨어집니다.');
    }
    if (exportButton.getAttribute('aria-disabled') !== 'true') {
      throw new Error('실행할 수 없는 export action은 aria-disabled로 활성화를 차단해야 합니다.');
    }
    const describedBy = exportButton.getAttribute('aria-describedby');
    if (!describedBy || canvasElement.ownerDocument.getElementById(describedBy) !== restricted) {
      throw new Error('사용할 수 없는 이유는 aria-describedby로 action에 연결되어야 합니다(Fluent Button 지침).');
    }
    exportButton.focus();
    if (canvasElement.ownerDocument.activeElement !== exportButton) {
      throw new Error('사용할 수 없는 export action도 포커스를 받아 사유를 발견할 수 있어야 합니다.');
    }
    exportButton.blur();
  },
};

function ExportStatusDemo() {
  const [state, setState] = React.useState('idle');
  return (
    <main data-testid="export-status" style={{ display: 'grid', gap: 'var(--space-4)', width: 'min(100%, 520px)' }}>
      <span style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <button type="button" onClick={() => setState('success')}>완료 상태</button>
        <button type="button" onClick={() => setState('error')}>실패 상태</button>
        <button type="button" onClick={() => setState('idle')}>초기 상태</button>
      </span>
      <DataExportAction state={state} totalCount={128} onExport={() => {}} />
    </main>
  );
}

export const ExportStatusRegionContract = {
  name: '완료·실패 알림 리전 계약',
  tags: ['!dev'],
  parameters: storyDescription(
    '내보내기 완료와 실패 알림의 라이브 리전 수명 계약입니다. status와 alert 리전이 idle에서도 이미 마운트되어 있고, 상태가 바뀔 때 새로 삽입되는 대신 같은 노드의 텍스트만 갱신되는지 확인합니다.',
  ),
  render: () => <ExportStatusDemo />,
  play: async ({ canvasElement }) => {
    const press = async (label) => {
      const trigger = [...canvasElement.querySelectorAll('button')].find((button) => button.textContent?.trim() === label);
      if (!trigger) throw new Error(`Fixture control "${label}" must exist.`);
      await userEvent.click(trigger);
    };
    const polite = canvasElement.querySelector('[data-export-live="polite"]');
    const assertive = canvasElement.querySelector('[data-export-live="assertive"]');
    if (polite?.getAttribute('role') !== 'status' || assertive?.getAttribute('role') !== 'alert') {
      throw new Error('완료는 status, 실패는 alert 리전이 담당해야 합니다.');
    }
    if (polite.textContent?.trim() !== '' || assertive.textContent?.trim() !== '') {
      throw new Error('idle 상태에서 두 리전은 비어 있는 채로 미리 마운트되어 있어야 합니다.');
    }

    await press('완료 상태');
    if (canvasElement.querySelector('[data-export-live="polite"]') !== polite) {
      throw new Error('상태가 바뀔 때 라이브 리전이 새로 마운트되면 낭독이 누락됩니다. 같은 노드의 텍스트만 바뀌어야 합니다.');
    }
    if (polite.textContent?.trim() !== '내보내기를 준비했습니다.' || assertive.textContent?.trim() !== '') {
      throw new Error('완료 메시지는 polite status 리전에만 실려야 합니다.');
    }
    const visibleSuccess = canvasElement.querySelector('[data-export-status="success"]');
    if (!visibleSuccess || visibleSuccess.hasAttribute('role')) {
      throw new Error('보이는 완료 문구는 남아 있되 표현만 담당해야 하며 두 번째 라이브 리전이 되면 안 됩니다.');
    }

    await press('실패 상태');
    if (canvasElement.querySelector('[data-export-live="assertive"]') !== assertive) {
      throw new Error('실패 전환에서도 alert 리전은 같은 노드여야 합니다.');
    }
    if (assertive.textContent?.trim() !== '내보내기를 완료하지 못했습니다.' || polite.textContent?.trim() !== '') {
      throw new Error('실패 메시지는 assertive alert 리전에만 실려야 합니다.');
    }

    await press('초기 상태');
    if (polite.textContent?.trim() !== '' || assertive.textContent?.trim() !== '') {
      throw new Error('상태를 되돌리면 두 리전의 텍스트도 비워져야 합니다.');
    }
    canvasElement.ownerDocument.activeElement?.blur?.();
  },
};

function SelectionScopeFallbackDemo() {
  const [selectedCount, setSelectedCount] = React.useState(3);
  const [formats, setFormats] = React.useState([
    { value: 'csv', label: 'CSV' },
    { value: 'xlsx', label: 'Excel' },
  ]);
  const [event, setEvent] = React.useState('요청 없음');
  return (
    <main style={{ display: 'grid', gap: 'var(--space-3)', width: 'min(100%, 520px)' }}>
      <span style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <button type="button" onClick={() => setSelectedCount(0)}>선택 해제</button>
        <button type="button" onClick={() => setFormats((current) => current.filter((option) => option.value !== 'csv'))}>CSV 제거</button>
      </span>
      <DataExportAction
        formats={formats}
        defaultFormatValue="csv"
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
  name: '사용법 · 사라진 옵션 복구',
  parameters: storyDescription(
    '선택된 행이나 format이 사라져 기존 선택을 더 이상 사용할 수 없는 상황입니다. control이 각각 첫 유효 옵션으로 복구되고 제거된 값으로 내보내지 않는지 확인하세요.',
  ),
  render: () => <SelectionScopeFallbackDemo />,
  play: async ({ canvasElement }) => {
    await userEvent.click([...canvasElement.querySelectorAll('button')].find((button) => button.textContent?.trim() === '선택 해제'));
    await userEvent.click([...canvasElement.querySelectorAll('button')].find((button) => button.textContent?.trim() === 'CSV 제거'));
    await userEvent.click([...canvasElement.querySelectorAll('button')].find((button) => button.textContent?.includes('내보내기')));
    if (canvasElement.querySelector('[data-testid="scope-fallback-event"]')?.textContent?.trim() !== 'xlsx · currentPage') {
      throw new Error('When selected rows or formats disappear, export must fall back to the first valid options.');
    }
  },
};
