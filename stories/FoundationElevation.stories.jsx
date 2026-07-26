import { foundationSpecimenStory, verifyFoundationSpecimenAtNarrowWidth } from './FoundationSpecimen.shared.jsx';

const meta = {
  title: 'LDS Core/Foundation/Elevation',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-core-foundation-elevation--overview',
      eyebrow: 'Foundation / Elevation',
      title: 'Elevation은 그림자 크기가 아니라 겹침 맥락과 표면 소유권입니다',
      description: 'Global·Local context, overlay 우선순위와 surface·stroke·shadow 선택을 함께 정의해 z-index 경쟁과 불필요한 떠 있음 표현을 막습니다.',
    },
    docs: { description: { component: 'Global/Local layer model과 LDS surface별 elevation 선택 계약입니다.' } },
  },
};

export default meta;
export const Overview = { ...foundationSpecimenStory('elevation'), name: '개요', play: verifyFoundationSpecimenAtNarrowWidth };
