import { Category } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Navigation/Category',
  component: Category,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-navigation-category--category-patterns',
      eyebrow: 'Core / Navigation',
      title: 'Category는 같은 화면 안에서 주제나 콘텐츠 묶음을 빠르게 전환합니다',
      description:
        '서로 배타적인 상위 분류를 한 줄에서 오가며 현재 선택을 계속 보여줘야 할 때 적합합니다. 단계 이동에는 Tabs를, 많은 옵션이나 폼 값 선택에는 Select를 사용하고, 단순 필터가 여러 개 동시에 적용되는 경우에는 Chip이나 별도 필터 패턴을 사용하세요.',
    },
    docs: {
      description: {
        component: 'Category의 WDS 원본 축(variant, size, padding, vertical padding, scroll)을 따르는 주제 내비게이션입니다.',
      },
    },
  },
};

export default meta;

const categoryItems = [
  '전체',
  '로봇',
  '설비',
  '배차',
  '원격 제어',
  '텔레메트리',
  '이벤트',
];

export const CategoryPatterns = {
  name: '개요',
  parameters: storyDescription(
    '크기, alternative 표면, 안쪽 여백과 가로 스크롤 조합을 비교합니다. 선택된 항목이 각 배경에서 명확한지, 긴 항목 목록이 좁은 영역에서 잘리지 않고 탐색되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 14, width: '100%', maxWidth: 920 }}>
      <Category items={categoryItems} defaultValue="전체" size="small" />
      <Category items={categoryItems} defaultValue="로봇" variant="alternative" size="medium" padding />
      <Category items={categoryItems} defaultValue="배차" size="xlarge" padding verticalPadding scroll />
    </main>
  ),
};
