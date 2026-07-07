import {
  BrandLogoCard as BrandLogoCardStory,
  PlatformBrandMarks as PlatformBrandMarksStory,
} from './Brand.shared.jsx';

const meta = {
  title: 'LDS Theme/Brand/Platform Marks',
  parameters: {
    docs: {
      description: {
        component: '외부 플랫폼과 소셜 로그인에 쓰는 브랜드 마크를 확인하는 파운데이션입니다.',
      },
    },
  },
};

export default meta;

export const PlatformBrandMarks = { ...PlatformBrandMarksStory, name: '플랫폼 브랜드 마크' };
export const BrandLogoCard = { ...BrandLogoCardStory, name: 'BrandLogo card parity', tags: ['!dev', 'visual-parity'] };

