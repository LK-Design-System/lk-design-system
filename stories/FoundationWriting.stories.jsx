import { foundationSpecimenStory, verifyFoundationSpecimenAtNarrowWidth } from './FoundationSpecimen.shared.jsx';

const meta = {
  title: 'LDS Core/Foundation/Writing',
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'LDS UI copy의 어휘·문법·상태·오류·문장부호 계약과 Do/Don’t 예시입니다.' } },
  },
};

export default meta;
// Writing is a copy contract, not a token set, so there is no canvas specimen; the page is
// documentation only.
export const Overview = { ...foundationSpecimenStory('writing'), name: '개요', tags: ['!dev'], play: verifyFoundationSpecimenAtNarrowWidth };
