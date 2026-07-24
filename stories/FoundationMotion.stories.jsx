import { foundationGuideStory, verifyFoundationGuideAtNarrowWidth } from './FoundationGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Foundation/Motion',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-foundation-motion--overview',
      eyebrow: 'Foundation / Motion',
      title: 'Motion은 상태와 공간 관계를 설명하고 reduced motion에서도 의미를 남깁니다',
      description: 'Macro·Micro, Enter·Exit, duration과 easing을 구분하고 실시간 데이터 과장·transition: all·motion-only 의미 전달을 금지합니다.',
    },
    docs: { description: { component: 'LDS timing token과 reduced-motion hygiene를 설계 선택 기준에 연결합니다.' } },
  },
};

export default meta;
export const Overview = { ...foundationGuideStory('motion'), name: '개요', play: verifyFoundationGuideAtNarrowWidth };
