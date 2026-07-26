import {
  BrandLogoCard as BrandLogoCardStory,
  PlatformBrandMarks as PlatformBrandMarksStory,
} from './Brand.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  id: 'lds-product-content-platform-marks',
  title: 'LDS Product/Content/Platform Logos',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-product-content-platform-marks--platform-brand-marks',
      eyebrow: 'Product / Platform Logos',
      title: '사용자가 연결할 외부 플랫폼을 브랜드 마크로 빠르게 식별합니다',
      description:
        '인증 제공자나 외부 플랫폼의 출처를 공식 마크로 구분해야 할 때 적합합니다. 일반 기능 아이콘이나 제품 고유 액션에는 플랫폼 마크 대신 LDS Icon과 명시적인 텍스트 라벨을 사용하세요.',
    },
    docs: {
      description: {
        component: '외부 플랫폼과 소셜 로그인에 쓰는 브랜드 마크를 확인하는 파운데이션입니다.',
      },
    },
  },
};

export default meta;

export const PlatformBrandMarks = {
  ...PlatformBrandMarksStory,
  name: '개요',
  parameters: {
    ...PlatformBrandMarksStory.parameters,
    ...storyDescription(
      '지원하는 외부 플랫폼 마크를 한곳에서 비교하는 상황입니다. 각 마크가 배경과 크기 변화에서도 식별되고 임의 변형 없이 일관된 여백을 유지하는지 확인하세요.',
    ),
  },
};
export const BrandLogoCard = { ...BrandLogoCardStory, name: 'BrandLogo card parity', tags: ['!dev', 'visual-parity'] };
