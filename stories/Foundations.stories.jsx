import { Color as ColorStory, ColorSystem as ColorSystemStory } from './Foundations.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Foundation/Color',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-foundation-color--color',
      eyebrow: 'Foundation / Color',
      title: '색상은 장식이 아니라 의미와 상태를 일관되게 전달하는 토큰입니다',
      description:
        '배경·레이블·선·상태처럼 역할이 정해진 semantic token을 우선 사용하세요. 원시 팔레트 값이나 임의의 색상 코드를 화면에 직접 사용하면 테마와 접근성 계약이 깨지므로 사용하지 않습니다.',
    },
    docs: {
      description: {
        component: 'tokens/source.json에서 생성되는 원자·의미·컴포넌트 색상 계약을 보여줍니다.',
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
      'LDS semantic color token을 역할별로 살펴보는 기준 화면입니다. 구현할 표면의 의미에 맞는 토큰을 선택하고, 밝은 테마와 어두운 테마에서 정보 위계와 대비가 유지되는지 확인하세요.',
    ),
  },
};
export const ColorSystem = {
  ...ColorSystemStory,
  name: '참조 · 원시 팔레트와 의미 색상',
  parameters: {
    ...ColorSystemStory.parameters,
    ...storyDescription(
      '원시 팔레트가 semantic 역할로 연결되는 색상 체계를 보여줍니다. 제품 코드에서는 이 구조를 참고하되 원시 색상값을 직접 소비하지 말고 목적에 맞는 semantic token을 사용하세요.',
    ),
  },
};
