import React from 'react';
import { userEvent } from 'storybook/test';
import { Button } from '../components/buttons/Button.jsx';
import { VisibilityManager } from '../components/data/VisibilityManager.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

function createItems(longLabels) {
  return [
    {
      id: 'summary',
      label: longLabels ? '전체 로봇 가동률과 연결 상태를 한 번에 보여 주는 핵심 요약' : '전체 로봇 요약',
      description: '필수 위젯 · 표시 설정은 제품 정책으로 고정',
      visible: true,
      locked: true,
    },
    {
      id: 'maintenance',
      label: longLabels ? '예방 점검 예정 장치와 지연된 정비 작업의 긴 우선순위 목록' : '예방 점검 일정',
      description: '향후 30일의 점검 작업',
      visible: true,
    },
    {
      id: 'alerts',
      label: longLabels ? '경고 등급별 이벤트 추이와 담당 조직 에스컬레이션 현황' : '이벤트 위험 추이',
      description: 'WARN 이상 이벤트 집계',
      visible: false,
    },
  ];
}

function reorderItems(current, nextIds) {
  return nextIds.map((id) => current.find((item) => item.id === id)).filter(Boolean);
}

const meta = {
  title: 'LDS Product/Data/Operations/Visibility Manager',
  component: VisibilityManager,
  parameters: {
    layout: 'padded',
    storyGuide: {
      storyId: 'lds-product-data-operations-visibility-manager--visibility-and-order',
      eyebrow: 'Product / Data / Visibility Manager',
      title: '사용자가 데이터 영역의 표시 여부와 순서를 자신의 작업에 맞춥니다',
      description:
        '열·위젯·레이어처럼 여러 항목을 보이거나 숨기고 우선순위를 재정렬할 때 적합합니다. 단일 항목의 on/off나 서로 배타적인 보기 전환에는 Visibility Manager 대신 Switch 또는 Segmented Control을 사용하세요.',
    },
    docs: {
      description: {
        component: '열/위젯의 표시 여부와 순서를 제품 상태에 연결하는 controlled VisibilityManager 패턴입니다. persistence와 URL은 포함하지 않습니다.',
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

function VisibilityDemo({ narrow = false }) {
  const longLabels = narrow;
  const baseItems = React.useMemo(() => createItems(longLabels), [longLabels]);
  const [items, setItems] = React.useState(baseItems);
  const [actionLog, setActionLog] = React.useState('none');
  const [visibilityLog, setVisibilityLog] = React.useState('none');
  const [orderLog, setOrderLog] = React.useState('none');

  return (
    <main
      data-testid={narrow ? 'visibility-320' : 'visibility-normal'}
      style={{ display: 'grid', gap: 20, width: narrow ? 320 : 'min(100%, 780px)', maxWidth: '100%', minWidth: 0, margin: '0 auto', boxSizing: 'border-box' }}
    >
      <VisibilityManager
        items={items}
        description={longLabels
          ? '대시보드에서 보일 위젯을 선택하고 긴 이름의 위젯도 명명된 버튼으로 순서를 조정합니다.'
          : '대시보드 위젯의 표시 여부와 순서를 조정합니다.'}
        resetAction={(
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setItems(baseItems);
              setActionLog('reset');
            }}
          >
            기본값으로
          </Button>
        )}
        onVisibilityChange={(id, visible) => {
          setItems((current) => current.map((item) => (item.id === id ? { ...item, visible } : item)));
          setVisibilityLog(`${id}:${visible}`);
        }}
        onOrderChange={(nextIds, meta) => {
          setItems((current) => reorderItems(current, nextIds));
          setOrderLog(`${meta.reason}:${nextIds.join('>')}`);
        }}
      />
      <span data-testid="action-callback" hidden>{actionLog}</span>
      <span data-testid="visibility-callback" hidden>{visibilityLog}</span>
      <span data-testid="order-callback" hidden>{orderLog}</span>
    </main>
  );
}

export const VisibilityAndOrder = {
  name: '개요',
  parameters: storyDescription(
    '대시보드 위젯의 표시 상태를 바꾸고 순서를 재배치하는 상황입니다. 잠긴 필수 항목이 보호되고 visibility와 order callback이 올바른 대상을 전달하는지 확인하세요.',
  ),
  render: () => <VisibilityDemo />,
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-testid="visibility-normal"]');
    const visibilityLog = canvasElement.querySelector('[data-testid="visibility-callback"]');
    const unlocked = canvasElement.querySelector('[role="checkbox"][aria-label="예방 점검 일정 표시"]');
    const locked = canvasElement.querySelector('[role="checkbox"][aria-label$="표시 설정 고정됨"]');
    if (!fixture || !unlocked || !locked || locked.getAttribute('aria-disabled') !== 'true') {
      throw new Error('VisibilityManager must expose named visibility controls and a locked state.');
    }
    await userEvent.click(unlocked);
    if (visibilityLog?.textContent !== 'maintenance:false' || unlocked.getAttribute('aria-checked') !== 'false') {
      throw new Error('An unlocked visibility checkbox must emit and render the controlled value.');
    }
    const beforeLockedClick = visibilityLog.textContent;
    const lockedChecked = locked.getAttribute('aria-checked');
    await userEvent.click(locked);
    if (visibilityLog.textContent !== beforeLockedClick || locked.getAttribute('aria-checked') !== lockedChecked) {
      throw new Error('A locked visibility checkbox must not emit a change.');
    }

    const moveButton = canvasElement.querySelector('button[aria-label$="아래로 이동"]:not(:disabled)');
    await userEvent.click(moveButton);
    if (!canvasElement.querySelector('[data-testid="order-callback"]')?.textContent?.startsWith('button:')) {
      throw new Error('Explicit move buttons must emit the controlled ordering callback.');
    }
    assertNoHorizontalOverflow(fixture, 'The visibility composition must not overflow horizontally.');
  },
};

