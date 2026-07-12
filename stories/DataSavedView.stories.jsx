import React from 'react';
import { userEvent } from 'storybook/test';
import { Button } from '../components/buttons/Button.jsx';
import { SavedViewControl } from '../components/data/SavedViewControl.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const VIEWS = [
  { id: 'operations', label: '운영 기본 보기' },
  { id: 'maintenance', label: '점검 우선 보기' },
  { id: 'capacity', label: '용량 계획 보기' },
];

const LONG_VIEWS = [
  { id: 'operations', label: '수도권 전체 로봇 운영 현황과 장시간 미응답 장치 보기' },
  { id: 'maintenance', label: '예방 점검 예정일과 배터리 교체 우선순위를 함께 보는 보기' },
  { id: 'capacity', label: '충전소별 가동률과 작업 대기열 병목을 비교하는 용량 계획 보기' },
];

const meta = {
  title: 'LDS Product/Data/Operations/Saved View',
  component: SavedViewControl,
  parameters: {
    layout: 'padded',
    storyGuide: {
      storyId: 'lds-product-data-operations-saved-view--saved-view-actions',
      eyebrow: 'Product / Data / Saved View',
      title: '사용자가 자주 쓰는 데이터 구성을 이름으로 저장하고 다시 불러옵니다',
      description:
        '필터·정렬·열 구성을 반복해서 재사용하며 보기별 저장·이름 변경·삭제가 필요할 때 적합합니다. 일회성 필터나 단순 preset 선택에는 Saved View 대신 Filter Bar 또는 Select를 사용하세요.',
    },
    docs: {
      description: {
        component: '저장된 보기 선택과 저장·이름 변경·삭제 작업 슬롯을 제품 상태에 연결하는 controlled SavedViewControl 패턴입니다. persistence와 URL은 포함하지 않습니다.',
      },
    },
  },
};

export default meta;

function assertNoHorizontalOverflow(element, message) {
  if (!element || element.scrollWidth > element.clientWidth + 1) {
    throw new Error(message);
  }
}

function SavedViewDemo({ narrow = false }) {
  const [view, setView] = React.useState('operations');
  const [dirty, setDirty] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [selectionLog, setSelectionLog] = React.useState('none');
  const [actionLog, setActionLog] = React.useState('none');

  const action = (name) => () => {
    setActionLog(name);
    if (name === 'save') {
      setDirty(false);
      setSaving(true);
    }
  };

  return (
    <main
      data-testid={narrow ? 'saved-view-320' : 'saved-view-normal'}
      style={{ display: 'grid', gap: 20, width: narrow ? 320 : 'min(100%, 780px)', maxWidth: '100%', minWidth: 0, margin: '0 auto', boxSizing: 'border-box' }}
    >
      <SavedViewControl
        views={narrow ? LONG_VIEWS : VIEWS}
        value={view}
        onChange={(nextView) => {
          setView(nextView);
          setSelectionLog(nextView);
          setDirty(false);
          setSaving(false);
        }}
        dirty={dirty}
        saving={saving}
        saveAction={<Button size="sm" variant="primary" onClick={action('save')}>변경 저장</Button>}
        saveAsAction={<Button size="sm" variant="ghost" onClick={action('save-as')}>다른 이름으로 저장</Button>}
        renameAction={<Button size="sm" variant="ghost" onClick={action('rename')}>이름 변경</Button>}
        deleteAction={<Button size="sm" variant="danger" onClick={action('delete')}>보기 삭제</Button>}
      />
      <span data-testid="selection-callback" hidden>{selectionLog}</span>
      <span data-testid="action-callback" hidden>{actionLog}</span>
    </main>
  );
}

