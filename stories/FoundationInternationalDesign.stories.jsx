import { foundationSpecimenStory, verifyFoundationSpecimenAtNarrowWidth } from './FoundationSpecimen.shared.jsx';

const meta = {
  title: 'LDS Core/Foundation/International Design',
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'locale data, content expansion, bidirectional layout와 canonical input 계약입니다.' } },
  },
};

export default meta;
// Defined by logical CSS properties and shared type/space tokens rather than its own variables,
// so there is no canvas specimen; the page is documentation only.
export const Overview = { ...foundationSpecimenStory('international-design'), name: '개요', tags: ['!dev'], play: verifyFoundationSpecimenAtNarrowWidth };
