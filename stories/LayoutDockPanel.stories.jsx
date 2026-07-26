import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { ActionArea, Button, DescriptionList, DockPanel } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Layout/Dock Panel',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-product-layout-dock-panel--dock-panels',
      eyebrow: 'Product / Dock Panel',
      title: '사용자가 캔버스를 유지한 채 선택 항목의 속성을 열고 조정합니다',
      description:
        '맵·에디터처럼 지속되는 작업 캔버스 가장자리에 속성이나 레이어 도구를 접어 두고 쓸 때 적합합니다. 일반 페이지의 임시 보조 작업이나 모바일 선택에는 DockPanel 대신 Drawer 또는 Sheet를 사용하세요.',
    },
    docs: {
      description: {
        component:
          '캔버스 위에서 돌출 핸들로 접고 펼치는 사이드 도킹 패널 DockPanel 패턴입니다. 맵·에디터 속성 패널에 씁니다.',
      },
    },
  },
};

export default meta;

function CanvasFrame({ children, label = '맵 캔버스' }) {
  return (
    <main
      style={{
        position: 'relative',
        height: 340,
        maxWidth: 760,
        overflow: 'hidden',
        border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-lg)',
        background:
          'linear-gradient(90deg, var(--color-semantic-line-normal-alternative) 1px, transparent 1px), linear-gradient(0deg, var(--color-semantic-line-normal-alternative) 1px, transparent 1px), var(--color-semantic-fill-normal)',
        backgroundSize: '32px 32px',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          color: 'var(--color-semantic-label-assistive)',
          fontSize: 'var(--label2-size)',
          lineHeight: 'var(--label2-line)',
          fontWeight: 'var(--fw-semibold)',
          letterSpacing: 0,
        }}
      >
        {label}
      </div>

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '18%',
          top: '28%',
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: 'var(--color-semantic-primary-normal)',
          boxShadow:
            '96px 52px 0 var(--color-semantic-status-positive), 220px -20px 0 var(--color-semantic-status-cautionary)',
        }}
      />

      {children}
    </main>
  );
}

const waypointItems = [
  { term: 'ID', description: 'WP-021' },
  { term: '좌표', description: '12.4, 3.1' },
  { term: '방향', description: '90deg' },
  { term: '연결', description: '3개 라인' },
];

const layerItems = [
  { term: '레이어', description: 'navigation' },
  { term: '표시', description: '경로, 존, 금지 영역' },
  { term: '스냅', description: '0.25m' },
];

function PanelBody({ items = waypointItems }) {
  return <DescriptionList columns={1} items={items} />;
}

function PanelFooter() {
  return (
    <ActionArea align="end" divider={false} style={{ padding: 0, background: 'transparent' }}>
      <Button variant="outlined" color="assistive">
        취소
      </Button>
      <Button variant="solid" color="primary">
        적용
      </Button>
    </ActionArea>
  );
}

function ControlledExample() {
  const [open, setOpen] = React.useState(true);
  const [width, setWidth] = React.useState(280);

  return (
    <CanvasFrame label={open ? `패널 열림 · ${width}px` : '패널 접힘'}>
      <div style={{ position: 'absolute', top: 'var(--space-3)', left: 'var(--space-3)' }}>
        <Button
          size="sm"
          variant="outlined"
          color="assistive"
          onClick={() => setOpen((value) => !value)}
        >
          패널 전환
        </Button>
      </div>
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0 }}>
        <DockPanel
          side="right"
          title="레이어"
          open={open}
          onOpenChange={setOpen}
          width={width}
          minWidth={240}
          maxWidth={420}
          resizable
          onWidthChange={setWidth}
        >
          <PanelBody items={layerItems} />
        </DockPanel>
      </div>
    </CanvasFrame>
  );
}