export const SavedViewActions = {
  name: '개요',
  parameters: storyDescription(
    '저장된 보기를 전환하고 현재 구성을 저장·이름 변경·삭제하는 상황입니다. 선택된 보기와 action 대상이 일치하고 읽기 순서가 예측 가능한지 확인하세요.',
  ),
  render: () => <SavedViewDemo />,
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-testid="saved-view-normal"]');
    const select = canvasElement.querySelector('select');
    const dirtyStatus = canvasElement.querySelector('[role="status"]');
    if (!fixture || !select || dirtyStatus?.textContent?.trim() !== '저장되지 않은 변경') {
      throw new Error('SavedViewControl must expose its native selection and visible dirty status.');
    }

    await userEvent.selectOptions(select, 'maintenance');
    if (select.value !== 'maintenance' || canvasElement.querySelector('[data-testid="selection-callback"]')?.textContent !== 'maintenance') {
      throw new Error('Selecting a named view must emit the controlled product callback.');
    }

    const actionButtons = [...canvasElement.querySelectorAll('[aria-label="저장된 보기 작업"] button')];
    const actionNames = actionButtons.map((button) => button.textContent?.trim());
    if (!['변경 저장', '다른 이름으로 저장', '이름 변경', '보기 삭제'].every((name) => actionNames.includes(name))) {
      throw new Error('SavedViewControl must preserve save, save-as, rename, and delete action slots.');
    }
    const saveAs = actionButtons.find((button) => button.textContent?.trim() === '다른 이름으로 저장');
    await userEvent.click(saveAs);
    if (canvasElement.querySelector('[data-testid="action-callback"]')?.textContent !== 'save-as') {
      throw new Error('Saved-view action slots must preserve the product callback.');
    }
    assertNoHorizontalOverflow(fixture, 'The saved-view composition must not overflow horizontally.');

    const save = actionButtons.find((button) => button.textContent?.trim() === '변경 저장');
    await userEvent.click(save);
    const savedView = canvasElement.querySelector('[data-saved-view-control]');
    if (
      canvasElement.querySelector('[data-testid="action-callback"]')?.textContent !== 'save'
      || savedView?.getAttribute('aria-busy') !== 'true'
      || savedView.querySelector('[role="status"]')?.textContent?.trim() !== '저장 중'
    ) {
      throw new Error('The product save slot must be able to drive the controlled saving status.');
    }
  },
};

export const Narrow320LongLabels = {
  name: '반응형 · 320px와 긴 보기 이름',
  parameters: storyDescription(
    '320px 폭에서 긴 저장 보기 이름과 관리 action을 사용하는 상황입니다. 라벨이 의미를 잃지 않고 감싸지며 메뉴와 버튼이 표면 밖으로 넘치지 않는지 확인하세요.',
  ),
  render: () => <SavedViewDemo narrow />,
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-testid="saved-view-320"]');
    const savedView = canvasElement.querySelector('[data-saved-view-control]');
    if (!fixture || !savedView || fixture.getBoundingClientRect().width > 321) {
      throw new Error('The narrow saved-view fixture must fit within its 320px maximum.');
    }
    [fixture, savedView].forEach((element) => {
      assertNoHorizontalOverflow(element, 'Long saved-view labels and actions must stay inside the 320px composition.');
    });

    const select = savedView.querySelector('select');
    await userEvent.selectOptions(select, 'maintenance');
    if (select.value !== 'maintenance' || canvasElement.querySelector('[data-testid="selection-callback"]')?.textContent !== 'maintenance') {
      throw new Error('Native saved-view selection must remain operable at 320px.');
    }
  },
};

export const EmptyAndReadOnly = {
  name: '변형·상태 · 빈 보기와 읽기 전용',
  parameters: storyDescription(
    '저장된 보기가 없거나 사용자에게 관리 권한이 없는 상황을 비교합니다. 빈 상태의 다음 행동과 읽기 전용 제한이 서로 다른 방식으로 명확히 전달되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: 'min(100%, 620px)' }}>
      <SavedViewControl views={[]} onChange={() => {}} />
      <SavedViewControl views={VIEWS} value="operations" />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const selects = canvasElement.querySelectorAll('select:disabled');
    if (selects.length !== 2 || !selects[0].textContent?.includes('저장된 보기가 없습니다')) {
      throw new Error('Empty and handler-less saved views must expose disabled native selects.');
    }
  },
};
