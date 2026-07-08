import { ColorAndSpacing as ColorAndSpacingStory } from './Foundations.shared.jsx';

const meta = {
  title: 'LDS Core/Foundation/Color and Spacing',
  parameters: {
    docs: {
      description: {
        component: 'styles.css와 tokens/*.css에서 불러오는 색상, 간격 토큰 예시입니다.',
      },
    },
  },
};

export default meta;

export const ColorAndSpacing = { ...ColorAndSpacingStory, name: '색상과 간격' };
