import {
  LKRoboticsLogo as LKRoboticsLogoStory,
  LockupOverlineCard as LockupOverlineCardStory,
} from './Brand.shared.jsx';

const meta = {
  title: 'LDS Theme/Brand/LK ROBOTICS Logo',
  parameters: {
    docs: {
      description: {
        component: 'LK ROBOTICS 로고 Lockup과 오버라인 조합을 확인하는 브랜드 파운데이션입니다.',
      },
    },
  },
};

export default meta;

export const LKRoboticsLogo = { ...LKRoboticsLogoStory, name: 'LK ROBOTICS 로고' };
export const LockupOverlineCard = { ...LockupOverlineCardStory, name: 'Lockup · Overline card parity', tags: ['!dev', 'visual-parity'] };
