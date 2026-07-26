import { Spinner } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Theme/Status/Brand Spinner',
  tags: ['autodocs'],
  component: Spinner,
  parameters: {
    relatedPatterns: [
      {
        title: 'Loading Pattern',
        docsId: 'lds-core-patterns-loading--docs',
        relationship: 'Brand Spinner의 사용 여부와 범위·시간·배치·접근성 판단 기준',
      },
    ],
    storyGuide: {
      storyId: 'lds-theme-status-brand-spinner--brand-loading',
      canonicalGuide: 'core-components-status-spinner',
      guideDeltaFields: 'purpose,avoidWhen',
      eyebrow: 'Theme / Status',
      title: 'Brand Spinner는 LK ROBOTICS 브랜드가 필요한 제한된 로딩 순간에만 사용합니다',
      description:
        '브랜드 진입점이나 제품 전환처럼 출처를 함께 강조하는 짧은 대기에만 적합합니다. 일반 데이터 갱신, 반복되는 화면 내부 로딩, 장시간 대기에는 사용하지 않습니다. 공통 동작과 API는 Core Spinner를, 사용 판단과 배치 규약은 Loading Pattern을 따릅니다.',
    },
    docs: {
      description: {
        component: '브랜드 진입점이나 제품 전환처럼 출처를 함께 강조하는 짧은 대기에 적합합니다.',
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
