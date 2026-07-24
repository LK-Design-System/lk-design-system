import { Prose } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Content/Prose',
  component: Prose,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-content-prose--prose-example',
      eyebrow: 'Core / Prose',
      title: '형식화된 글 한 덩어리를 문서 타이포그래피로 조판합니다',
      description:
        '마크다운 출력·문서 본문·어시스턴트 rich response처럼 이미 파싱된 형식화 콘텐츠에 DS 문서 타이포그래피를 입힐 때 적합합니다. 마크다운 문자열을 파싱·정화하거나 편집이 필요할 때는 Prose를 사용하지 않고 제품의 파서·전용 편집기를 쓰며, 결과 노드만 넘기세요.',
    },
    docs: {
      description: {
        component:
          '제품이 파싱·정화한 React 노드에 heading·리스트·표·코드·인용의 조판을 입히는 Prose 표면입니다. 엔진은 제품이 소유합니다.',
      },
    },
  },
};

export default meta;

/* Prose는 이미 렌더된 노드를 받으므로, 스토리는 파서 출력을 흉내 낸 표준 요소를
   직접 넘긴다(실제 제품에서는 마크다운 파서가 이 트리를 만든다). */
function ArticleBody() {
  return (
    <>
      <h2>점검 공지</h2>
      <p>
        금일 <strong>18:00</strong>부터 관제 서버 점검을 진행합니다. 자세한 절차는{' '}
        <a href="/ops/maintenance">운영 문서</a>를 참고하세요.
      </p>
      <h3>영향 범위</h3>
      <ul>
        <li>실시간 텔레메트리 스트림 일시 중단</li>
        <li>
          맵 타일 캐시 재생성 — <code>lkr-map-cache</code> 재기동
        </li>
      </ul>
      <blockquote>복구 예정 시각은 본문에 명확히 적어 주세요.</blockquote>
      <h3>재기동 명령</h3>
      <pre>
        <code>{`systemctl restart lkr-control
systemctl status lkr-control`}</code>
      </pre>
      <h3>담당</h3>
      <table>
        <thead>
          <tr>
            <th scope="col">구역</th>
            <th scope="col">담당</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>대덕 A동</td>
            <td>관제 1팀</td>
          </tr>
          <tr>
            <td>대덕 B동</td>
            <td>관제 2팀</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export const ProseExample = {
  name: '개요',
  parameters: storyDescription(
    '어시스턴트 응답이나 공지 본문처럼 파싱된 형식화 콘텐츠를 조판하는 상황입니다. heading·리스트·표·코드 블록·인용이 하나의 문서 위계로 읽히고, 코드와 인용이 Code·Blockquote 원자와 같은 시각 언어를 쓰는지 확인하세요.',
  ),
  render: () => (
    <main style={{ padding: 'var(--space-4)' }}>
      <Prose>
        <ArticleBody />
      </Prose>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const prose = canvasElement.querySelector('.lk-prose');
    if (!prose) throw new Error('Prose는 .lk-prose 스코프 컨테이너로 렌더되어야 합니다.');

    // 요소 시맨틱은 콘텐츠가 전달하고 Prose는 시각만 입힌다.
    if (!prose.querySelector('h2') || !prose.querySelector('h3')) {
      throw new Error('heading은 실제 heading 요소로 조판되어야 합니다(WCAG 1.3.1).');
    }
    const pre = prose.querySelector('pre');
    if (!pre || !pre.querySelector('code')) {
      throw new Error('코드 블록은 pre > code로 조판되어야 합니다.');
    }
    if (!prose.querySelector('th[scope="col"]')) {
      throw new Error('표 헤더 스코프는 콘텐츠가 전달하고 Prose가 시각을 입힙니다.');
    }

    // 스코프 CSS가 실제로 적용되었는지 — 인라인 코드 칩의 틴트 배경이 투명이 아니다.
    const inlineCode = [...prose.querySelectorAll('code')].find((node) => node.closest('pre') == null);
    if (inlineCode) {
      const bg = doc.defaultView.getComputedStyle(inlineCode).backgroundColor;
      if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
        throw new Error('인라인 코드는 Code 인라인 칩과 같은 틴트 배경으로 조판되어야 합니다.');
      }
    }
    // 코드 블록은 네이비 표면(투명 아님).
    const preBg = doc.defaultView.getComputedStyle(pre).backgroundColor;
    if (preBg === 'rgba(0, 0, 0, 0)' || preBg === 'transparent') {
      throw new Error('코드 블록은 Code 블록과 같은 네이비 표면으로 조판되어야 합니다.');
    }
  },
};

export const NarrowReflow = {
  name: '반응형 · 320px 좁은 폭',
  parameters: storyDescription(
    '320px 폭에서 형식화 콘텐츠가 컨테이너를 넘치지 않는지 확인하는 상황입니다. 읽기 폭(measure)이 좁은 폭 안으로 접히고, 긴 식별자·인라인 코드처럼 끊을 수 없는 문자열이 가로 overflow 없이 줄바꿈되는지 확인하세요.',
  ),
  render: () => (
    <main data-testid="prose-narrow" style={{ width: 320, maxWidth: '100%', padding: 'var(--space-3)' }}>
      <Prose>
        <h2>좁은 폭 점검</h2>
        <p>
          긴 식별자도 컨테이너를 넘기지 않아야 합니다:{' '}
          <code>lkr-control-dispatch-supervision-endpoint-2026</code>.
        </p>
        <ul>
          <li>대덕 A동 관제 라인 재기동</li>
          <li>맵 타일 캐시 재생성</li>
        </ul>
        <pre>
          <code>{`systemctl restart lkr-control-dispatch-supervision-endpoint`}</code>
        </pre>
      </Prose>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const wrapper = canvasElement.querySelector('[data-testid="prose-narrow"]');
    const prose = wrapper?.querySelector('.lk-prose');
    if (!wrapper || !prose) throw new Error('좁은 폭 Prose 픽스처가 렌더되어야 합니다.');
    if (prose.scrollWidth > prose.clientWidth + 1) {
      throw new Error('끊을 수 없는 긴 문자열도 가로 overflow 없이 줄바꿈되어야 합니다.');
    }
    if (wrapper.scrollWidth > wrapper.clientWidth + 1) {
      throw new Error('Prose는 320px 컨테이너에서 가로 스크롤을 만들지 않아야 합니다.');
    }
  },
};

export const ProseCard = {
  name: 'Prose card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 520, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
      <Prose>
        <h2>점검 공지</h2>
        <p>
          금일 <strong>18:00</strong>부터 관제 서버 점검을 진행합니다. <code>lkr-control</code> 재기동이 포함됩니다.
        </p>
        <blockquote>복구 예정 시각을 본문에 명확히 적어 주세요.</blockquote>
        <pre>
          <code>{`systemctl restart lkr-control`}</code>
        </pre>
      </Prose>
    </div>
  ),
};