function ResizableExample() {
  const [width, setWidth] = React.useState(320);

  return (
    <CanvasFrame label={`드래그 또는 화살표 키 · ${width}px`}>
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0 }}>
        <DockPanel
          side="right"
          title="속성 패널"
          width={width}
          minWidth={240}
          maxWidth={460}
          resizable
          onWidthChange={setWidth}
        >
          <PanelBody />
        </DockPanel>
      </div>
    </CanvasFrame>
  );
}

export const DockPanels = {
  name: '개요',
  parameters: storyDescription(
    '맵 캔버스 오른쪽에서 웨이포인트 속성을 보고 적용하는 기본 상황입니다. 패널 제목·본문·footer가 캔버스와 구분되고 열림 핸들과 resize 경계가 명확한지 확인하세요.',
  ),
  render: () => (
    <CanvasFrame>
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0 }}>
        <DockPanel
          side="right"
          title="웨이포인트 속성"
          defaultOpen
          width={300}
          minWidth={260}
          maxWidth={440}
          resizable
          footer={<PanelFooter />}
        >
          <PanelBody />
        </DockPanel>
      </div>
    </CanvasFrame>
  ),
};

export const Collapsed = {
  name: '시나리오 · 접힌 상태',
  parameters: storyDescription(
    '캔버스 공간을 확보하기 위해 패널을 접어 둔 상황입니다. 내용은 숨겨지되 다시 열 수 있는 핸들의 목적과 패널 방향을 사용자가 알아볼 수 있는지 확인하세요.',
  ),
  render: () => (
    <CanvasFrame label="접힌 패널">
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0 }}>
        <DockPanel side="right" title="웨이포인트 속성" defaultOpen={false}>
          <PanelBody />
        </DockPanel>
      </div>
    </CanvasFrame>
  ),
};

export const LeftSide = {
  name: '시나리오 · 왼쪽 배치',
  parameters: storyDescription(
    '레이어 도구를 캔버스 왼쪽 가장자리에 도킹하는 상황입니다. side 변경 후에도 핸들·제목·내용 정렬과 캔버스 경계가 자연스럽게 반전되는지 확인하세요.',
  ),
  render: () => (
    <CanvasFrame label="좌측 레이어 패널">
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0 }}>
        <DockPanel side="left" title="레이어" width={280} defaultOpen>
          <PanelBody items={layerItems} />
        </DockPanel>
      </div>
    </CanvasFrame>
  ),
};

export const Controlled = {
  name: '상호작용 · 외부 제어 상태',
  parameters: storyDescription(
    '제품 상태가 패널의 열림 여부와 너비를 직접 제어하는 상황입니다. 외부 전환 버튼과 패널 핸들이 같은 상태를 반영하고 width 변경이 유실되지 않는지 확인하세요.',
  ),
  render: () => <ControlledExample />,
};

export const Resizable = {
  name: '시나리오 · 너비 조절',
  parameters: storyDescription(
    '긴 속성 내용을 보기 위해 패널 너비를 포인터 또는 화살표 키로 조절하는 상황입니다. min·max 범위, 현재 폭 반영, 캔버스 overflow 방지를 확인하세요.',
  ),
  render: () => <ResizableExample />,
};

// min/max are whole multiples of the 16px resize step away from the start width
// so the play can walk back to the story's named state exactly.
function ContractExample() {
  const [width, setWidth] = React.useState(320);

  return (
    <CanvasFrame label="속성 패널 계약">
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0 }}>
        <DockPanel
          data-contract="dock"
          side="right"
          title="속성 패널"
          width={width}
          minWidth={240}
          maxWidth={448}
          resizable
          onWidthChange={setWidth}
        >
          <PanelBody />
        </DockPanel>
      </div>
    </CanvasFrame>
  );
}

