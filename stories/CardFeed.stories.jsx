import { FeedCard, Icon } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

// A decorative verified mark for the author badge slot; the article is already
// named by its author, so the mark is aria-hidden here.
const verifiedBadge = <Icon name="verified-check-fill" size={16} aria-hidden="true" style={{ color: 'var(--color-semantic-primary-normal)' }} />;

const meta = {
  title: 'LDS Product/Content/Feed Card',
  tags: ['autodocs'],
  component: FeedCard,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-content-feed-card--overview',
      eyebrow: 'Product / Feed Card',
      title: '작성자·본문·인게이지먼트를 가진 소셜 피드 게시물을 보여줍니다',
      description:
        '작성자 헤더·본문·좋아요/댓글/공유가 반복되는 소셜 피드에 적합합니다. 발행일·출처를 쓰는 기사·보도 카드나, 카드 전체가 하나의 링크인 목록 카드에는 이 컴포넌트를 사용하지 마세요 — 게시물은 링크가 아니라 여러 컨트롤을 담는 영역입니다.',
    },
    docs: {
      description: {
        component:
          'FeedCard는 작성자 헤더(아바타·이름·출처·팔로우·오버플로), 본문("더 보기"로 접힘), 커버, 인게이지먼트 바(좋아요·댓글·공유)로 이루어진 소셜 피드 게시물입니다. 카드=링크가 아니라 여러 컨트롤을 담는 article 영역입니다.',
      },
    },
  },
};

export default meta;

const cover = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180">
    <rect width="320" height="180" fill="#2b8a3e"/>
    <circle cx="250" cy="60" r="46" fill="#51cf66"/>
    <rect x="24" y="132" width="170" height="12" rx="6" fill="#ffffff" opacity="0.9"/>
  </svg>
`)}`;

export const Overview = {
  name: '개요',
  parameters: storyDescription(
    '뉴스 팀 게시물과 커버가 있는 개인 게시물을 같은 피드에서 훑는 상황입니다. 각 게시물이 하나의 링크가 아니라 작성자·팔로우·오버플로·좋아요·댓글·공유를 독립 컨트롤로 담는 article 영역인지, 본문이 "더 보기"로 접히는지 확인하세요.',
  ),
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 520 }}>
      <FeedCard
        author={{ name: '로봇 운영팀', variant: 'company', href: '/teams/robot-operations', badge: verifiedBadge }}
        meta="운영 업데이트"
        time="6시간 전"
        datetime="2026-07-24T03:00:00Z"
        following={false}
        onFollowToggle={() => {}}
        menuItems={[
          { label: '이 게시물 숨기기', onClick: () => {} },
          { label: '신고', danger: true, onClick: () => {} },
        ]}
        like={{ count: 12 }}
        comment={{ count: 1 }}
        share={{}}
      >
        {'IPA와 JPCERT/CC가 공동 운영하는 취약점 대응 포털에 새 항목이 올라왔습니다. 이 본문은 목록에서 길이를 고르게 유지하려고 세 줄로 접혀 있고, 더 보기를 누르면 나머지가 펼쳐집니다. 접힘은 시각적 자르기일 뿐이라 보조기기는 전문을 읽습니다.'}
      </FeedCard>
      <FeedCard
        author={{ name: '현장 지원팀', variant: 'company' }}
        meta="안전 캠페인 · 13시간 전"
        onFollowToggle={() => {}}
        menuItems={[{ label: '신고', danger: true, onClick: () => {} }]}
        cover={cover}
        coverAlt=""
        like={{ count: 40, active: true }}
        comment={{ count: 5 }}
        share={{ count: 2 }}
      >
        {'점심시간에 잠깐 걷기만 해도 오후 집중력이 달라집니다. 오늘의 챌린지를 함께 해요.'}
      </FeedCard>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const posts = [...canvasElement.querySelectorAll('article')];
    if (posts.length !== 2) throw new Error('각 게시물은 하나의 article 영역이어야 합니다.');
    for (const post of posts) {
      if (post.tagName === 'A' || post.closest('a')) throw new Error('피드 게시물은 카드=링크가 아니어야 합니다(여러 컨트롤 포함).');
      if (!/님의 게시물$/.test(post.getAttribute('aria-label') || '')) {
        throw new Error('article은 작성자 기준 접근 이름(…님의 게시물)을 가져야 합니다.');
      }
      if (!post.querySelector('button[aria-pressed]')) throw new Error('각 게시물에 좋아요 토글이 있어야 합니다.');
      const labels = [...post.querySelectorAll('button')].map((b) => b.getAttribute('aria-label') || b.textContent || '');
      // 오버플로(게시물 옵션)는 본문 펼치기 "더 보기"와 접근 이름이 겹치지 않아야 한다.
      if (!labels.some((l) => /게시물 옵션/.test(l))) throw new Error('각 게시물에 오버플로(게시물 옵션) 트리거가 있어야 합니다.');
      if (!labels.some((l) => /팔로우|팔로잉/.test(l))) throw new Error('각 게시물에 팔로우 컨트롤이 있어야 합니다.');
    }
    // 첫 게시물 본문은 접혀 있고 펼치기 토글을 가진다.
    const expandToggle = posts[0].querySelector('button[aria-expanded]');
    if (!expandToggle) throw new Error('긴 본문 게시물에는 더 보기 토글이 있어야 합니다.');
    // time/datetime을 주면 헤더 시간이 기계판독 <time datetime>으로 렌더된다.
    const timeEl = posts[0].querySelector('time[datetime]');
    if (!timeEl) throw new Error('time/datetime을 주면 헤더 시간이 <time datetime>으로 렌더되어야 합니다.');
  },
};

