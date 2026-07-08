import {
  ContentBadge,
  Icon,
  Kbd,
  ListCell,
  StatusBadge,
  StepList,
  Timeline,
} from '../src/index.js';
import { ListCellAccordionCard as ListCellAccordionCardStory } from './Content.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Content/Lists',
  parameters: {
    docs: {
      description: {
        component: '항목 목록, 단계, 타임라인처럼 순서와 상태를 읽는 ListCell, StepList, Timeline 패턴입니다.',
      },
    },
  },
};

export default meta;

const steps = [
  { title: '초안 작성', description: '필수 항목 확인' },
  { title: '검토 요청', description: '담당자 지정' },
  { title: '게시 완료', description: '변경 이력 기록' },
];

export const Lists = {
  name: '리스트',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 920, minWidth: 0 }}>
      <section style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: 8, boxSizing: 'border-box' }}>
        <ListCell leading={<Icon name="document" size={18} />} title="디자인 토큰" description="검토 요청됨" trailing={<StatusBadge tone="signal">검토</StatusBadge>} onClick={() => {}} divider />
        <ListCell leading={<Icon name="layers" size={18} />} title="컴포넌트 문서" description="업데이트 완료" trailing={<Kbd>CMD K</Kbd>} onClick={() => {}} divider selected />
        <ListCell leading={<Icon name="bell" size={18} />} title="알림 3건" description="확인 필요한 변경 사항" chevron onClick={() => {}} />
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 'var(--space-5)', alignItems: 'start', minWidth: 0 }}>
        <StepList steps={steps} editable={false} />
        <Timeline
          items={[
            { time: '09:12', title: '검토 시작', description: '초안이 담당자에게 전달됨', tone: 'signal' },
            { time: '09:18', title: '수정 요청', description: '설명 문구 보완 필요', tone: 'cautionary' },
            { time: '09:26', title: '게시 완료', description: '변경 이력 기록', tone: 'positive' },
          ]}
        />
      </section>
    </main>
  ),
};

export const ListCellStates = {
  name: '리스트 셀 상태',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 920, minWidth: 0 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 'var(--space-4)', minWidth: 0 }}>
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: 8, boxSizing: 'border-box' }}>
          <ListCell verticalPadding="none" title="패딩 없음" trailing={<Icon name="chevron-right" />} divider />
          <ListCell verticalPadding="small" title="작은 패딩" trailing={<Icon name="chevron-right" />} divider />
          <ListCell verticalPadding="medium" title="기본 패딩" trailing={<Icon name="chevron-right" />} divider />
          <ListCell verticalPadding="large" title="큰 패딩" trailing={<Icon name="chevron-right" />} />
        </div>
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: 8, boxSizing: 'border-box' }}>
          <ListCell title="기본 행" description="secondary text" divider />
          <ListCell title="선택된 행" description="selected state" selected divider />
          <ListCell title="비활성 행" description="disabled state" disable divider />
          <ListCell title="셰브론 행" description="navigation" chevron />
        </div>
      </section>
      <section style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: 8, boxSizing: 'border-box' }}>
        <ListCell
          leading={<Icon name="document" />}
          verticalAlign="top"
          textEllipsis={false}
          title="말줄임을 끈 여러 줄 제목은 행 높이를 자연스럽게 늘립니다"
          description="긴 설명 텍스트가 들어오는 콘텐츠 리스트에서는 verticalAlign top과 textEllipsis false를 조합해 읽기 흐름을 유지합니다."
          trailing={<ContentBadge color="accent">검토</ContentBadge>}
          divider
        />
        <ListCell leading={<Icon name="bell" />} title="Hover preview" description="interaction prop for Storybook" interaction="hovered" divider />
        <ListCell leading={<Icon name="check" />} title="Focus preview" description="keyboard focus ring" interaction="focused" divider />
        <ListCell leading={<Icon name="circle-check" />} title="Pressed preview" description="pressed visual state" interaction="pressed" />
      </section>
    </main>
  ),
};

export const ListCellAccordionCard = { ...ListCellAccordionCardStory, name: 'ListCell · Accordion card parity', tags: ['!dev', 'visual-parity'] };
