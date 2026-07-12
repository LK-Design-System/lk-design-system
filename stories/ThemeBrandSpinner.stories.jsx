import { Spinner } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Theme/Status/Brand Spinner',
  component: Spinner,
  parameters: {
    storyGuide: {
      storyId: 'lds-theme-status-brand-spinner--brand-loading',
      eyebrow: 'Theme / Status',
      title: 'Brand Spinner는 LK ROBOTICS 브랜드가 필요한 제한된 로딩 순간에만 사용합니다',
      description:
        '브랜드 진입점이나 제품 전환처럼 출처를 함께 강조하는 짧은 대기에 적합합니다. 일반 콘텐츠 로딩·버튼 진행 상태에는 사용하지 않고 LDS Core의 기본 Spinner 또는 Loading State를 사용하세요.',
    },
    docs: {
      description: {
        component: 'LK ROBOTICS 브랜드 표현을 적용한 순환형 로딩 표시입니다. 일반 서큘러 로딩은 Core 상태 그룹의 기본 순환형 로딩 페이지를 참고하세요.',
      },
    },
  },
};

export default meta;

export const BrandLoading = {
  name: '개요',
  parameters: storyDescription(
    '브랜드 variant의 크기와 접근 가능한 로딩 레이블을 비교합니다. 대기가 길어질 수 있으면 보이는 설명이나 진행 정보를 제공하고, 화면마다 장식적으로 반복하지 마세요.',
  ),
  render: () => (
    <main style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap', maxWidth: 480 }}>
      <Spinner variant="brand" size={22} />
      <Spinner variant="brand" size={18} label="불러오는 중" />
    </main>
  ),
};
