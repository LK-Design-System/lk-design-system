import { foundationSpecimenStory, verifyFoundationSpecimenAtNarrowWidth } from './FoundationSpecimen.shared.jsx';

const meta = {
  title: 'LDS Core/Foundation/Voice and Tone',
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'LK 운영 제품의 고정 voice와 상황별 tone 선택 계약입니다.' } },
  },
};

export default meta;
// Voice is a writing contract, not a token set, so there is no canvas specimen; the page is
// documentation only.
export const Overview = { ...foundationSpecimenStory('voice-and-tone'), name: '개요', tags: ['!dev'], play: verifyFoundationSpecimenAtNarrowWidth };
