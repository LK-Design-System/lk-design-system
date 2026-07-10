import React from 'react';
import { Button, DescriptionList, DockPanel } from '../src/index.js';

const meta = {
  title: 'LDS Product/Layout/Dock Panel',
  parameters: {
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
    <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
      <Button size="sm" variant="outlined" color="assistive">
        취소
      </Button>
      <Button size="sm" variant="solid" color="primary">
        적용
      </Button>
    </div>
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
  name: '도킹 패널',
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
  name: '접힌 핸들',
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
  name: '왼쪽 도킹',
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
  name: '제어 상태',
  render: () => <ControlledExample />,
};

export const Resizable = {
  name: '너비 조절',
  render: () => <ResizableExample />,
};
