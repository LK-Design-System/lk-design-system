import { Bubble } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Content/Bubble',
  component: Bubble,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-content-bubble--bubble-patterns',
      eyebrow: 'Product / Bubble',
      title: '사용자가 화면에 남아 있는 주석을 대상과 함께 읽습니다',
      description:
        '코치 마크·지속형 설명·대화처럼 짧은 내용을 특정 방향의 대상에 연결할 때 적합합니다. hover에서만 보이는 한 줄 힌트나 즉시 대응할 시스템 오류에는 Bubble 대신 Tooltip 또는 Alert를 사용하세요.',
    },
    docs: {
      description: {
        component: '꼬리 방향과 surface tone으로 대상에 연결된 지속형 주석을 표현하는 LK Product Bubble입니다.',
      },
    },
  },
};

export default meta;

export const BubblePatterns = {
  name: '개요',
  parameters: storyDescription(
    '밝고 어두운 surface에서 서로 다른 방향의 지속형 설명을 배치하는 상황입니다. 꼬리가 설명 대상을 분명히 가리키고 tone이 달라도 본문 대비와 여백이 유지되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', flexWrap: 'wrap', maxWidth: 760, padding: 'var(--space-4)' }}>
      <Bubble tone="navy" tail="left">선택 항목의 세부 정보를 확인하세요.</Bubble>
      <Bubble tone="light" tail="bottom">이 설정은 다음 실행부터 적용됩니다.</Bubble>
      <Bubble tone="navy" tail="top">검토가 끝나면 게시할 수 있습니다.</Bubble>
    </main>
  ),
};
