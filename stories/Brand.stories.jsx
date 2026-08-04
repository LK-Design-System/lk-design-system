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
      title: 'LK ROBOTICS 로고는 공식 SVG 원본의 비율·색상·경로를 그대로 사용합니다',
      description:
        '기업 표기형과 기본형은 원본 조합을 그대로 사용하고, 제품 UI 파생형은 같은 벡터 윤곽만 재사용합니다. 기능 아이콘이나 장식처럼 반복 사용하지 않으며 비율·색상·자간을 임의로 바꾸지 않습니다.',
    },
    docs: {
      description: {
        component: '공식 LK ROBOTICS SVG 원본과 같은 path를 사용하는 제품 UI 파생형을 확인하는 브랜드 파운데이션입니다.',
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
      '공식 LK ROBOTICS SVG의 기업 표기형·기본형과 같은 원본 path를 사용하는 제품 UI 파생형을 확인합니다. 실제 적용에서는 배경 대비와 최소 크기를 지키고, 늘이기·회전·재채색 없이 제공된 조합을 사용하세요.',
    ),
  },
};
export const LockupOverlineCard = { ...LockupOverlineCardStory, name: 'Lockup · Overline card parity', tags: ['!dev', 'visual-parity'] };
