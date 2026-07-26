import { ExpandableText } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Content/Expandable Text',
  tags: ['autodocs'],
  component: ExpandableText,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-content-expandable-text--overview',
      eyebrow: 'Product / Expandable Text',
      title: '긴 본문을 몇 줄로 접고 "더 보기"로 펼칩니다',
      description:
        '피드 본문·긴 설명·댓글처럼 목록에서 길이를 고르게 유지해야 할 인라인 텍스트에 적합합니다. 제목이 있는 섹션을 통째로 접을 때는 이 컴포넌트 대신 섹션 접기(디스클로저)를 사용하세요.',
    },
    docs: {
      description: {
        component:
          'ExpandableText는 지정한 줄 수로 클램프하고 "더 보기 / 접기"로 나머지를 펼치는 인라인 텍스트입니다. 전체 텍스트는 항상 DOM에 있어 스크린리더가 전문을 읽습니다.',
      },
    },
  },
};

export default meta;

const body =
  'LK Robotics 운영 콘솔은 로봇 상태와 현장 기록을 한 흐름에서 보여줍니다. 이 카드 본문은 목록에서 길이를 고르게 유지하기 위해 세 줄로 접혀 있고, 더 보기를 누르면 나머지가 펼쳐집니다. 접힘은 시각적 자르기일 뿐이라 보조기기는 펼침 여부와 상관없이 전문을 읽습니다. 이렇게 하면 정보를 숨기지 않으면서도 화면에서는 밀도를 유지할 수 있습니다.';

export const Overview = {
  name: '개요',
  parameters: storyDescription(
    '세 줄로 접힌 본문을 펼쳤다 접는 상황입니다. 넘치는 텍스트에만 토글이 나타나고, 토글이 `aria-expanded`와 대상 영역(`aria-controls`)을 소유하는지 확인하세요.',
  ),
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <ExpandableText lines={3}>{body}</ExpandableText>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const btn = canvasElement.querySelector('button[aria-expanded]');
    if (!btn) throw new Error('넘치는 텍스트에는 펼치기 토글이 나타나야 합니다.');
    if (btn.getAttribute('aria-expanded') !== 'false') throw new Error('처음에는 접힌 상태여야 합니다.');
    const controls = btn.getAttribute('aria-controls');
    const region = canvasElement.ownerDocument.getElementById(controls);
    if (!region) throw new Error('토글의 aria-controls가 텍스트 영역 id를 가리켜야 합니다.');
    btn.click();
    await new Promise((resolve) => setTimeout(resolve, 0));
    if (btn.getAttribute('aria-expanded') !== 'true') throw new Error('클릭하면 펼쳐져(aria-expanded=true) 합니다.');
  },
};

export const ShortAndExpanded = {
  name: '변형·상태 · 짧은 글과 펼친 시작',
  parameters: storyDescription(
    '접을 필요가 없는 짧은 글에는 토글이 렌더되지 않고, `defaultExpanded`로 펼친 채 시작해도 다시 접을 수 있어야 하는 상황입니다.',
  ),
  render: () => (
    <div style={{ maxWidth: 360, display: 'grid', gap: 'var(--space-4)' }}>
      <ExpandableText lines={3}>세 줄을 넘지 않는 짧은 안내 문구에는 더 보기 토글이 나타나지 않습니다.</ExpandableText>
      <ExpandableText lines={2} defaultExpanded>{body}</ExpandableText>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const toggles = canvasElement.querySelectorAll('button[aria-expanded]');
    // 짧은 글: 토글 없음 / 펼친 글: 토글 하나(접기) — 합쳐서 정확히 1개.
    if (toggles.length !== 1) throw new Error('짧은 글에는 토글이 없어야 하고, 펼친 글에는 접기 토글이 있어야 합니다.');
    if (toggles[0].getAttribute('aria-expanded') !== 'true') throw new Error('defaultExpanded 글은 펼친 상태(접기 가능)로 시작해야 합니다.');
  },
};

export const NarrowExpandable = {
  name: '반응형 · 320px',
  parameters: storyDescription(
    '320px 폭에서 접힌 본문과 토글이 컨테이너를 넘치지 않는지 확인하는 상황입니다.',
  ),
  render: () => (
    <div data-testid="expandable-narrow" style={{ width: 320, maxWidth: '100%' }}>
      <ExpandableText lines={3}>{body}</ExpandableText>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const wrap = canvasElement.querySelector('[data-testid="expandable-narrow"]');
    if (!wrap || wrap.scrollWidth > wrap.clientWidth + 1) {
      throw new Error('ExpandableText는 320px 컨테이너에서 가로 스크롤을 만들지 않아야 합니다.');
    }
  },
};

// Hidden visual-parity contract (not in the sidebar).
export const ExpandableTextCard = {
  name: 'ExpandableText card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 420, height: 220, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <ExpandableText lines={3}>{body}</ExpandableText>
    </div>
  ),
};