export const Narrow320LongLabels = {
  name: '반응형 · 320px와 긴 위젯 이름',
  parameters: storyDescription(
    '320px 폭에서 긴 위젯 이름과 설명을 가진 항목을 관리하는 상황입니다. 라벨·상태·순서 action이 겹치지 않고 가로 overflow 없이 읽히는지 확인하세요.',
  ),
  render: () => <VisibilityDemo narrow />,
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-testid="visibility-320"]');
    const manager = canvasElement.querySelector('[data-visibility-manager]');
    const list = manager?.querySelector('ul');
    if (!fixture || !manager || !list || fixture.getBoundingClientRect().width > 321) {
      throw new Error('The narrow visibility fixture must fit within its 320px maximum.');
    }
    [fixture, manager, list].forEach((element) => {
      assertNoHorizontalOverflow(element, 'Long widget labels and actions must stay inside the 320px composition.');
    });

    const locked = manager.querySelector('[role="checkbox"][aria-label$="표시 설정 고정됨"]');
    const moveButtons = manager.querySelectorAll('button[aria-label$="위로 이동"], button[aria-label$="아래로 이동"]');
    if (!locked || locked.getAttribute('aria-disabled') !== 'true' || moveButtons.length < 4) {
      throw new Error('The narrow manager must retain locked visibility and named non-drag ordering controls.');
    }
  },
};

export const ReadOnlyAndEmpty = {
  name: '변형·상태 · 읽기 전용과 빈 목록',
  parameters: storyDescription(
    '표시 설정을 볼 수만 있거나 관리할 항목이 없는 상황을 비교합니다. 읽기 전용 제약과 빈 상태가 구분되고 비활성 control이 편집 가능하게 보이지 않는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: 'min(100%, 620px)' }}>
      <VisibilityManager items={createItems(false)} />
      <VisibilityManager items={[]} onVisibilityChange={() => {}} onOrderChange={() => {}} />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const managers = canvasElement.querySelectorAll('[data-visibility-manager]');
    const manager = managers[0];
    const emptyManager = managers[1];
    const checkboxes = manager?.querySelectorAll('[role="checkbox"][aria-disabled="true"]');
    const moveButtons = manager?.querySelectorAll('button[aria-label$="위로 이동"], button[aria-label$="아래로 이동"]');
    if (!manager || checkboxes?.length !== 3 || moveButtons?.length !== 0 || manager.querySelector('[draggable="true"]')) {
      throw new Error('Visibility and order controls without callbacks must be disabled or omitted instead of no-op.');
    }
    if (!emptyManager?.textContent?.includes('관리할 항목이 없습니다')) {
      throw new Error('VisibilityManager must expose its named empty state.');
    }
  },
};
