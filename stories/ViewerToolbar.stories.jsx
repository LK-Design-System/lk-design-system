import React from 'react';
import { Icon, Popover, Switch, ViewerToolbar, ViewerToolbarButton } from '../src/index.js';
import { ViewerToolbarCard as ViewerToolbarCardStory } from './RoboticsAndViz.shared.jsx';

const meta = {
  title: 'LDS Robotics/Viewer/Toolbar',
  parameters: {
    docs: {
      description: {
        component: '지도와 3D 뷰어 위에 떠서 줌, 초기화, 레이어, 표시 옵션을 제어하는 툴바입니다.',
      },
    },
  },
};

export default meta;

function MiniMapPreview({ layers }) {
  return (
    <svg width="360" height="220" viewBox="0 0 360 220" style={{ display: 'block' }} aria-label="툴바가 놓인 지도 예시">
      {layers.map && <rect x="28" y="24" width="304" height="172" fill="none" stroke="var(--inverse-label-alternative)" strokeWidth="2.5" />}
      {layers.map && <path d="M28 118 H132 M132 24 V118 M214 118 V196 M214 150 H332" fill="none" stroke="var(--inverse-label-disable)" strokeWidth="2.5" />}
      {layers.path && <polyline points="64,162 64,86 164,86 164,58 286,58" fill="none" stroke="var(--color-semantic-primary-normal)" strokeWidth="2.5" strokeDasharray="6 6" />}
      {layers.robots && <circle cx="64" cy="162" r="6" fill="var(--color-semantic-primary-normal)" />}
      {layers.robots && <circle cx="286" cy="58" r="6" fill="var(--color-semantic-primary-normal)" />}
    </svg>
  );
}

export const ViewerToolbarOverview = {
  name: '뷰어 툴바',
  render: () => {
    const [layers, setLayers] = React.useState({ map: true, path: true, robots: true });
    const anyOff = !layers.map || !layers.path || !layers.robots;

    return (
      <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 760 }}>
        <section style={{ position: 'relative', height: 300, borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--color-semantic-inverse-background)', border: '1px solid var(--color-semantic-line-normal-normal)' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
            <MiniMapPreview layers={layers} />
          </div>
          <ViewerToolbar orientation="horizontal" style={{ position: 'absolute', top: 12, right: 12 }}>
            <ViewerToolbarButton label="확대"><Icon name="plus" size={18} /></ViewerToolbarButton>
            <ViewerToolbarButton label="축소"><Icon name="minus" size={18} /></ViewerToolbarButton>
            <ViewerToolbarButton label="초기화"><Icon name="home" size={18} /></ViewerToolbarButton>
            <Popover align="right" width={168} trigger={<ViewerToolbarButton label="레이어" active={anyOff}><Icon name="filter" size={18} /></ViewerToolbarButton>}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--color-semantic-label-assistive)', margin: '0 0 8px 2px' }}>
                레이어
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Switch size="sm" label="지도" checked={layers.map} onChange={() => setLayers((value) => ({ ...value, map: !value.map }))} />
                <Switch size="sm" label="경로" checked={layers.path} onChange={() => setLayers((value) => ({ ...value, path: !value.path }))} />
                <Switch size="sm" label="로봇" checked={layers.robots} onChange={() => setLayers((value) => ({ ...value, robots: !value.robots }))} />
              </div>
            </Popover>
          </ViewerToolbar>
        </section>
        <section style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <ViewerToolbar orientation="horizontal">
            <ViewerToolbarButton label="확대"><Icon name="plus" size={18} /></ViewerToolbarButton>
            <ViewerToolbarButton label="축소"><Icon name="minus" size={18} /></ViewerToolbarButton>
            <ViewerToolbarButton label="레이어" active><Icon name="filter" size={18} /></ViewerToolbarButton>
          </ViewerToolbar>
          <ViewerToolbar orientation="vertical">
            <ViewerToolbarButton label="확대"><Icon name="plus" size={18} /></ViewerToolbarButton>
            <ViewerToolbarButton label="축소"><Icon name="minus" size={18} /></ViewerToolbarButton>
            <ViewerToolbarButton label="가시성" active><Icon name="eye" size={18} /></ViewerToolbarButton>
          </ViewerToolbar>
        </section>
      </main>
    );
  },
};

export const ViewerToolbarCard = { ...ViewerToolbarCardStory, name: 'ViewerToolbar card parity', tags: ['!dev', 'visual-parity'] };
