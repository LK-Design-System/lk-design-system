import {
  PageIndicator,
  Pagination,
} from '../src/index.js';
import { CompactNavigation as CompactNavigationStory, BottomNavCard as BottomNavCardStory } from './NavigationFull.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Navigation/Compact Navigation',
  parameters: {
    docs: {
      description: {
        component: 'Page Indicator와 Pagination을 포함해 좁은 화면을 위한 컴팩트 내비게이션 패턴입니다.',
      },
    },
  },
};

export default meta;

function Section({ title, children }) {
  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <h3 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--color-semantic-label-normal)' }}>{title}</h3>
      {children}
    </section>
  );
}

export const CompactNavigation = { ...CompactNavigationStory, name: 'Compact navigation' };

export const PaginationPatterns = {
  name: 'Page indicator and pagination',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 880 }}>
      <Section title="페이지 인디케이터 카운터와 도트">
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <PageIndicator page={1} count={10} size="small" />
          <PageIndicator page={1} count={10} size="medium" />
          <PageIndicator page={1} count={10} alternative />
          <PageIndicator variant="dot" page={1} count={6} size="small" />
          <span style={{ display: 'inline-flex', padding: 8, borderRadius: 10, background: 'var(--bw-gray)' }}>
            <PageIndicator variant="dot" page={1} count={6} alternative />
          </span>
        </div>
      </Section>

      <Section title="페이지네이션 변형과 컨트롤 슬롯">
        <div style={{ display: 'grid', gap: 18 }}>
          <Pagination page={6} count={24} variant="extended" pageSize={20} showCounter showPageJump />
          <Pagination page={6} count={24} variant="compact" showCounter />
          <Pagination page={6} count={24} variant="minimize" leadingContent={<span />} trailingContent={<PageIndicator page={6} count={24} />} />
        </div>
      </Section>
    </main>
  ),
};

export const BottomNavCard = { ...BottomNavCardStory, name: 'BottomNav card parity', tags: ['!dev', 'visual-parity'] };
