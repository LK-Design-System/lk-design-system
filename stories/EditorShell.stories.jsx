import { EditorShell as EditorShellStory, CanvasEditorShellEditorToolbarHistoryToolbarCard as CanvasEditorShellEditorToolbarHistoryToolbarCardStory } from './RoboticsAndViz.shared.jsx';

const meta = {
  title: 'LK Robotics Extension/Editor/Canvas Shell',
  parameters: {
    docs: {
      description: {
        component: 'CanvasEditorShell, EditorToolbar, HistoryToolbar처럼 캔버스 편집 화면을 구성하는 패턴입니다.',
      },
    },
  },
};

export default meta;

export const EditorShell = { ...EditorShellStory, name: "에디터 셸" };
export const CanvasEditorShellEditorToolbarHistoryToolbarCard = { ...CanvasEditorShellEditorToolbarHistoryToolbarCardStory, name: "CanvasEditorShell · EditorToolbar · HistoryToolbar card parity", tags: ['!dev', 'visual-parity'] };
