import { Typography as TypographyStory } from './Foundations.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Foundation/Typography',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-core-foundation-typography--typography',
      eyebrow: 'Foundation / Typography',
      title: '타이포그래피는 콘텐츠의 읽는 순서와 중요도를 먼저 설계합니다',
      description:
        '제목·본문·캡션의 semantic typography token을 정보 위계에 맞춰 사용하세요. 단순히 글자를 크게 보이게 하려고 임의 크기나 굵기를 추가하지 말고, 같은 역할은 화면이 달라도 같은 스타일을 유지합니다.',
    },
    docs: {
      description: {
        component: '본문, 캡션, 제목 등 텍스트 위계에 쓰는 타이포그래피 토큰 예시입니다.',
      },
    },
  },
};

export default meta;

export const Typography = {
  ...TypographyStory,
  name: '개요',
  parameters: {
    ...TypographyStory.parameters,
    ...storyDescription(
      'LDS의 제목·본문·레이블·캡션 계층을 실제 문장으로 비교합니다. 콘텐츠 역할에 맞는 토큰을 고르고, 줄 길이와 행간이 달라져도 읽는 순서가 명확한지 확인하세요.',
    ),
  },
};

