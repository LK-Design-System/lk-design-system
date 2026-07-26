import {
  LKRoboticsLogo as LKRoboticsLogoStory,
  LockupOverlineCard as LockupOverlineCardStory,
} from './Brand.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Theme/Brand/LK ROBOTICS Logo',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-theme-brand-lk-robotics-logo--lk-robotics-logo',
      eyebrow: 'Theme / Brand',
      title: 'LK ROBOTICS 로고는 제품의 출처를 명확히 하는 승인된 브랜드 자산입니다',
      description:
        '제품 식별이 필요한 시작점과 브랜드 표면에 정해진 lockup과 여백으로 사용하는 데 적합합니다. 기능 아이콘이나 장식처럼 반복 사용하지 않으며, 비율·색상·자간을 임의로 바꾸거나 다른 문구와 재조합하지 않습니다.',
    },
    docs: {
      description: {
        component: 'LK ROBOTICS 로고 Lockup과 오버라인 조합을 확인하는 브랜드 파운데이션입니다.',
      },
    },
  },
};

export default meta;

export const LKRoboticsLogo = {
  ...LKRoboticsLogoStory,
  name: '개요',
  parameters: {
    ...LKRoboticsLogoStory.parameters,
    ...storyDescription(
      '공식 LK ROBOTICS logo lockup의 형태와 주변 여백을 확인합니다. 실제 적용에서는 배경 대비와 최소 크기를 지키고, 늘이기·회전·부분 분리 없이 승인된 조합을 그대로 사용하세요.',
    ),
  },
};
export const LockupOverlineCard = { ...LockupOverlineCardStory, name: 'Lockup · Overline card parity', tags: ['!dev', 'visual-parity'] };
