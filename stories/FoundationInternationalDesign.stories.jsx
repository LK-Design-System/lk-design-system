import { foundationGuideStory, verifyFoundationGuideAtNarrowWidth } from './FoundationGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Foundation/International Design',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-foundation-international-design--overview',
      eyebrow: 'Foundation / International Design',
      title: '번역을 넘어 값 형식·문자열 확장·방향·입력까지 locale에 대응합니다',
      description: '표시 문자열과 canonical value를 분리하고 date, number, unit, currency, time zone, IME, RTL과 긴 번역을 제품 formatter와 layout 계약으로 처리합니다.',
    },
    docs: { description: { component: 'locale data, content expansion, bidirectional layout와 canonical input 계약입니다.' } },
  },
};

export default meta;
export const Overview = { ...foundationGuideStory('international-design'), name: '개요', play: verifyFoundationGuideAtNarrowWidth };
