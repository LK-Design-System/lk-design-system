import { Rating } from '../src/index.js';
import { RatingCard as RatingCardStory } from './Feedback.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Feedback/Rating',
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
    '사용자가 직접 입력하는 평점과 읽기 전용 평점을 함께 비교하는 상황입니다. 선택 가능 여부와 현재 값이 시각적으로 구분되고 보조기술에도 전달되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
      <Rating defaultValue={4} />
      <Rating value={3} readOnly size={18} />
    </main>
  ),
};

export const RatingCard = { ...RatingCardStory, name: 'Rating card parity', tags: ['!dev', 'visual-parity'] };
