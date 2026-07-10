import { SpeedDial, Icon } from '../src/index.js';

const meta = {
  title: 'LDS Product/Action/Speed Dial',
  parameters: {
    docs: {
      description: {
        component: '열리면 라벨 툴 액션이 펼쳐지는 FAB 스피드다이얼 SpeedDial 패턴입니다. 맵·에디터의 코너 도구 묶음에 씁니다.',
      },
    },
  },
};

export default meta;

export const SpeedDials = {
  name: '스피드다이얼',
  render: () => (
    <main style={{ minHeight: 280, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', padding: 'var(--space-4)', maxWidth: 420, border: '1px dashed var(--color-semantic-line-normal-neutral)', borderRadius: 'var(--radius-lg)' }}>
      <SpeedDial
        defaultOpen
        actions={[
          { icon: <Icon name="plus" size={18} />, label: '웨이포인트 추가' },
          { icon: <Icon name="pin" size={18} />, label: '존 지정' },
          { icon: <Icon name="trash" size={18} />, label: '선택 삭제', danger: true },
        ]}
      />
    </main>
  ),
};
