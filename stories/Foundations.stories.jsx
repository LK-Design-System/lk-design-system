import { Color as ColorStory, ColorSystem as ColorSystemStory } from './Foundations.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Foundation/Color',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-core-foundation-color--color',
      eyebrow: 'Foundation / Color',
      title: '색상은 장식이 아니라 의미와 상태를 일관되게 전달하는 토큰입니다',
      description:
        '배경·레이블·선·상태처럼 역할이 정해진 semantic token을 우선 사용하세요. 원시 팔레트 값이나 임의의 색상 코드를 화면에 직접 사용하면 테마와 접근성 계약이 깨지므로 사용하지 않습니다. 상태색은 선명한 신호색과 AA를 만족하는 *-text 색이 분리되어 있으니, 텍스트에는 반드시 *-text 역할을 사용하세요.',
    },
    docs: {
      description: {
        component: '원자·의미·컴포넌트 계층으로 연결되는 색상 계약을 보여줍니다.',
      },
    },
  },
};

export default meta;

export const Color = {
  ...ColorStory,
  name: '개요',
  parameters: {
    ...ColorStory.parameters,
    ...storyDescription(
      'LDS semantic color token의 대표 역할과 사용 원칙을 살펴보는 시작 화면입니다. 구현할 표면의 의미에 맞는 토큰을 선택하고, 밝은 테마와 어두운 테마에서 정보 위계와 대비가 유지되는지 확인하세요. 하단의 상태색 사용 가이드에 따라 텍스트와 텍스트 배경에는 신호색 대신 *-text 역할을 쓰세요.',
    ),
  },
};
export const ColorSystem = {
  ...ColorSystemStory,
  name: '참조 · 원시 팔레트와 의미 색상',
  parameters: {
    ...ColorSystemStory.parameters,
    ...storyDescription(
      'status 역할 조합과 전체 semantic·atomic 토큰을 조회하는 참조 화면입니다. 사용 원칙은 개요에서 확인하고, 제품 코드에서는 원시 색상값을 직접 소비하지 말고 목적에 맞는 semantic token을 사용하세요.',
    ),
  },
};
