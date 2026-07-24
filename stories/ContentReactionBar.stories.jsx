import { ReactionBar } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Content/Reaction Bar',
  component: ReactionBar,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-content-reaction-bar--overview',
      eyebrow: 'Product / Reaction Bar',
      title: '게시물·댓글·기사에 좋아요·댓글·공유를 답니다',
      description:
        '소셜 게시물이나 기사 하단의 인게이지먼트 액션에 적합합니다. 저장·전송 같은 단일 확정 액션이나 폼 제출에는 이 바 대신 버튼을 사용하세요.',
    },
    docs: {
      description: {
        component:
          'ReactionBar는 좋아요(토글)·댓글·공유와 각 수를 담는 인게이지먼트 바입니다. 각 수는 컨트롤 접근 이름에 합성되고 눈에 보이는 숫자는 보조기기에서 숨겨집니다.',
      },
    },
  },
};

export default meta;

export const Overview = {
  name: '개요',
  parameters: storyDescription(
    '좋아요를 눌러 상태와 아이콘이 바뀌는 상황입니다. 좋아요가 `aria-pressed`를 소유하고 각 수가 컨트롤 접근 이름(예: "좋아요 12개")에 합성되는지 확인하세요.',
  ),
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <ReactionBar
        like={{ count: 12, defaultActive: false }}
        comment={{ count: 3 }}
        share={{}}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const like = canvasElement.querySelector('button[aria-pressed]');
    if (!like) throw new Error('좋아요는 aria-pressed를 가진 토글이어야 합니다.');
    if (like.getAttribute('aria-pressed') !== 'false') throw new Error('처음엔 눌리지 않은 상태여야 합니다.');
    if (!/좋아요\s*12개/.test(like.getAttribute('aria-label') || '')) {
      throw new Error('좋아요 수가 접근 이름에 "좋아요 12개"로 합성되어야 합니다.');
    }
    const names = [...canvasElement.querySelectorAll('button')].map((b) => b.getAttribute('aria-label') || '');
    if (!names.some((n) => /댓글\s*3개/.test(n))) throw new Error('댓글 수가 접근 이름에 합성되어야 합니다.');
    if (!names.some((n) => /공유/.test(n))) throw new Error('공유 액션에 접근 이름이 있어야 합니다.');
    like.click();
    await new Promise((resolve) => setTimeout(resolve, 0));
    if (like.getAttribute('aria-pressed') !== 'true') throw new Error('좋아요를 누르면 aria-pressed=true가 되어야 합니다.');
  },
};

export const Partial = {
  name: '변형·상태 · 부분 구성과 눌린 좋아요',
  parameters: storyDescription(
    '좋아요만 있는 바, 공유만 있는 바, 이미 눌린 좋아요처럼 부분 구성이 가능한 상황입니다. 수가 없으면 숫자를 렌더하지 않습니다.',
  ),
  render: () => (
    <div style={{ maxWidth: 360, display: 'grid', gap: 'var(--space-4)' }}>
      <ReactionBar like={{ count: 128, active: true }} comment={{ count: 9 }} share={{ count: 4 }} />
      <ReactionBar like={{ defaultActive: false }} />
      <ReactionBar share={{}} align="between" />
    </div>
  ),
};

export const NarrowReaction = {
  name: '반응형 · 320px',
  parameters: storyDescription(
    '320px 폭에서 인게이지먼트 바가 컨테이너를 넘치지 않는지 확인하는 상황입니다.',
  ),
  render: () => (
    <div data-testid="reaction-narrow" style={{ width: 320, maxWidth: '100%' }}>
      <ReactionBar like={{ count: 1240 }} comment={{ count: 88 }} share={{ count: 12 }} align="between" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const wrap = canvasElement.querySelector('[data-testid="reaction-narrow"]');
    if (!wrap || wrap.scrollWidth > wrap.clientWidth + 1) {
      throw new Error('ReactionBar는 320px 컨테이너에서 가로 스크롤을 만들지 않아야 합니다.');
    }
    // 큰 수는 한국식으로 축약되어 보인다(1240 → 1.2천).
    if (!wrap.textContent.includes('1.2천')) {
      throw new Error('큰 수는 눈에 보이는 곳에서 축약되어야 합니다(1240 → 1.2천).');
    }
    // 접근 이름에는 정확한 수가 유지된다.
    const like = wrap.querySelector('button[aria-pressed]');
    if (!/1240/.test(like.getAttribute('aria-label') || '')) {
      throw new Error('접근 이름에는 축약 없이 정확한 수(1240)가 유지되어야 합니다.');
    }
  },
};

// Hidden visual-parity contract (not in the sidebar).
export const ReactionBarCard = {
  name: 'ReactionBar card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 420, height: 160, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <div style={{ display: 'grid', gap: 16 }}>
        <ReactionBar like={{ count: 12, active: false }} comment={{ count: 3 }} share={{}} />
        <ReactionBar like={{ count: 128, active: true }} comment={{ count: 9 }} share={{ count: 4 }} />
      </div>
    </div>
  ),
};
