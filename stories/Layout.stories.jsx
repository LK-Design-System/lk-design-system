import {
  PageStructure as PageStructureStory,
  SectionCard as SectionCardStory,
  SplitCard as SplitCardStory,
} from './Layout.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Layout/Page Structure',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-layout-page-structure--page-structure',
      eyebrow: 'Core / Layout / Page Structure',
      title: '페이지의 주요 영역을 읽기 순서와 반응형 관계에 맞춰 구성합니다',
      description:
        '헤더, 본문, 보조 영역처럼 화면 전체의 큰 구획과 너비 규칙을 설계할 때 적합합니다. 바깥 골격은 header(banner) · main · footer(contentinfo) 랜드마크로 선언하고, main은 페이지당 하나만 두며, 반복되는 헤더를 건너뛰는 skip link를 문서의 첫 포커스 대상으로 놓으세요. 반복 항목 배치는 Grid나 Columns를, 한 방향의 내부 간격은 Stack을 사용하고 컴포넌트 내부의 작은 정렬까지 페이지 구조로 해결하지 마세요.',
    },
    docs: {
      description: {
        component: 'Section, Container, Split을 조합해 화면의 큰 구조와 반응형 영역을 만드는 레이아웃 패턴입니다.',
      },
    },
  },
};

export default meta;

export const PageStructure = {
  ...PageStructureStory,
  name: '개요',
  parameters: {
    ...PageStructureStory.parameters,
    ...storyDescription(
      '페이지의 컨테이너, 섹션, 주·보조 열을 조합해 데스크톱과 좁은 화면의 큰 구조를 검토하는 상황입니다. DOM 읽기 순서와 시각적 배치가 일치하고 너비가 줄어들 때 영역이 자연스럽게 쌓이는지, 그리고 Tab을 처음 눌렀을 때 건너뛰기 링크가 먼저 나타나 main으로 이동하는지 확인하세요.',
    ),
  },
};
export const SectionCard = { ...SectionCardStory, name: 'Section card parity', tags: ['!dev', 'visual-parity'] };
export const SplitCard = { ...SplitCardStory, name: 'Split card parity', tags: ['!dev', 'visual-parity'] };
