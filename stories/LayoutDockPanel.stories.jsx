import { DockPanel, DescriptionList } from '../src/index.js';

const meta = {
  title: 'LDS Core/Components/Layout/Dock Panel',
  parameters: {
    docs: {
      description: {
        component: '캔버스 위에서 돌출 셰브론 핸들로 접히는 사이드 도킹 패널 DockPanel 패턴입니다. 맵·에디터 속성 패널에 씁니다.',
      },
    },
  },
};

export default meta;

export const DockPanels = {
  name: '도킹 패널',
  render: () => (
    <main style={{ position: 'relative', height: 320, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-semantic-line-normal-normal)', background: 'repeating-linear-gradient(45deg, var(--color-semantic-fill-alternative) 0 12px, transparent 12px 24px)', maxWidth: 720 }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-semantic-label-assistive)', fontSize: 13 }}>맵 캔버스</div>
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0 }}>
        <DockPanel side="right" title="웨이포인트 속성" defaultOpen>
          <DescriptionList
            columns={1}
            items={[
              { term: 'ID', description: 'WP-021' },
              { term: '좌표', description: '12.4, 3.1' },
              { term: '연결', description: '3개 레인' },
            ]}
          />
        </DockPanel>
      </div>
    </main>
  ),
};
