import {
  ContentBadge,
  Icon,
  Kbd,
  ListCell,
  StatusBadge,
} from '../src/index.js';
import { ListCellAccordionCard as ListCellAccordionCardStory } from './Content.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Content/Lists',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-content-lists--lists',
      eyebrow: 'Core / Content / Lists',
      title: '반복되는 항목의 핵심 정보와 상태를 빠르게 훑게 합니다',
      description:
        '같은 정보 구조를 가진 문서, 알림, 설정 항목을 세로 목록으로 비교하거나 탐색할 때 적합합니다. 독립된 풍부한 콘텐츠 단위는 Card를, 단순한 값의 행·열 비교는 Table을 사용하고 서로 다른 구조를 한 목록에 섞지 마세요.',
    },
    docs: {
      description: {
        component: '항목 목록처럼 순서와 상태를 읽는 ListCell 패턴입니다.',
      },
    },
  },
};

export default meta;

/* 반복 행은 ul/li로 감싸 항목 수와 위치를 보조 기술에 남깁니다(WCAG 1.3.1).
   list-style:none이 리스트 의미를 지우는 브라우저가 있어 role="list"를 함께 둡니다. */
const listStyle = { listStyle: 'none', margin: 0, padding: 0 };

function RowList({ children, label, style }) {
  return (
    <ul role="list" aria-label={label} style={{ ...listStyle, ...style }}>
      {children}
    </ul>
  );
}

export const Lists = {
  name: '개요',
  parameters: storyDescription(
    '문서와 알림 항목을 아이콘, 설명, 상태, 단축키, 탐색 어포던스와 함께 나열하는 상황입니다. 반복되는 행의 정렬이 유지되고 선택 상태와 이동 가능성이 trailing 요소만 보아도 구분되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 920, minWidth: 0 }}>
      <section style={{ background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-xl)', padding: 8, boxSizing: 'border-box' }}>
        <RowList label="문서와 알림">
          <li><ListCell leading={<Icon name="document" size={18} />} title="디자인 토큰" description="검토 요청됨" trailing={<StatusBadge tone="signal">검토</StatusBadge>} onClick={() => {}} divider /></li>
          <li><ListCell leading={<Icon name="layers" size={18} />} title="컴포넌트 문서" description="업데이트 완료" trailing={<Kbd>CMD K</Kbd>} onClick={() => {}} divider selected /></li>
          <li><ListCell leading={<Icon name="bell" size={18} />} title="알림 3건" description="확인 필요한 변경 사항" chevron onClick={() => {}} /></li>
        </RowList>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('ul[role="list"]');
    if (!list || list.querySelectorAll(':scope > li').length !== 3) {
      throw new Error('반복되는 행은 ul/li로 묶여야 항목 수와 위치가 전달됩니다(WCAG 1.3.1).');
    }
    const rows = [...list.querySelectorAll(':scope > li > [role="button"]')];
    if (rows.length !== 3) {
      throw new Error('인터랙티브 행의 role="button"은 li 래퍼 안쪽에 있어야 listitem 의미가 유지됩니다.');
    }
  },
};

export const ListCellStates = {
  name: '변형·상태 · 밀도와 선택 상태',
  parameters: storyDescription(
    '목록의 밀도, 선택·비활성·상호작용 상태, 긴 텍스트 처리를 비교하는 상황입니다. 패딩이 달라도 행의 기준선이 안정적이고 여러 줄 콘텐츠와 키보드 포커스가 잘리거나 겹치지 않는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 920, minWidth: 0 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 'var(--space-4)', minWidth: 0 }}>
        <div style={{ background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-xl)', padding: 8, boxSizing: 'border-box' }}>
          <RowList label="세로 패딩 비교">
            <li><ListCell verticalPadding="none" title="패딩 없음" trailing={<Icon name="chevron-right" />} divider /></li>
            <li><ListCell verticalPadding="small" title="작은 패딩" trailing={<Icon name="chevron-right" />} divider /></li>
            <li><ListCell verticalPadding="medium" title="기본 패딩" trailing={<Icon name="chevron-right" />} divider /></li>
            <li><ListCell verticalPadding="large" title="큰 패딩" trailing={<Icon name="chevron-right" />} /></li>
          </RowList>
        </div>
        <div style={{ background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-xl)', padding: 8, boxSizing: 'border-box' }}>
          <RowList label="행 상태 비교">
            <li><ListCell title="기본 행" description="보조 텍스트" divider /></li>
            <li><ListCell title="선택된 행" description="selected 상태" selected divider /></li>
            <li><ListCell title="비활성 행" description="disabled 상태" disable divider /></li>
            <li><ListCell title="셰브론 행" description="탐색 이동" chevron /></li>
          </RowList>
        </div>
      </section>
      <section style={{ background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-xl)', padding: 8, boxSizing: 'border-box' }}>
        <RowList label="여러 줄과 상호작용 상태">
          <li>
            <ListCell
              leading={<Icon name="document" />}
              verticalAlign="top"
              textEllipsis={false}
              title="말줄임을 끈 여러 줄 제목은 행 높이를 자연스럽게 늘립니다"
              description="긴 설명 텍스트가 들어오는 콘텐츠 리스트에서는 verticalAlign top과 textEllipsis false를 조합해 읽기 흐름을 유지합니다."
              trailing={<ContentBadge color="accent">검토</ContentBadge>}
              divider
            />
          </li>
          <li><ListCell leading={<Icon name="bell" />} title="호버 미리보기" description="포인터가 올라간 상태" interaction="hovered" divider /></li>
          <li><ListCell leading={<Icon name="check" />} title="포커스 미리보기" description="키보드 포커스 링" interaction="focused" divider /></li>
          <li><ListCell leading={<Icon name="circle-check" />} title="프레스 미리보기" description="눌림 시각 상태" interaction="pressed" /></li>
        </RowList>
      </section>
    </main>
  ),
};

export const ListCellAccordionCard = { ...ListCellAccordionCardStory, name: 'ListCell · Accordion card parity', tags: ['!dev', 'visual-parity'] };
