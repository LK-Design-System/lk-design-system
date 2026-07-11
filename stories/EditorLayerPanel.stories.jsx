import React from 'react';
import { LayerPanel } from '../src/index.js';
import { EditorStoryFrame, editorLayers } from './EditorShell.shared.jsx';

const meta = {
  title: 'LDS Robotics/Editor/Layer Panel',
  component: LayerPanel,
  parameters: {
    docs: {
      description: {
        component:
          'LayerPanel은 실제 레이어 모델의 선택, 표시, 잠금, 상태와 중첩 구조를 관리합니다. 트리 방향키·Home/End·문자 탐색, F2 행 작업 모드와 제어/비제어 확장을 지원합니다.',
      },
    },
  },
};

export default meta;

function PanelFrame({ children }) {
  return (
    <EditorStoryFrame maxWidth={320} height={420}>
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          border: '1px solid var(--color-semantic-line-normal-normal)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--color-semantic-background-elevated-normal)',
        }}
      >
        {children}
      </div>
    </EditorStoryFrame>
  );
}

export const Interactive = {
  name: '확장된 계층과 상호작용',
  render: () => (
    <PanelFrame>
      <LayerPanel layers={editorLayers} defaultActiveLayerId="routes" />
    </PanelFrame>
  ),
};

function ControlledExpansionExample() {
  const [expandedIds, setExpandedIds] = React.useState([]);

  return (
    <PanelFrame>
      <LayerPanel
        layers={editorLayers}
        defaultActiveLayerId="geometry"
        expandedLayerIds={expandedIds}
        onExpandedLayerIdsChange={(ids) => setExpandedIds(ids)}
      />
    </PanelFrame>
  );
}

export const ControlledExpansion = {
  name: '접힌 계층·제어 확장',
  render: () => <ControlledExpansionExample />,
};

export const VisibleStatusLabels = {
  name: '색상과 상태 텍스트 병행',
  render: () => (
    <PanelFrame>
      <LayerPanel
        defaultActiveLayerId="routes"
        layers={editorLayers.map((layer) => (
          layer.id === 'geometry'
            ? {
                ...layer,
                tone: 'positive',
                toneLabel: 'Ready',
                children: layer.children.map((child) => (
                  child.id === 'regions'
                    ? { ...child, tone: 'warning', toneLabel: 'Review' }
                    : child
                )),
              }
            : layer
        ))}
      />
    </PanelFrame>
  ),
};

export const Empty = {
  name: '레이어 없음',
  render: () => (
    <PanelFrame>
      <LayerPanel layers={[]} emptyLabel="표시할 레이어가 없습니다." />
    </PanelFrame>
  ),
};

export const Disabled = {
  name: '레이어 전체 비활성',
  render: () => (
    <PanelFrame>
      <LayerPanel layers={editorLayers} defaultActiveLayerId="routes" disabled />
    </PanelFrame>
  ),
};

export const MixedAvailability = {
  name: '첫 행 비활성·포커스 이동 유지',
  render: () => (
    <PanelFrame>
      <LayerPanel
        layers={[
          { id: 'unavailable', label: 'Unavailable reference', tone: 'neutral', disabled: true },
          ...editorLayers,
        ]}
      />
    </PanelFrame>
  ),
};