export const DockPanelKeyboardContract = {
  name: '도킹 패널 리사이즈와 접기 계약',
  tags: ['!dev'],
  render: () => <ContractExample />,
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const dock = canvasElement.querySelector('[data-contract="dock"]');
    const panel = dock?.querySelector('aside');
    const handle = dock?.querySelector('button[aria-expanded]');
    const separator = dock?.querySelector('[role="separator"]');
    if (!dock || !panel || !handle || !separator) throw new Error('DockPanel contract targets are required.');

    const valueNow = () => Number(separator.getAttribute('aria-valuenow'));
    const expectWidth = async (expected, message) => {
      await waitFor(() => {
        if (valueNow() !== expected) throw new Error(`${message} (aria-valuenow=${separator.getAttribute('aria-valuenow')})`);
      });
    };

    if (separator.getAttribute('aria-orientation') !== 'vertical') throw new Error('separator는 세로 방향이어야 합니다.');
    if (separator.getAttribute('aria-controls') !== panel.id) throw new Error('separator는 조절 대상 패널을 가리켜야 합니다.');
    if (handle.getAttribute('aria-controls') !== panel.id) throw new Error('핸들도 같은 패널을 가리켜야 합니다.');
    if (separator.getAttribute('aria-label') !== '속성 패널 너비 조절') throw new Error('separator에는 대상을 밝히는 한국어 이름이 필요합니다.');
    if (separator.getAttribute('aria-valuemin') !== '240' || separator.getAttribute('aria-valuemax') !== '448') {
      throw new Error('separator는 조절 범위를 노출해야 합니다.');
    }
    if (separator.getAttribute('tabindex') !== '0') throw new Error('separator는 키보드로 접근할 수 있어야 합니다.');
    await expectWidth(320, '초기 너비가 aria-valuenow로 노출되어야 합니다.');

    separator.focus();
    if (doc.activeElement !== separator) throw new Error('separator가 포커스를 받아야 합니다.');
    await userEvent.keyboard('{ArrowLeft}');
    await expectWidth(336, '오른쪽 도킹에서 ArrowLeft는 패널을 넓혀야 합니다.');
    await userEvent.keyboard('{ArrowRight}');
    await expectWidth(320, 'ArrowRight는 패널을 좁혀야 합니다.');
    await userEvent.keyboard('{Shift>}{ArrowLeft}{/Shift}');
    await expectWidth(384, 'Shift와 함께 누르면 4배 폭으로 움직여야 합니다.');
    await userEvent.keyboard('{Shift>}{ArrowRight}{/Shift}');
    await expectWidth(320, 'Shift 반대 방향도 4배 폭이어야 합니다.');
    await userEvent.keyboard('{Home}');
    await expectWidth(240, 'Home은 최소 너비로 이동해야 합니다.');
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}');
    await expectWidth(320, '최소 너비에서 다시 넓힐 수 있어야 합니다.');
    await userEvent.keyboard('{End}');
    await expectWidth(448, 'End는 최대 너비로 이동해야 합니다.');
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}');
    await expectWidth(320, '최대 너비에서 다시 좁힐 수 있어야 합니다.');

    // separator는 <aside>의 형제라, 여기서 누른 Escape도 패널을 접어야 합니다.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (handle.getAttribute('aria-expanded') !== 'false') throw new Error('separator에서 Escape를 눌러도 패널이 접혀야 합니다.');
      if (!panel.hasAttribute('hidden') || panel.getAttribute('aria-hidden') !== 'true') {
        throw new Error('접힌 패널은 hidden과 aria-hidden으로 접근성 트리에서 빠져야 합니다.');
      }
      if (doc.activeElement !== handle) throw new Error('접힐 때 초점을 핸들로 복원해야 합니다.');
    });

    // Restore the story's named state: open, 320px, nothing focused.
    await userEvent.click(handle);
    await waitFor(() => {
      if (handle.getAttribute('aria-expanded') !== 'true') throw new Error('핸들로 패널을 다시 펼칠 수 있어야 합니다.');
      const reopened = dock.querySelector('[role="separator"]');
      if (!reopened || reopened.getAttribute('aria-valuenow') !== '320') throw new Error('다시 열면 조절한 너비가 유지되어야 합니다.');
    });
    handle.blur();
  },
};
