import { Link } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Action/Link',
  tags: ['autodocs'],
  component: Link,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-action-link--links',
      eyebrow: 'Product / Link',
      title: '사용자가 관련 목적지와 외부 자료로 이동할 수 있음을 문장 안에서 이해합니다',
      description:
        '현재 콘텐츠와 관련된 내부 목적지나 외부 문서를 앵커 탐색으로 연결할 때 적합합니다. 저장·삭제처럼 현재 상태를 변경하거나 로딩 상태가 필요한 작업에는 Link 대신 Button 또는 Text Button을 사용하세요.',
    },
    docs: {
      description: {
        component: 'Link는 내부·외부 목적지로 이동하는 앵커 의미와 밑줄·tone·외부 링크 표시를 제공합니다.',
      },
    },
  },
};

export default meta;

export const Links = {
  name: '개요',
  parameters: storyDescription(
    '본문에서 관련 컴포넌트 안내와 외부 문서를 연결하는 상황입니다. 링크 문구만으로 목적지를 예측할 수 있고, 외부 이동이 아이콘·새 탭·안전한 rel과 함께 "새 창에서 열림" 안내로도 전달되는지 확인하세요.',
  ),
  play: async ({ canvasElement }) => {
    const [internal, external] = Array.from(canvasElement.querySelectorAll('a'));
    if (!internal || !external) throw new Error('Link contract targets are required.');

    const name = (element) => element.textContent.replace(/\s+/g, ' ').trim();
    if (name(internal) !== '관련 컴포넌트 안내') throw new Error('내부 링크 이름에 군더더기가 붙으면 안 됩니다.');
    if (name(external) !== '외부 제품 문서 새 창에서 열림') {
      throw new Error('외부 링크는 새 창에서 열린다는 사실이 접근 이름에 포함되어야 합니다.');
    }
    if (external.target !== '_blank' || external.rel !== 'noopener noreferrer') {
      throw new Error('외부 링크는 새 탭과 안전한 rel을 함께 가져야 합니다.');
    }
    if (internal.hasAttribute('target')) throw new Error('내부 링크는 새 탭으로 열지 않습니다.');
  },
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 680 }}>
      <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
        인접 컴포넌트를 선택하는 기준은{' '}
        <Link href="#related-components" underline="always">
          관련 컴포넌트 안내
        </Link>
        에서 확인하세요.
      </p>
      <p id="related-components" style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
        배포 환경과 API 계약은{' '}
        <Link href="https://design.lkrobotics.dev/docs" external>
          외부 제품 문서
        </Link>
        를 참고하세요.
      </p>
    </main>
  ),
};
