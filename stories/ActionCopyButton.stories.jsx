import { CopyButton } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Action/Copy Button',
  component: CopyButton,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-action-copy-button--copy-buttons',
      eyebrow: 'Product / Copy Button',
      title: '사용자가 정확한 식별자와 주소를 실수 없이 다시 사용할 수 있습니다',
      description:
        'ID·토큰·URL처럼 그대로 옮겨 써야 하는 짧은 값을 클립보드에 복사할 때 적합합니다. 화면 상태를 바꾸는 작업이나 파일 전체를 전달할 때는 Copy Button 대신 Button 또는 Export Action을 사용하세요.',
    },
    docs: {
      description: {
        component: '복사 버튼은 지정한 값을 클립보드에 쓰고 짧은 완료 피드백으로 결과를 알리는 Product 액션입니다.',
      },
    },
  },
};

export default meta;

const valueStyle = {
  minWidth: 0,
  overflowWrap: 'anywhere',
  color: 'var(--color-semantic-label-neutral)',
  fontFamily: 'var(--font-mono)',
};

export const CopyButtons = {
  name: '개요',
  parameters: storyDescription(
    '사용자가 항목 ID와 문서 주소를 다른 도구에 정확히 붙여 넣어야 하는 상황입니다. 각 버튼의 대상이 라벨로 구분되고 실행 직후 복사 완료 상태가 같은 자리에서 전달되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 720 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', alignItems: 'center', gap: 'var(--space-3)' }}>
        <code style={valueStyle}>item-2026-0705</code>
        <CopyButton value="item-2026-0705">항목 ID 복사</CopyButton>
      </section>
      <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', alignItems: 'center', gap: 'var(--space-3)' }}>
        <code style={valueStyle}>https://design.lkrobotics.dev/docs</code>
        <CopyButton value="https://design.lkrobotics.dev/docs">문서 주소 복사</CopyButton>
      </section>
    </main>
  ),
};
