import {
  Breadcrumb,
  Category,
  Tabs,
} from '../src/index.js';
import {
  BreadcrumbCard as BreadcrumbCardStory,
  TabsCard as TabsCardStory,
} from './NavigationFull.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Navigation/Tabs and Routes',
  parameters: {
    docs: {
      description: {
        component: 'Route, tab, and category navigation patterns aligned with Navigation Tab and Category sources.',
      },
    },
  },
};

export default meta;

const tabItems = [
  { value: 'overview', label: 'Overview', count: 2 },
  { value: 'activity', label: 'Activity' },
  { value: 'settings', label: 'Settings', trailingIconButton: true },
  { value: 'disabled', label: 'Disabled', disabled: true },
];

const categoryItems = [
  'All',
  'Recommended',
  'Following',
  'Jobs',
  'Companies',
  'Education',
  'Events',
];

function Section({ title, children }) {
  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <h3 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--label-normal)' }}>{title}</h3>
      {children}
    </section>
  );
}

export const TabsAndBreadcrumb = {
  name: 'Breadcrumb routes',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 760 }}>
      <Breadcrumb items={[{ label: 'Home', href: '#' }, { label: 'Docs', href: '#' }, { label: 'Overview' }]} />
    </main>
  ),
};

export const TabAndCategoryPatterns = {
  name: 'Tab and category patterns',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 920 }}>
      <Section title="Tab resize, size, padding, trailing icon button">
        <div style={{ display: 'grid', gap: 18 }}>
          <Tabs items={tabItems} defaultValue="overview" resize="hug" size="small" />
          <Tabs items={tabItems} defaultValue="activity" resize="fill" size="medium" padding trailingIconButton />
          <Tabs items={tabItems} defaultValue="settings" resize="hug" size="large" scroll />
        </div>
      </Section>

      <Section title="Category variant, size, padding, vertical padding, scroll">
        <div style={{ display: 'grid', gap: 14 }}>
          <Category items={categoryItems} defaultValue="All" size="small" />
          <Category items={categoryItems} defaultValue="Recommended" variant="alternative" size="medium" padding />
          <Category items={categoryItems} defaultValue="Companies" size="xlarge" padding verticalPadding scroll />
        </div>
      </Section>
    </main>
  ),
};

export const TabsCard = { ...TabsCardStory, name: 'Tabs card parity', tags: ['!dev', 'visual-parity'] };
export const BreadcrumbCard = { ...BreadcrumbCardStory, name: 'Breadcrumb card parity', tags: ['!dev', 'visual-parity'] };
