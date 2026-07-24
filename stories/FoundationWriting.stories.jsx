import { foundationGuideStory, verifyFoundationGuideAtNarrowWidth } from './FoundationGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Foundation/Writing',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-foundation-writing--overview',
      eyebrow: 'Foundation / Writing',
      title: 'UI 문장은 현재 사실과 다음 안전한 행동을 익숙한 말로 전달합니다',
      description: 'Label, instruction, status, error, confirmation을 구분하고 숫자·축약어·문장부호·능동문·상태 terminology와 국제화 예외까지 일관되게 적용합니다.',
    },
    docs: { description: { component: 'LDS UI copy의 어휘·문법·상태·오류·문장부호 계약과 Do/Don’t 예시입니다.' } },
  },
};

export default meta;
export const Overview = { ...foundationGuideStory('writing'), name: '개요', play: verifyFoundationGuideAtNarrowWidth };
