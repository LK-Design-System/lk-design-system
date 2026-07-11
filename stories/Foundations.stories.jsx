import { Color as ColorStory, ColorSystem as ColorSystemStory } from './Foundations.shared.jsx';

const meta = {
  title: 'LDS Core/Foundation/Color',
  parameters: {
    docs: {
      description: {
        component: 'tokens/source.json에서 생성되는 원자·의미·컴포넌트 색상 계약을 보여줍니다.',
      },
    },
  },
};

export default meta;

export const Color = { ...ColorStory, name: '색상 토큰' };
export const ColorSystem = { ...ColorSystemStory, name: '색상 시스템' };