export const Variants = {
  name: '변형·상태 · 커버 없음 · 접기 해제 · 팔로잉',
  parameters: storyDescription(
    '커버 없는 짧은 게시물, 본문을 접지 않는 게시물(clamp=false), 이미 팔로우한 상태를 배치하는 상황입니다.',
  ),
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 520 }}>
      <FeedCard
        author={{ name: 'LK Robotics', variant: 'company' }}
        meta="공지 · 2시간 전"
        following
        onFollowToggle={() => {}}
        like={{ count: 3 }}
        comment={{ count: 0 }}
      >
        {'짧은 공지에는 더 보기 토글이 나타나지 않습니다.'}
      </FeedCard>
      <FeedCard
        author={{ name: 'AI Native 데일리 인사이트', variant: 'company', href: '#' }}
        meta="팀 프로필"
        clamp={false}
        like={{ count: 21, active: true }}
        share={{ count: 7 }}
      >
        {'clamp=false면 본문을 접지 않고 전체를 렌더합니다. 요약이 아니라 전문을 항상 보여줘야 하는 피드에 씁니다.'}
      </FeedCard>
    </div>
  ),
};

export const NarrowFeed = {
  name: '반응형 · 320px',
  parameters: storyDescription(
    '320px 폭에서 게시물 카드가 컨테이너를 넘치지 않는지 확인하는 상황입니다. 작성자 헤더의 팔로우·오버플로가 겹치지 않고, 커버가 16:9로 유지되는지 확인하세요.',
  ),
  render: () => (
    <div data-testid="feed-narrow" style={{ width: 320, maxWidth: '100%' }}>
      <FeedCard
        author={{ name: '현장 지원팀', variant: 'company' }}
        meta="안전 캠페인 · 13시간 전"
        onFollowToggle={() => {}}
        menuItems={[{ label: '신고', danger: true, onClick: () => {} }]}
        cover={cover}
        like={{ count: 40 }}
        comment={{ count: 5 }}
        share={{}}
      >
        {'점심시간에 잠깐 걷기만 해도 오후 집중력이 달라집니다. 이 본문은 좁은 폭에서도 세 줄로 접혀 길이를 유지합니다.'}
      </FeedCard>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const wrap = canvasElement.querySelector('[data-testid="feed-narrow"]');
    if (!wrap || wrap.scrollWidth > wrap.clientWidth + 1) {
      throw new Error('FeedCard는 320px 컨테이너에서 가로 스크롤을 만들지 않아야 합니다.');
    }
  },
};

// Hidden visual-parity contract (not in the sidebar).
export const FeedCardCard = {
  name: 'FeedCard card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 560, height: 560, background: 'var(--color-semantic-background-normal-alternative)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <FeedCard
        author={{ name: '로봇 운영팀', variant: 'company' }}
        meta="운영 업데이트 · 6시간 전"
        following={false}
        onFollowToggle={() => {}}
        menuItems={[{ label: '신고', danger: true, onClick: () => {} }]}
        cover={cover}
        like={{ count: 12, active: true }}
        comment={{ count: 1 }}
        share={{}}
      >
        {'작성자 헤더, 본문, 커버, 인게이지먼트 바를 한 장으로 조립한 피드 게시물 카드입니다.'}
      </FeedCard>
    </div>
  ),
};
