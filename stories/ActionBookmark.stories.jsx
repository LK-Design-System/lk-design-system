import { Bookmark } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Action/Bookmark',
  component: Bookmark,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-action-bookmark--bookmark-states',
      eyebrow: 'Product / Bookmark',
      title: '사용자가 다시 찾을 항목의 저장 상태를 즉시 전환합니다',
      description:
        '카드·목록·문서의 trailing action에서 한 항목을 저장하거나 저장 해제할 때 적합합니다. 일회성 실행이나 여러 항목의 폼 선택에는 Bookmark 대신 Button 또는 Checkbox를 사용하세요.',
    },
    docs: {
      description: {
        component: '아웃라인과 채움 상태로 저장 여부를 나타내는 제어·비제어 LK Product Bookmark 토글입니다.',
      },
    },
  },
};

export default meta;

function StateSample({ label, children }) {
  return (
    <section style={{ minWidth: 120, display: 'grid', justifyItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-4)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)' }}>
      {children}
      <span style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)' }}>{label}</span>
    </section>
  );
}

export const BookmarkStates = {
  name: '개요',
  parameters: storyDescription(
    '목록 항목의 미저장·저장·비활성 상태를 나란히 비교하는 상황입니다. 채움 외에도 pressed와 disabled 의미가 보조 기술에 전달되고 각 상태의 target 크기가 유지되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'flex', alignItems: 'start', gap: 'var(--space-4)', flexWrap: 'wrap', maxWidth: 560 }}>
      <StateSample label="저장 안 됨"><Bookmark /></StateSample>
      <StateSample label="저장됨"><Bookmark defaultActive /></StateSample>
      <StateSample label="사용 불가"><Bookmark defaultActive disabled /></StateSample>
    </main>
  ),
};
