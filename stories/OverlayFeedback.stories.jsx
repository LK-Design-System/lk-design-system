import {
  AlertCard as AlertCardStory,
  AlertOpen as AlertOpenStory,
  AlertToastCard as AlertToastCardStory,
} from './Overlay.shared.jsx';

const meta = {
  title: 'WDS Core/3 Component/7 Feedback/Confirm Alert',
  parameters: {
    docs: {
      description: {
        component: '사용자 확인이 필요한 위험 작업이나 주요 결정을 묻는 Alert 오버레이입니다.',
      },
    },
  },
};

export default meta;

export const AlertOpen = { ...AlertOpenStory, name: 'Alert 열림' };
export const AlertCard = { ...AlertCardStory, name: 'Alert card parity', tags: ['!dev', 'visual-parity'] };
export const AlertToastCard = { ...AlertToastCardStory, name: 'Alert Toast card parity', tags: ['!dev', 'visual-parity'] };

