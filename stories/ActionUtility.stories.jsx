import {
  CopyButton,
  Link,
} from '../src/index.js';

const meta = {
  title: 'LDS Product/Action/Utility Actions',
  parameters: {
    docs: {
      description: {
        component: '값 복사와 외부 이동처럼 화면 상태를 바꾸지 않는 보조 액션을 담당하는 CopyButton, Link 패턴입니다.',
      },
    },
  },
};

export default meta;

export const UtilityActions = {
  name: '유틸리티 액션',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 720 }}>
      <section style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <CopyButton value="item-2026-0705">항목 ID 복사</CopyButton>
        <CopyButton value="https://design.lkrobotics.dev/docs">문서 주소 복사</CopyButton>
      </section>

      <section style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <Link href="#">내부 문서 링크</Link>
        <Link href="#" external>
          외부 문서 링크
        </Link>
      </section>
    </main>
  ),
};
