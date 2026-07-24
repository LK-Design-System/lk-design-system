import { foundationGuideStory, verifyFoundationGuideAtNarrowWidth } from './FoundationGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Foundation/Layout',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-foundation-layout--overview',
      eyebrow: 'Foundation / Layout',
      title: '레이아웃은 콘텐츠 목적·밀도·작업 관계를 보존하는 구조입니다',
      description: 'Content·Dashboard 유형, grid anatomy, breakpoint, region, span과 narrow convergence를 하나의 선택 모델로 연결합니다.',
    },
    docs: { description: { component: 'LDS grid·container·shell·region을 선택하는 상위 Foundation 계약입니다.' } },
  },
};

export default meta;
export const Overview = { ...foundationGuideStory('layout'), name: '개요', play: verifyFoundationGuideAtNarrowWidth };
