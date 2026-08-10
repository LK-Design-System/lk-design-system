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
      title: 'LK ROBOTICS 로고는 고정된 심볼·글꼴·배치 규정에서 생성합니다',
      description:
        'LK는 승인된 커스텀 벡터를 유지하고 ROBOTICS는 Montserrat ExtraBold 800 v7.222, 한글 법인명은 Noto Sans KR ExtraBold 800 v2.004-H2에서 아웃라인으로 생성합니다. 승인 SVG 또는 Lockup만 사용하며 기능 아이콘처럼 반복하거나 비율·색상·자간을 임의로 바꾸지 않습니다.',
    },
    docs: {
      description: {
        component: '고정된 LK 심볼, Montserrat ExtraBold 800 워드마크, Noto Sans KR ExtraBold 800 한글 법인명 규정에서 생성한 승인 SVG와 제품 UI 파생형을 확인하는 브랜드 파운데이션입니다.',
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
      '규정된 LK ROBOTICS 기업 표기형·기본형과 같은 생성 원본을 사용하는 제품 UI 파생형을 확인합니다. 실제 적용에서는 배경 대비와 최소 크기를 지키고, 다시 조판하거나 늘이기·회전·재채색하지 말고 제공된 조합을 사용하세요.',
    ),
  },
};
export const LockupOverlineCard = { ...LockupOverlineCardStory, name: 'Lockup · Overline card parity', tags: ['!dev', 'visual-parity'] };
