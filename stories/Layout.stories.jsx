import {
  PageStructure as PageStructureStory,
  SectionCard as SectionCardStory,
  SplitCard as SplitCardStory,
} from './Layout.shared.jsx';

const meta = {
  title: 'WDS Core/3 Component/1 Layout/Page Structure',
  parameters: {
    docs: {
      description: {
        component: 'Section, Container, Split을 조합해 화면의 큰 구조와 반응형 영역을 만드는 레이아웃 패턴입니다.',
      },
    },
  },
};

export default meta;

export const PageStructure = { ...PageStructureStory, name: '페이지 구조' };
export const SectionCard = { ...SectionCardStory, name: 'Section card parity', tags: ['!dev', 'visual-parity'] };
export const SplitCard = { ...SplitCardStory, name: 'Split card parity', tags: ['!dev', 'visual-parity'] };
