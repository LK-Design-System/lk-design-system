import { foundationGuideStory, verifyFoundationGuideAtNarrowWidth } from './FoundationGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Foundation/Design Token',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-foundation-design-token--overview',
      eyebrow: 'Foundation / Design Token',
      title: '토큰은 값 목록이 아니라 디자인 결정의 계층과 수명주기입니다',
      description: 'Primitive, Semantic, Component, Runtime projection을 분리하고 제품과 컴포넌트가 가장 높은 의미 계층을 사용하도록 합니다.',
    },
    docs: { description: { component: '토큰 계층, 선택 기준, lifecycle, Figma·CSS·AI 연결 계약입니다.' } },
  },
};

export default meta;
export const Overview = { ...foundationGuideStory('design-token'), name: '개요', play: verifyFoundationGuideAtNarrowWidth };
