import { foundationGuideStory, verifyFoundationGuideAtNarrowWidth } from './FoundationGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Foundation/Voice and Tone',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-foundation-voice-and-tone--overview',
      eyebrow: 'Foundation / Voice and Tone',
      title: 'LK의 voice는 정확하고 차분하며 운영 결과를 과장하지 않습니다',
      description: '고정된 precise·calm·dependable voice 위에서 일반 안내, 긴급, 복구, 성공 상황의 tone을 바꾸되 사용자 탓·모호한 완료·마케팅 표현을 피합니다.',
    },
    docs: { description: { component: 'LK 운영 제품의 고정 voice와 상황별 tone 선택 계약입니다.' } },
  },
};

export default meta;
export const Overview = { ...foundationGuideStory('voice-and-tone'), name: '개요', play: verifyFoundationGuideAtNarrowWidth };
