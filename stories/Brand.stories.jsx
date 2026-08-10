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
      title: 'LK ROBOTICS 로고는 geometry v1.0과 고정된 글꼴·배치 규정에서 생성합니다',
      description:
        'LK는 고정된 geometry v1.0을 유지하고 ROBOTICS는 Montserrat ExtraBold 800 v7.222, 한글 법인명은 Noto Sans KR ExtraBold 800 v2.004-H2에서 아웃라인으로 생성합니다. construction grid, variant 저장소 정책 최소 크기, 0.5X/1X 여백, 배경·오용·플랫폼 전달 규칙을 함께 확인합니다.',
      decisionGuidance: {
        useWhen: '회사 식별, 제품 내 브랜드 진입점, 법인명 표기처럼 LK ROBOTICS 정체성을 공식 자산으로 전달할 때 용도와 슬롯에 맞는 variant를 선택합니다.',
        avoidWhen: '기능 아이콘, 반복 장식, 임의 재조판·비균일 변형, 정책 최소보다 작은 슬롯, 승인되지 않은 app icon이나 공동 브랜딩 조합에는 사용하지 않습니다.',
      },
    },
    docs: {
      description: {
        component: 'geometry v1.0 LK 심볼, 고정 워드마크·법인명, 저장소 정책 최소 크기(광학 승인 대기)와 clear space, 반응형 fit, 배경 및 플랫폼 전달 상태를 한 페이지에서 확인하는 브랜드 파운데이션입니다.',
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
      'geometry v1.0 construction, 변형 선택, 정확한 최소 크기와 슬롯 폭, clear space, positive/reverse/mono 배경, 금지 사용과 플랫폼 manifest 상태를 확인합니다. favicon tile은 앱 아이콘이 아니며 Figma manifest도 live sync나 승인 증거가 아닙니다.',
    ),
  },
};
export const LockupOverlineCard = { ...LockupOverlineCardStory, name: 'Lockup · Overline card parity', tags: ['!dev', 'visual-parity'] };
