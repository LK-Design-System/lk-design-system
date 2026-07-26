import { foundationSpecimenStory, verifyFoundationSpecimenAtNarrowWidth } from './FoundationSpecimen.shared.jsx';

const meta = {
  title: 'LDS Core/Foundation/Inclusive Design',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-core-foundation-inclusive-design--overview',
      eyebrow: 'Foundation / Inclusive Design',
      title: '접근성은 별도 모드가 아니라 모든 표면의 기본 완료 조건입니다',
      description: 'Perceivable·Operable·Understandable·Robust 관점에서 contrast, target, keyboard, assistive technology, zoom과 reduced motion을 함께 판단합니다.',
    },
    docs: { description: { component: '시각·청각·운동·인지 능력과 상황적 제약을 포괄하는 설계 기준입니다.' } },
  },
};

export default meta;
export const Overview = { ...foundationSpecimenStory('inclusive-design'), name: '개요', play: verifyFoundationSpecimenAtNarrowWidth };
