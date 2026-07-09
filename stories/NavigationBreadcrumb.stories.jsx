import { Breadcrumb } from '../src/index.js';
import { BreadcrumbCard as BreadcrumbCardStory } from './NavigationFull.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Navigation/Breadcrumb',
  parameters: {
    docs: {
      description: {
        component: '현재 위치까지의 경로를 단계별 링크로 보여주는 Breadcrumb 패턴입니다.',
      },
    },
  },
};

export default meta;

export const BreadcrumbRoutes = {
  name: '브레드크럼 라우트',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 760 }}>
      <Breadcrumb items={[{ label: '홈', href: '#' }, { label: '문서', href: '#' }, { label: '개요' }]} />
    </main>
  ),
};

export const BreadcrumbCard = { ...BreadcrumbCardStory, name: 'Breadcrumb card parity', tags: ['!dev', 'visual-parity'] };
