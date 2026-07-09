import { DescriptionList } from '../src/index.js';

const meta = {
  title: 'LDS Product/Data/Description List',
  parameters: {
    docs: {
      description: {
        component: '표로 만들기에는 작은 용어-값 쌍 메타데이터를 나열하는 DescriptionList 패턴입니다.',
      },
    },
  },
};

export default meta;

export const DescriptionListPatterns = {
  name: '항목 메타데이터',
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
