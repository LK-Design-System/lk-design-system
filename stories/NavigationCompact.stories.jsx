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
        component: 'Compact navigation patterns for constrained surfaces, including Page Indicator and Pagination.',
      },
    },
  },
};

export default meta;

function Section({ title, children }) {
  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <h3 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--label-normal)' }}>{title}</h3>
      {children}
    </section>
  );
}

export const CompactNavigation = { ...CompactNavigationStory, name: 'Compact navigation' };

export const PaginationPatterns = {
  name: 'Page indicator and pagination',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 880 }}>
      <Section title="Page indicator counter and dots">
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

      <Section title="Pagination variants and control slots">
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
