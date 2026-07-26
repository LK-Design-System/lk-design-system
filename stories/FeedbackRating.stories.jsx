import { userEvent, waitFor } from 'storybook/test';
import { Rating } from '../src/index.js';
import { RatingCard as RatingCardStory } from './Feedback.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Feedback/Rating',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-product-feedback-rating--rating-patterns',
      eyebrow: 'Product / Rating',
      title: '사용자가 만족도를 빠르게 평가하고 기존 평가를 읽습니다',
      description:
        '콘텐츠·서비스에 대한 순서형 만족도를 입력받거나 요약해 보여 줄 때 적합합니다. 정밀한 수치 입력이나 여러 기준의 설문에는 별점 대신 Number Field 또는 별도 설문 패턴을 사용하세요.',
    },
    docs: {
      description: {
        component: '사용자 평가나 만족도처럼 별점 값을 보여주고 입력받는 Rating 패턴입니다.',
      },
    },
  },
};

export default meta;

export const RatingPatterns = {
  name: '개요',
  parameters: storyDescription(
    '사용자가 직접 입력하는 평점과 읽기 전용 평점을 함께 비교하는 상황입니다. 입력용 별점은 화살표 키로 조작되고 "5점 만점에 4점"처럼 값이 낭독되며, 읽기 전용 별점은 값 자체가 이름인 이미지로 전달되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
      <Rating defaultValue={4} label="사용 만족도" />
      <Rating value={3} readOnly size={18} />
    </main>
  ),
};

function starColors(root) {
  return Array.from(root.children).map((star) => getComputedStyle(star).color);
}

export const RatingValueContract = {
  name: '평점 키보드와 값 낭독 계약',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', justifyItems: 'start' }}>
      <Rating data-contract="input" defaultValue={3} label="배송 만족도" />
      <Rating data-contract="display" value={4.5} readOnly />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const input = canvasElement.querySelector('[data-contract="input"]');
    const display = canvasElement.querySelector('[data-contract="display"]');
    if (!input || !display) throw new Error('Rating contract targets are required.');

    if (input.getAttribute('role') !== 'slider') throw new Error('입력 모드 별점은 role="slider"여야 합니다.');
    if (input.getAttribute('tabindex') !== '0') throw new Error('입력 모드 별점은 tab stop 하나를 가져야 합니다.');
    if (input.getAttribute('aria-label') !== '배송 만족도') throw new Error('입력 모드 별점에는 한국어 접근 이름이 필요합니다.');
    if (input.getAttribute('aria-valuemin') !== '0' || input.getAttribute('aria-valuemax') !== '5') {
      throw new Error('입력 모드 별점은 0..max 범위를 노출해야 합니다.');
    }
    if (input.getAttribute('aria-valuenow') !== '3' || input.getAttribute('aria-valuetext') !== '5점 만점에 3점') {
      throw new Error('입력 모드 별점은 현재 값과 값 문구를 함께 노출해야 합니다.');
    }
    if (input.querySelectorAll(':scope > [aria-hidden="true"]').length !== 5) {
      throw new Error('별 글리프는 모두 aria-hidden이어야 값이 한 번만 낭독됩니다.');
    }

    input.focus();
    if (doc.activeElement !== input) throw new Error('입력 모드 별점은 키보드 포커스를 받아야 합니다.');
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => {
      if (input.getAttribute('aria-valuenow') !== '4' || input.getAttribute('aria-valuetext') !== '5점 만점에 4점') {
        throw new Error('ArrowRight는 값을 한 칸 올려야 합니다.');
      }
    });
    await userEvent.keyboard('{End}');
    await waitFor(() => {
      if (input.getAttribute('aria-valuenow') !== '5') throw new Error('End는 만점으로 이동해야 합니다.');
    });
    await userEvent.keyboard('{Home}');
    await waitFor(() => {
      if (input.getAttribute('aria-valuenow') !== '0') throw new Error('Home은 0점으로 이동해야 합니다.');
    });
    await userEvent.keyboard('{ArrowUp}{ArrowUp}{ArrowUp}');
    await waitFor(() => {
      if (input.getAttribute('aria-valuenow') !== '3') throw new Error('ArrowUp도 값을 올려야 합니다.');
    });

    if (display.getAttribute('role') !== 'img') throw new Error('읽기 전용 별점은 role="img"여야 합니다.');
    if (display.getAttribute('aria-label') !== '5점 만점에 4.5점') {
      throw new Error('읽기 전용 별점의 이름이 값 자체여야 합니다.');
    }
    if (display.hasAttribute('tabindex')) throw new Error('읽기 전용 별점은 포커스를 받지 않아야 합니다.');
    const colors = starColors(display);
    if (colors[3] === colors[4]) throw new Error('반개 별은 없습니다. 4.5는 별 4개만 채워야 합니다.');
    if (colors[0] !== colors[3]) throw new Error('채워진 별은 같은 색이어야 합니다.');

    // Restore the story's named state.
    input.blur();
  },
};

export const RatingCard = { ...RatingCardStory, name: 'Rating card parity', tags: ['!dev', 'visual-parity'] };
