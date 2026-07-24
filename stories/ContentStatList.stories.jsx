import { StatList } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Content/Stat List',
  component: StatList,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-content-stat-list--overview',
      eyebrow: 'Product / Stat List',
      title: '팔로워·팔로잉처럼 라벨 붙은 수를 한 줄로 나열합니다',
      description:
        '프로필·계정 마스트헤드의 메타 행이나 조직·리소스 요약처럼 라벨과 수가 짝지어 이어질 때 적합합니다. 값이 크게 서는 대시보드 지표 타일이나 헤어라인이 있는 블록형 사양 표에는 이 컴포넌트를 사용하지 마세요.',
    },
    docs: {
      description: {
        component:
          'StatList는 라벨-값 쌍을 한 줄에 나열하는 인라인 목록입니다. 시맨틱 목록으로 렌더되고, 링크가 있는 항목은 접근 이름이 라벨과 값을 합쳐 낭독됩니다.',
      },
    },
  },
};

export default meta;

export const Overview = {
  name: '개요',
  parameters: storyDescription(
    '프로필 헤더의 스탯 행을 배치하는 상황입니다. 목록으로 묶여 개수가 낭독되는지, 이동하는 스탯이 링크가 되고 그 접근 이름이 "팔로워 128"처럼 라벨+값으로 합성되는지 확인하세요.',
  ),
  render: () => (
    <StatList
      items={[
        { label: '팔로워', value: 128, href: '/followers' },
        { label: '팔로잉', value: 64, href: '/following' },
        { label: '포인트', value: '3,000P' },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('ul[role="list"]');
    if (!list) throw new Error('스탯은 시맨틱 목록(ul role="list")으로 묶여야 합니다.');
    const items = list.querySelectorAll('li');
    if (items.length !== 3) throw new Error('항목 수만큼 li가 렌더되어야 합니다.');
    const links = list.querySelectorAll('a[href]');
    if (links.length !== 2) throw new Error('href가 있는 항목만 링크가 되어야 합니다.');
    if (links[0].getAttribute('aria-label') !== '팔로워 128') {
      throw new Error('링크 접근 이름은 라벨과 값을 합쳐 "팔로워 128"이어야 합니다(맨 숫자 금지).');
    }
    // href 없는 항목은 링크가 아니어야 한다.
    if (items[2].querySelector('a')) throw new Error('href 없는 스탯은 링크가 아니어야 합니다.');
  },
};

export const Variants = {
  name: '변형·상태 · 크기와 링크 없음',
  parameters: storyDescription(
    '작은 크기(sm)와 링크가 전혀 없는 읽기 전용 스탯 행을 비교하는 상황입니다.',
  ),
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
      <StatList
        size="sm"
        items={[
          { label: '리포지터리', value: 24 },
          { label: '스타', value: '1.2천' },
        ]}
      />
      <StatList
        items={[
          { label: '멤버', value: 8 },
          { label: '프로젝트', value: 12 },
          { label: '가동률', value: '99.7%' },
        ]}
      />
    </div>
  ),
};

export const NarrowStatList = {
  name: '반응형 · 320px',
  parameters: storyDescription(
    '320px 폭에서 항목이 다음 줄로 wrap되고 컨테이너를 넘치지 않는지 확인하는 상황입니다.',
  ),
  render: () => (
    <div data-testid="statlist-narrow" style={{ width: 320, maxWidth: '100%' }}>
      <StatList
        items={[
          { label: '팔로워', value: '12.8만', href: '/followers' },
          { label: '팔로잉', value: 1024, href: '/following' },
          { label: '포인트', value: '3,000P' },
          { label: '누적 기여', value: 512 },
        ]}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const wrap = canvasElement.querySelector('[data-testid="statlist-narrow"]');
    if (!wrap || wrap.scrollWidth > wrap.clientWidth + 1) {
      throw new Error('StatList는 320px 컨테이너에서 가로 스크롤을 만들지 않아야 합니다.');
    }
  },
};

// Hidden visual-parity contract (not in the sidebar).
export const StatListCard = {
  name: 'StatList card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 480, height: 160, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <div style={{ display: 'grid', gap: 16 }}>
        <StatList
          items={[
            { label: '팔로워', value: 128, href: '#' },
            { label: '팔로잉', value: 64, href: '#' },
            { label: '포인트', value: '3,000P' },
          ]}
        />
        <StatList size="sm" items={[{ label: '리포지터리', value: 24 }, { label: '스타', value: '1.2천' }]} />
      </div>
    </div>
  ),
};
