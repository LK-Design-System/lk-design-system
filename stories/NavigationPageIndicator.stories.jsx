import { PageIndicator } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Navigation/Page Indicator',
  component: PageIndicator,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-navigation-page-indicator--counter-and-dots',
      eyebrow: 'Core / Navigation',
      title: 'Page Indicator는 연속된 화면 중 현재 위치와 전체 범위를 보여줍니다',
      description:
        '캐러셀이나 단계별 콘텐츠처럼 앞뒤 이동은 다른 제어가 담당하고 현재 위치만 간결하게 알려줄 때 적합합니다. 사용자가 특정 페이지를 직접 선택해야 하면 Pagination을, 업무 단계의 이름과 완료 상태를 설명해야 하면 Stepper를 사용하세요.',
    },
    docs: {
      description: {
        component: 'PageIndicator의 WDS 카운터·도트 축(size, alternative, dot variant)을 보여줍니다.',
      },
    },
  },
};

export default meta;

export const CounterAndDots = {
  name: '개요',
  parameters: storyDescription(
    '숫자 카운터와 도트 표시를 크기·배경 조합별로 비교합니다. 현재 페이지와 전체 개수가 이해되는지, alternative 표현이 어두운 표면에서도 충분히 구분되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', maxWidth: 880 }}>
      <PageIndicator page={1} count={10} size="small" />
      <PageIndicator page={1} count={10} size="medium" />
      <PageIndicator page={1} count={10} alternative />
      <PageIndicator variant="dot" page={1} count={6} size="small" />
      <span style={{ display: 'inline-flex', padding: 8, borderRadius: 10, background: 'var(--color-semantic-label-alternative)' }}>
        <PageIndicator variant="dot" page={1} count={6} alternative />
      </span>
    </main>
  ),
};
