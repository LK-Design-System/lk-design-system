import { Breadcrumb } from '../src/index.js';
import { BreadcrumbCard as BreadcrumbCardStory } from './NavigationFull.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Navigation/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-navigation-breadcrumb--breadcrumb-routes',
      eyebrow: 'Product / Breadcrumb',
      title: '브레드크럼은 현재 화면까지의 상위 경로를 되짚게 합니다',
      description:
        '세 단계 이상 중첩된 콘텐츠·관리 화면에서 상위 경로로 돌아갈 때 적합합니다. 순차 작업의 진행 상태에는 Breadcrumb 대신 Steps나 Wizard를 사용하세요.',
    },
    docs: {
      description: {
        component: 'Breadcrumb는 랜딩의 전역 탐색이 아니라 제품·콘텐츠 내부의 현재 경로를 단계별 링크로 보여주는 LK Product Extension입니다.',
      },
    },
  },
};

export default meta;

export const BreadcrumbRoutes = {
  name: '개요',
  parameters: storyDescription(
    '홈에서 문서 개요까지 이어지는 3단계 경로를 보여줍니다. 이전 단계는 링크로 이동할 수 있고 마지막 항목은 현재 위치로만 읽히는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 760 }}>
      <Breadcrumb items={[{ label: '홈', href: '#' }, { label: '문서', href: '#' }, { label: '개요' }]} />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector('nav[aria-label="현재 위치"]');
    if (!nav) throw new Error('Breadcrumb must expose a nav landmark with the default aria-label 현재 위치.');
    const list = nav.querySelector('ol');
    if (!list) throw new Error('Breadcrumb must render its trail as an ordered list.');
    const items = list.querySelectorAll('li');
    if (items.length !== 3) throw new Error('Breadcrumb must render one list item per path segment.');
    const current = list.querySelector('[aria-current="page"]');
    if (!current || current.textContent !== '개요') {
      throw new Error('The last breadcrumb item must carry aria-current="page".');
    }
    if (current.closest('a') || current.tagName === 'A') {
      throw new Error('The current page item must not be a link.');
    }
  },
};

export const BreadcrumbCard = { ...BreadcrumbCardStory, name: 'Breadcrumb card parity', tags: ['!dev', 'visual-parity'] };
