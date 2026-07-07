import { Rating } from '../src/index.js';
import { RatingCard as RatingCardStory } from './Feedback.shared.jsx';

const meta = {
  title: 'LDS Product/Feedback/Rating',
  parameters: {
    docs: {
      description: {
        component: '사용자 평가나 만족도처럼 별점 값을 보여주고 입력받는 Rating 패턴입니다.',
      },
    },
  },
};

export default meta;

export const RatingPatterns = {
  name: '평점',
  render: () => (
    <main style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
      <Rating defaultValue={4} />
      <Rating value={3} readOnly size={18} />
    </main>
  ),
};

export const RatingCard = { ...RatingCardStory, name: 'Rating card parity', tags: ['!dev', 'visual-parity'] };

