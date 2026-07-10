import React from 'react';
import { CanvasEditorShellEditorToolbarHistoryToolbarCard as CanvasEditorShellEditorToolbarHistoryToolbarCardStory } from './RoboticsAndViz.shared.jsx';
import { MapEditorExample, ShellContractExample, TaskAuthoringExample } from './EditorShell.shared.jsx';

const meta = {
  title: 'LDS Robotics/Editor/Canvas Shell',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'CanvasEditorShell의 공통 프레임과 실제 lk_web_viz 작업 생성·맵 편집 상태를 분리해 검수합니다. 상태 이름은 Storybook에만 있고 제품 화면에는 표시하지 않습니다.',
      },
    },
  },
};

export default meta;

export const CanvasEditorShellContract = {
  name: '셸 기본 구조',
  render: () => <ShellContractExample />,
};

export const TaskDetails = {
  name: '작업 생성 · 기본 정보',
  render: () => <TaskAuthoringExample phase="details" />,
};

export const TaskTargets = {
  name: '작업 생성 · 목표 추가',
  render: () => <TaskAuthoringExample phase="targets" />,
};

export const TaskParameters = {
  name: '작업 생성 · 파라미터 편집',
  render: () => <TaskAuthoringExample phase="parameters" />,
};

export const MapObjectIdle = {
  name: '맵 편집 · 선택 전',
  render: () => <MapEditorExample initialState="idle" />,
};

export const MapPolygonDrawing = {
  name: '맵 편집 · 구역 작성',
  render: () => <MapEditorExample initialState="draw" />,
};

export const MapObjectSelected = {
  name: '맵 편집 · 선택 객체 속성',
  render: () => <MapEditorExample initialState="selected" />,
};

export const MapPcdAssist = {
  name: '맵 편집 · PCD 3D 보조',
  render: () => <MapEditorExample initialState="pcd" />,
};

export const MapPgmEditing = {
  name: '맵 편집 · PGM 픽셀',
  render: () => <MapEditorExample initialState="pgm" />,
};

export const CanvasEditorShellEditorToolbarHistoryToolbarCard = {
  ...CanvasEditorShellEditorToolbarHistoryToolbarCardStory,
  name: 'CanvasEditorShell · EditorToolbar · HistoryToolbar card parity',
  tags: ['!dev', 'visual-parity'],
};
