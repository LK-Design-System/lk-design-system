import { SocialLoginControls as SocialLoginControlsStory } from './ButtonsExtended.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Action/Social Login',
  parameters: {
    storyGuide: {
      storyId: 'lds-product-action-social-login--social-login-controls',
      eyebrow: 'Product / Social Login',
      title: '사용자가 익숙한 계정 제공자를 알아보고 인증을 시작합니다',
      description:
        '외부 계정으로 가입·로그인하는 인증 진입점을 제공할 때 적합합니다. 일반적인 제품 작업이나 자체 계정 입력에는 브랜드 버튼 대신 Button 또는 전용 로그인 폼을 사용하세요.',
    },
    docs: {
      description: {
        component: '브랜드 로그인 버튼처럼 인증 진입에 쓰는 버튼 패턴을 분리해 확인합니다.',
      },
    },
  },
};

export default meta;

export const SocialLoginControls = {
  ...SocialLoginControlsStory,
  name: '개요',
  parameters: {
    ...SocialLoginControlsStory.parameters,
    ...storyDescription(
      '여러 외부 계정 제공자를 인증 진입점으로 제시하는 상황입니다. 브랜드 식별이 분명하고 제공자별 버튼 위계와 라벨이 일관적인지 확인하세요.',
    ),
  },
};
