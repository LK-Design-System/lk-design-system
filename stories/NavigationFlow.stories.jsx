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
        component: 'Navigation Tab, Category 원본에 맞춘 경로, 탭, 카테고리 내비게이션 패턴입니다.',
      },
    },
  },
};

export default meta;

const tabItems = [
  { value: 'overview', label: '개요', count: 2 },
  { value: 'activity', label: '활동' },
  { value: 'settings', label: '설정', trailingIconButton: true },
  { value: 'disabled', label: '비활성', disabled: true },
];

const categoryItems = [
  '전체',
  '로봇',
  '설비',
  '배차',
  '원격 제어',
  '텔레메트리',
  '이벤트',
];

function Section({ title, children }) {
  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <h3 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--color-semantic-label-normal)' }}>{title}</h3>
      {children}
    </section>
  );
}

export const TabsAndBreadcrumb = {
  name: 'Breadcrumb routes',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 760 }}>
      <Breadcrumb items={[{ label: '홈', href: '#' }, { label: '문서', href: '#' }, { label: '개요' }]} />
    </main>
  ),
};

export const TabAndCategoryPatterns = {
  name: 'Tab and category patterns',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 920 }}>
      <Section title="Tab의 resize, size, padding, trailing icon button 축">
        <div style={{ display: 'grid', gap: 18 }}>
          <Tabs items={tabItems} defaultValue="overview" resize="hug" size="small" />
          <Tabs items={tabItems} defaultValue="activity" resize="fill" size="medium" padding trailingIconButton />
          <Tabs items={tabItems} defaultValue="settings" resize="hug" size="large" scroll />
        </div>
      </Section>

      <Section title="Category의 variant, size, padding, vertical padding, scroll 축">
        <div style={{ display: 'grid', gap: 14 }}>
          <Category items={categoryItems} defaultValue="전체" size="small" />
          <Category items={categoryItems} defaultValue="로봇" variant="alternative" size="medium" padding />
          <Category items={categoryItems} defaultValue="배차" size="xlarge" padding verticalPadding scroll />
        </div>
      </Section>
    </main>
  ),
};

export const TabsCard = { ...TabsCardStory, name: 'Tabs card parity', tags: ['!dev', 'visual-parity'] };
export const BreadcrumbCard = { ...BreadcrumbCardStory, name: 'Breadcrumb card parity', tags: ['!dev', 'visual-parity'] };
