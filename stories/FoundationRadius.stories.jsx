import { foundationSpecimenStory, verifyFoundationSpecimenAtNarrowWidth } from './FoundationSpecimen.shared.jsx';

const meta = {
  title: 'LDS Core/Foundation/Radius',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-core-foundation-radius--overview',
      eyebrow: 'Foundation / Radius',
      title: 'Radius는 표면 규모와 포함 관계를 일관되게 나타냅니다',
      description: 'Control·Frame·Pill 역할을 분리하고 parent-owned perimeter와 embedded variant를 사용해 중첩 surface의 이중 모서리를 방지합니다.',
    },
    docs: { description: { component: 'Radius scale, component role과 nested-surface 예외를 정의합니다.' } },
  },
};

export default meta;
export const Overview = { ...foundationSpecimenStory('radius'), name: '개요', play: verifyFoundationSpecimenAtNarrowWidth };
