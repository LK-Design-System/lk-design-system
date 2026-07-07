import { SocialLoginControls as SocialLoginControlsStory } from './ButtonsExtended.shared.jsx';

const meta = {
  title: 'LK Product Extension/Auth/Social Login',
  parameters: {
    docs: {
      description: {
        component: '브랜드 로그인 버튼처럼 인증 진입에 쓰는 버튼 패턴을 분리해 확인합니다.',
      },
    },
  },
};

export default meta;

export const SocialLoginControls = { ...SocialLoginControlsStory, name: "소셜 로그인 버튼" };
