import { ActionControls as ActionControlsStory, ButtonIconButtonSocialButtonCard as ButtonIconButtonSocialButtonCardStory } from './ButtonsExtended.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Action/Action Controls',
  parameters: {
    docs: {
      description: {
        component: 'Button, IconButton처럼 즉시 실행되는 액션 버튼 계열을 확인합니다.',
      },
    },
  },
};

export default meta;

export const ActionControls = { ...ActionControlsStory, name: "액션 컨트롤 전체" };
export const ButtonIconButtonSocialButtonCard = { ...ButtonIconButtonSocialButtonCardStory, name: "Button · IconButton · SocialButton card parity", tags: ['!dev', 'visual-parity'] };
