import { DescriptionList } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Data/Display/Description List',
  parameters: {
    storyGuide: {
      storyId: 'lds-product-data-display-description-list--description-list-patterns',
      eyebrow: 'Product / Data / Description List',
      title: '사용자가 항목의 작은 메타데이터 묶음을 라벨과 값으로 읽습니다',
      description:
        '한 객체의 제원·담당자·점검일처럼 소수의 용어와 값을 설명할 때 적합합니다. 많은 행을 정렬·탐색하거나 여러 객체를 비교해야 하면 Description List 대신 Table 또는 Data Grid를 사용하세요.',
    },
    docs: {
      description: {
        component: '표로 만들기에는 작은 용어-값 쌍 메타데이터를 나열하는 DescriptionList 패턴입니다.',
      },
    },
  },
};

export default meta;

export const DescriptionListPatterns = {
  name: '개요',
  parameters: storyDescription(
    '한 열과 두 열 레이아웃으로 문서 및 로봇 메타데이터를 보여 주는 상황입니다. 용어와 값의 대응이 분명하고 열 수가 달라도 읽기 순서가 자연스러운지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 720 }}>
      <section style={{ display: 'grid', gap: 'var(--space-3)', maxWidth: 420 }}>
        <DescriptionList
          columns={1}
          items={[
            { term: '문서 유형', description: '컴포넌트 가이드' },
            { term: '검토 주기', description: '주간' },
            { term: '검증 상태', description: '완료' },
          ]}
        />
      </section>
      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <DescriptionList
          columns={2}
          items={[
            { term: '로봇 ID', description: 'AMR-021' },
            { term: '가동 구역', description: 'B동 2층' },
            { term: '최근 점검', description: '2026-07-02' },
            { term: '담당자', description: '설비운영팀' },
          ]}
        />
      </section>
    </main>
  ),
};
