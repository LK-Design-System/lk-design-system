import {
  Breadcrumb,
  Tabs,
} from '../src/index.js';
import {
  BreadcrumbCard as BreadcrumbCardStory,
  TabsCard as TabsCardStory,
} from './NavigationFull.shared.jsx';

const meta = {
  title: 'WDS Core/3 Component/6 Navigation/Tabs and Routes',
  parameters: {
    docs: {
      description: {
        component: '현재 위치와 같은 화면 안의 하위 뷰를 안내하는 Breadcrumb, Tabs 패턴입니다.',
      },
    },
  },
};

export default meta;

export const TabsAndBreadcrumb = {
  name: '탭과 경로',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 760 }}>
      <Breadcrumb items={[{ label: '홈', href: '#' }, { label: '문서', href: '#' }, { label: '개요' }]} />
      <Tabs
        items={[
          { value: 'status', label: '상태', count: 3 },
          { value: 'log', label: '로그' },
          { value: 'setting', label: '설정' },
        ]}
        defaultValue="status"
      />
    </main>
  ),
};

export const TabsCard = { ...TabsCardStory, name: 'Tabs card parity', tags: ['!dev', 'visual-parity'] };
export const BreadcrumbCard = { ...BreadcrumbCardStory, name: 'Breadcrumb card parity', tags: ['!dev', 'visual-parity'] };
