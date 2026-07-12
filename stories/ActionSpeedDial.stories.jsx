import { SpeedDial, Icon } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Action/Speed Dial',
  parameters: {
    storyGuide: {
      storyId: 'lds-product-action-speed-dial--speed-dials',
      eyebrow: 'Product / Speed Dial',
      title: '스피드 다이얼은 한 지점에서 관련 보조 작업을 펼칩니다',
      description:
        '지도·에디터의 고정 코너에서 2~5개의 문맥 작업을 빠르게 꺼낼 때 적합합니다. 항상 보여야 하는 핵심 CTA나 항목이 많은 명령에는 Speed Dial 대신 Button 또는 Menu를 사용하세요.',
    },
    docs: {
      description: {
        component: '열리면 라벨 툴 액션이 펼쳐지는 FAB 스피드다이얼 SpeedDial 패턴입니다. 맵·에디터의 코너 도구 묶음에 씁니다.',
      },
    },
  },
};

export default meta;

export const SpeedDials = {
  name: '개요',
  parameters: storyDescription(
    '열린 Speed Dial에서 일반 작업과 위험 작업의 라벨·아이콘 우선순위를 비교합니다. 코너 고정 위치에서도 작업명이 읽히고 삭제 동작이 구분되는지 확인하세요.',
  ),
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
