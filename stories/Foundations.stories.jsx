import { Color as ColorStory, ColorSystem as ColorSystemStory } from './Foundations.shared.jsx';

const meta = {
  title: 'LDS Core/Foundation/Color',
  parameters: {
    docs: {
      description: {
        component: 'styles.css와 tokens/*.css에서 불러오는 색상 토큰과 2단(atomic/semantic) 색상 시스템 예시입니다.',
      },
    },
  },
};

export default meta;

export const Color = { ...ColorStory, name: '색상 토큰' };
export const ColorSystem = { ...ColorSystemStory, name: '색상 시스템 (2단 토큰)' };
