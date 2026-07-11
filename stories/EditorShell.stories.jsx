import React from 'react';
import { CanvasEditorShellEditorToolbarHistoryToolbarCard as CanvasEditorShellEditorToolbarHistoryToolbarCardStory } from './RoboticsAndViz.shared.jsx';
import { BasicShellExample, CanvasEditorShellMobileExample, ContextDrawerExample, WorkspaceRegionsExample } from './EditorShell.shared.jsx';

const meta = {
  title: 'LDS Robotics/Editor/Canvas Shell',
  parameters: {
    docs: {
      description: {
        component:
          'CanvasEditorShell은 문서 명령, 편집 도구, 계층, 중앙 뷰포트, 선택 속성, 수동 상태의 관계를 소유하는 LK Robotics 확장 프레임입니다. 좌우 패널은 접기·복원·키보드 리사이즈를 지원하며 제품 워크플로 자체는 포함하지 않습니다.',
      },
    },
  },
};

export default meta;

export const Basic = {
  name: '기본 셸',
  render: () => <BasicShellExample />,
};

export const WorkspaceRegions = {
  name: '통합 편집 워크스페이스',
  render: () => <WorkspaceRegionsExample />,
};

export const ContextDrawer = {
  name: '뷰포트 오버레이 인스펙터',
  render: () => <ContextDrawerExample />,
};

export const MobileActiveRegion = {
  name: '좁은 화면 영역 전환',
  render: () => {
    const [region, setRegion] = React.useState('canvas');
    return (
      <div style={{ width: 390, maxWidth: '100%', height: 620, margin: '0 auto' }}>
        <CanvasEditorShellMobileExample region={region} onRegionChange={setRegion} />
      </div>
    );
  },
};

export const CanvasEditorShellEditorToolbarHistoryToolbarCard = {
  ...CanvasEditorShellEditorToolbarHistoryToolbarCardStory,
  name: 'CanvasEditorShell · EditorToolbar · HistoryToolbar card parity',
  tags: ['!dev', 'visual-parity'],
};
